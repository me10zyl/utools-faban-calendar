<script lang="ts">
import {computed, defineComponent, nextTick, onMounted, onUpdated, reactive, ref, watch} from "vue";
import {Command, CommandItem, ExecCallback, Item, SelectCustomForm, SelectEnv, SelectProject} from "../js/calendar";
import myStorage from "../js/myStorage";
import {deepClone, generateRandomString, now} from "../js/util";
import router from '../router'
import {ElMessage} from "element-plus";
import myUtools, {CmdVars} from "../js/myUtools";
import ImportDialog from "./ImportDialog.vue";
import ExportDialog from "./ExportDialog.vue";
import {Project} from "../js/options";
import RefreshDialog from "./RefreshDialog.vue";
import {basicSetup, EditorView} from "codemirror";
import {sql} from "@codemirror/lang-sql";
import {onRenderTriggered} from "@vue/runtime-core";
import CodeMirror from "@/components/CodeMirror.vue";
import CommandDialog from "@/components/CommandDialog.vue";
import CmdStatus from "@/components/CmdStatus.vue";


export default defineComponent({
  components: {CmdStatus, CommandDialog, CodeMirror, RefreshDialog, ExportDialog, ImportDialog},
  setup: (props, ctx) => {
    const items = reactive<Item[]>([])
    const projectInit: SelectProject = {
      isUpdateConfigCenter: false,
      isUpdateSQL: false,
      projectInfo: "",
      sql: "",
      updateConfigCenterText: "",
      selectCustomForms: [],
      selectEnvs: [],
      selectProjectName: "",
      branch: "",
      customForms: [],
      envs: []
    }
    console.log('setup.' + new Date())
    const init: Item = {
      createTime: "",
      id: "",
      projects: [deepClone(projectInit)],
      reqName: "",
      selected: false,
      status: 'normal'
    };
    const dynamic = deepClone(init)
    const selectItem = ref<Item>(dynamic);
    const options = myStorage.getOptions();
    const deleteItem = () => {
      items.splice(items.findIndex(e => e.id === selectItem.value.id), 1)
      reset()
    }

    function unSelectAll(): void {
      items.forEach(e => e.selected = false)
    }

    function reset() {
      selectItem.value = deepClone(init)
    }

    const clickNew = () => {
      unSelectAll()
      reset();
      selectItem.value.id = generateRandomString()
      selectItem.value.createTime = now();
      selectItem.value.selected = true
      items.push(selectItem.value)
    }
    const clickItem = (item: Item) => {
      unSelectAll()
      item.selected = true
      selectItem.value = item
      item.projects.forEach(p => {
        projectChange(p)
      })
      activeAnchor.value = 'col0'
      activeNames.value = ['col0']
    }
    const disableItem = () => {
      if (selectItem.value.status === 'normal') {
        selectItem.value.status = 'abandon';
      } else if (selectItem.value.status === 'abandon') {
        selectItem.value.status = 'normal'
      } else if (selectItem.value.status === 'finished') {
        ElMessage('已完成状态不能被废弃')
      }
    }
    const startWatch = () => {
      return watch(items, (value: Item[], oldValue, onCleanup) => {
        myStorage.saveCalendar(items);
        const errors = checkSuccess(selectItem.value);
        if (errors.length === 0 && selectItem.value.status === 'normal') {
          selectItem.value.status = 'finished'
        } else if (errors.length > 0 && selectItem.value.status !== 'abandon') {
          selectItem.value.status = 'normal'
        }
      });
    }

    const watchRef = startWatch()

    onMounted(() => {
      refreshList()
    })
    onUpdated(() => {
      let cols = document.querySelectorAll('.col')
      mainEl.value.addEventListener("scroll", (event) => {
        activeAnchor.value = 'col0'
        let active = false;
        for(let i = cols.length - 1; i >= 0; i--){
          //@ts-ignore
          if(mainEl.value.scrollTop >= (cols[i].offsetTop - mainEl.value.offsetTop) && !active){
            activeAnchor.value = 'col' + i
            active = true;
          }
        }
      });
    })
    const goToSettings = () => {
      myUtools.redirect("Options")
    }

    function checkSuccess(item: Item): string[] {
      const result = []
      for (let i in item.projects) {
        const project: SelectProject = item.projects[i];
        const errors = [];
        if (!project.projectName) {
          errors.push("有未选择的项目")
          return errors;
        }
        if (!(project.isUpdateSQL && project.showSQL)) {
          errors.push("未执行SQL")
        }
        if (!(project.isUpdateConfigCenter && project.isUpdateConfigCenter)) {
          errors.push("未修改配置中心配置")
        }
        if (project.selectEnvs.length > 0) {
          let strings1 = [];
          let strings2 = []
          project.selectEnvs.filter(e => !e.isPublished || !e.isMergedFabanBranch).forEach(e => {
            if (!e.isPublished) {
              strings1.push(e.envName)
            }
            if (!e.isMergedFabanBranch) {
              strings2.push(e.fabanBranchName)
            }
          })
          if (strings2.length > 0) {
            errors.push('未合并' + strings2.join(',') + '分支')
          }
          if (strings1.length > 0) {
            errors.push('未发布' + strings1.join(',') + '环境')
          }
        }
        if (project.selectCustomForms.length > 0) {
          let stringValue = project.selectCustomForms.filter(e => e.type === 'checkbox' && !(e.value)).map(e => {
            return "未勾选" + e.label;
          }).join(",");
          if (stringValue) {
            errors.push(stringValue)
          }
        }
        if (errors.length > 0) {
          for (let i = 0; i < errors.length; i++) {
            result.push(project.projectName + errors[i]);
          }
        }
      }
      return result;
    }

    const checkSuccessText = computed(() => {
      let text = checkSuccess(selectItem.value);
      return text.length === 0 ? ['已完成'] : text
    })

    const importDialog = ref<InstanceType<typeof ImportDialog>>()
    const exportDialog = ref<InstanceType<typeof ExportDialog>>()
    const refreshConfigDialog = ref<InstanceType<typeof RefreshDialog>>()
    const clearAll = () => {
      items.splice(0, items.length)
    }

    const projectChange = (project: SelectProject) => {
      Object.assign(project, options.projects.find(e => e.projectName === project.selectProjectName));
      if (project.envs) {
        project.envs.forEach((e, index) => {
          if (project.selectEnvs && index in project.selectEnvs) {
            Object.assign(project.selectEnvs[index], e)
          } else {
            const selectEnv: SelectEnv = {
              selectEnvName: e.envName
            }
            project.selectEnvs.push(Object.assign(selectEnv, e))
          }
        })
      }
      if (project.customForms) {
        project.customForms.forEach((e, index) => {
          if (project.selectCustomForms && index in project?.selectCustomForms) {
            Object.assign(project.selectCustomForms[index], e)
          } else {
            const select: SelectCustomForm = {
              selectLabel: e.label,
              value: undefined
            }
            project.selectCustomForms.push(Object.assign(select, e))
          }
        })
      }
    }


    const refreshList = () => {
      watchRef()
      items.splice(0, items.length)
      const calendars = myStorage.getCalendars();
      startWatch()
      calendars.forEach(e => {
        items.push(e)
      });
      items.forEach(e => {
        if (e.selected) {
          clickItem(e)
        }
      })
    }

    const newProject = () => {
      selectItem.value.projects.push(deepClone(projectInit))
    }
    const deleteProject = (project) => {
      selectItem.value.projects.splice(selectItem.value.projects.indexOf(project), 1)
    }
    const exec = (cmd: string, vars: CmdVars): void => {
      execResult.value.exitCode = undefined;
      execResult.value.commands.splice(0, execResult.value.commands.length)
      execResult.value.execScript = ''
      commandDialog.value.show()
      let script = myUtools.evaluateCmd(cmd, vars, (e: ExecCallback) => {
        console.log(e.type + ":", e.data)
        if (e.type === 'finished') {
          execResult.value.exitCode = e.data as number
        } else {
          execResult.value.commands.push({
            type: e.type,
            text: e.data as string
          })
        }
      })
      execResult.value.execScript = script;
    }

    const execResult = ref<Command>({
      commands: [],
      exitCode: undefined,
      execScript: ""
    });
    const commandDialog = ref<InstanceType<typeof CommandDialog>>()
    const font = reactive({
      color: 'rgba(0, 0, 0, .15)',
    })
    const mainEl = ref<HTMLElement>(null)
    const projectEls = ref<HTMLElement[]>([])
    const clickAnchor = (index)=>{
      let id = 'col' + index;
      activeNames.value = [id]
      nextTick(()=>{
        document.getElementById(id).scrollIntoView()
      })
    }
    const activeNames = ref<string[]>(['col' + 0])
    const activeAnchor = ref<string>('col0')
    const newBranch = (cmd: string, vars : CmdVars, project: SelectProject)=>{
      if(!project.branch || project.branch.trim() === ''){
        ElMessage('分支名不能为空')
        return
      }
      exec(cmd, vars)
      myUtools.copy(project.branch.trim())
      ElMessage('已复制分支名:' + project.branch.trim())
    }
    return {
      activeAnchor,
      activeNames,
      clickAnchor,
      projectEls,
      mainEl,
      font,
      importDialog,
      items,
      selectItem,
      options,
      deleteItem,
      clickNew,
      clickItem,
      disableItem,
      goToSettings,
      checkSuccessText,
      exportDialog,
      clearAll,
      refreshList,
      projectChange,
      newProject,
      deleteProject,
      myUtools,
      refreshConfigDialog,
      execResult,
      commandDialog,
      exec,
      newBranch
    }
  }
})
</script>

<template>
  <el-row style="margin: 0;padding: 0">
    <el-col class="left">
      <div class="toolbox">
        <el-button @click="clickNew" size="small">新建</el-button>
        <el-popconfirm title="确认删除?" cancel-button-text="取消" confirm-button-text="确认" @confirm="deleteItem">
          <template #reference>
            <el-button>删除</el-button>
          </template>
        </el-popconfirm>
        <el-button @click="disableItem">废弃</el-button>
        <el-button @click="goToSettings">设置</el-button>
        <el-dropdown trigger="click" style="padding-left: 7px">
            <span>
              <el-link style="font-size: calc(var(--fontSize) - 4px)">更多</el-link>
            </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="importDialog.show()">导入</el-dropdown-item>
              <el-dropdown-item @click="exportDialog.show()">导出</el-dropdown-item>
              <el-dropdown-item>
                <el-popconfirm title="确认清空?清空后所有发版日历将无法恢复" cancel-button-text="取消"
                               confirm-button-text="确认"
                               @confirm="clearAll">
                  <template #reference>
                    清空
                  </template>
                </el-popconfirm>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-divider style="margin-top: calc(var(--toolHeight) + 10px);  margin-bottom: 0; padding-bottom: 0;height: 0"/>
      <ol class="list">
        <li v-for="item in items" :class="{'select-active': item.selected, 'abandon' : item.status === 'abandon'
        , success: item.status === 'finished'}"
            @click="clickItem(item)"
            style="cursor: pointer">
          {{ item.reqName || '新建需求' }}
        </li>
      </ol>
    </el-col>
    <el-col class="right">
      <div :class="{title:true, abandon: selectItem.status === 'abandon', success: selectItem.status === 'finished'}">
        {{ selectItem.reqName || (items.filter(e => e.selected).length > 0 ? '新建需求' : '') }}
      </div>
      <el-divider class="dividers"/>
      <div class="anchor">
        <div v-for="(project, index) in selectItem.projects" :class="{'active' :activeAnchor === ('col' + index)}"
        @click="clickAnchor(index)">{{ project.projectName }}</div>
      </div>
      <div class="main" v-if="selectItem.id !== ''" ref="mainEl">
        <el-form :model="selectItem">
          <el-form-item label="需求名称" :label-width="100">
            <el-col :span="16">
              <el-input v-model="selectItem.reqName"/>
            </el-col>
          </el-form-item>
          <template v-for="(project, index) in selectItem.projects">
            <div :id="'col' + index" class="col" :model="activeNames" >
              <el-divider v-if="index !== 0" style="margin-bottom:10px"/>
              <div class="leftProjectName">{{project.projectName}}</div>
              <div :title="project.projectName ? project.projectName : '选择项目...'" :name="'col'  + index">
                <div :font="font" :content="project.projectName" :z-index="-999" >
                  <el-form-item label="选择项目" :label-width="100">
                    <el-col :span="8">
                      <el-select v-model="project.selectProjectName" @change="projectChange(project)"
                                 placeholder="选择项目">
                        <el-option v-for="project in options.projects"
                                   :key="project.projectName"
                                   :label="project.projectName"
                                   :value="project.projectName"
                        >
                        </el-option>
                      </el-select>
                    </el-col>
                    <div style="margin-left: 10px">
                      <el-input v-model="project.branch" placeholder="填写本需求新建的分支"
                                v-if="project"/>
                    </div>
                    <div style="margin-left: 10px;">
                      <el-button v-if="project.newBranchCmd"
                                 @click="newBranch(project.newBranchCmd, {
                              project: project
                           }, project)">新建分支
                      </el-button>
                    </div>
                  </el-form-item>

                  <div style="margin-bottom: 18px;padding-left: 100px">
                    <el-text>{{ project.projectDesc }}</el-text>
                  </div>
                  <el-form-item :label-width="100" v-if="project.showSQL">
                    <el-checkbox v-model="project.isUpdateSQL">已更数据库</el-checkbox>
                    <!--              <el-input type="textarea" placeholder="数据库文本" v-model="selectItem.sql"/>-->
                    <CodeMirror v-model="project.sql" lang="sql"/>
                  </el-form-item>
                  <el-form-item :label="project.configCenterName + '配置'" :label-width="100"
                                v-if="project.showConfigCenter">
                    <el-checkbox v-model="project.isUpdateConfigCenter">
                      已更新{{ project.configCenterName }}配置
                    </el-checkbox>
                    <el-input type="textarea" :placeholder="project.configCenterName + '配置'"
                              v-model="project.updateConfigCenterText"/>
                  </el-form-item>
                  <el-form-item :label="customForm.label" :label-width="100"
                                v-for="(customForm, index) in project.selectCustomForms">
                    <el-button v-if="customForm.type === 'button'" v-model="customForm.value"
                               @click="exec(customForm.buttonCmd, {
                              project: project,
                              customForm: customForm
                           })"
                    >{{ customForm.label }}
                    </el-button>
                    <el-checkbox v-if="customForm.type === 'checkbox'"
                                 v-model="customForm.value"></el-checkbox>
                    <el-input v-if="customForm.type === 'input'" v-model="customForm.value"/>
                  </el-form-item>
                  <el-form-item :label="env.envName + '环境'" :label-width="100"
                                v-for="(env, index) in project.selectEnvs" class="env">
                    <el-checkbox v-model="env.isMergedFabanBranch">已合并到{{
                        env.fabanBranchName
                      }}分支
                    </el-checkbox>
                    <el-checkbox v-model="env.isPublished">已发版</el-checkbox>
                    <el-link :href="env.jenkinsUrl" @click="myUtools.shellOpen(env.jenkinsUrl)" v-if="env.jenkinsUrl"
                             target="_blank" class="link">jenkins地址
                    </el-link>
                    <el-link :href="env.envTestUrl" @click="myUtools.shellOpen(env.envTestUrl)" v-if="env.envTestUrl"
                             target="_blank" class="link">
                      {{ env.envName }}环境地址
                    </el-link>
                    <el-button @click="exec(env.mergeBranchCmd, {
                              project: project,
                              env:env
                           })" v-if="env.mergeBranchCmd" class="link">
                      合并{{ project.branch }}到{{ env.fabanBranchName }}分支
                    </el-button>
                    <el-button @click="exec(env.publishCmd, {
                              project: project,
                              env:env
                           })" v-if="env.publishCmd">{{ env.envName }}环境发布{{ project.projectName }}
                    </el-button>
                    <CmdStatus :cmd-vars="{
                              project: project,
                              env:env
                           }" :cmd="env.statusMergedCmd">检查是否已合并到{{ env.fabanBranchName }}分支</CmdStatus>
                  </el-form-item>
                  <el-form-item label="项目说明" :label-width="100" v-if="project.showProjectInfo">
                    <el-row style="width: 100%">
                      <el-col :span="15">
                        <el-input type="textarea" v-model="project.projectInfo" :rows="5"/>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <div style="display: flex;justify-content: right;">
                    <el-button type="warning" @click="deleteProject(project)">移除项目
                      {{ project.selectProjectName ? project.selectProjectName : '' }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div style="display: flex;justify-content: right;margin-top: 15px">
            <el-button @click="newProject" type="primary">
              新加一个项目
            </el-button>
          </div>
        </el-form>
        <el-divider/>
        <div
            :class="{successText: true, success: selectItem.status === 'finished', error: selectItem.status !== 'finished' && selectItem.status !== 'abandon'}">
          <span>需求状态：</span>
          <div v-for="text in checkSuccessText">
            <el-tag :type="selectItem.status === 'finished' ? 'success' : 'danger'">
              {{ text }}
            </el-tag>
          </div>
        </div>
        <div style="padding-left: 20px;display: flex;align-items: center;justify-content: end">
          <div>
            <el-popconfirm title="确认删除?" cancel-button-text="取消" confirm-button-text="确认"
                           @confirm="deleteItem">
              <template #reference>
                <el-button type="danger">删除此需求</el-button>
              </template>
            </el-popconfirm>
          </div>
          <div style="display: flex;justify-content: end;align-items: end;margin-left: 15px" class="create-time">
            创建时间 {{ selectItem.createTime }}
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <ImportDialog ref="importDialog" @importOK="refreshList"/>
  <ExportDialog ref="exportDialog"/>
  <RefreshDialog ref="refreshConfigDialog" :select-item="selectItem"/>
  <CommandDialog :execute-result="execResult" ref="commandDialog"/>
</template>

<style scoped>
:deep(.el-collapse-item__header) {
  background-color: #cccccc44;
  color: var(--fontColor);
  padding-left: 25px;
}

:deep(.el-collapse-item__wrap) {
  background-color: #00000000;
}

:deep(.el-collapse-item__content) {
  padding-top: 10px;
}

:deep(.env .el-form-item__content ) {
  gap: 10px;
}

:deep(.env .el-checkbox) {
  margin-right: 0;
}

:deep(.env .el-button+.el-button) {
  margin-left: 0;
}

.link {
  font-size: calc(var(--fontSize) - 2px);
}

.leftProjectName{
  font-size: calc(var(--fontSize) + 2px);
  font-weight: bold;
  margin-bottom: 5px;
  margin-left: 10px;
  color: var(--fontColor);
}

.anchor {
  display: flex;
  font-size: 12px;
  color: #5f6165;
  padding: 5px 15px 5px 15px;
  gap: 5px;
}

.anchor div {
  cursor: pointer;
}

.anchor div.active {
  color: #337ecc;
  text-decoration: underline;
}

.select-active {
  background: #5f616522;
}

.dividers {
  margin-bottom: 0;
  margin-top: 5px
}

.left {
  background: #cccccc44;
  height: 97vh;
  max-width: 32%;
  flex: 0 0 32%;
}

.right {
  height: 97vh;
  max-width: 68%;
  flex: 0 0 68%;
}

.list {
  padding: 0 0 0 0;
  margin: 0;
  font-size: var(--fontSize);
  color: var(--fontColor);
  overflow-y: auto;
  height: calc(100% - var(--toolHeight) - 11px);
}


.list li {
  list-style: none;
  padding: 5px 0 0 15px;
}

.toolbox {
  margin-top: 5px;
  margin-left: 5px;
  position: fixed;
  display: flex;
  align-items: center;
  font-size: calc(var(--fontSize) - 2px);
}

.toolbox button {
  margin-top: 5px;
  margin-left: 5px;
}

.title {
  font-weight: bolder;
  display: flex;
  align-items: center;
  font-size: calc(var(--fontSize) + 9px);
  padding-top: 5px;
  padding-left: 20px;
  height: var(--toolHeight);

}

.main {
  padding-top: 5px;
  height: calc(100% - var(--toolHeight) - 45px);
  overflow-y: scroll;
  padding-bottom: 5px;
}

.create-time {
  font-size: var(--fontSize);
  color: var(--fontColor);
}

.abandon {
  text-decoration: line-through;
}

.successText {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: end;
  margin-bottom: 10px;
  gap: 5px;
}

.CodeMirror-lines {
  min-height: 200px;
}

.error {
  color: #F56C6C;
}

.success {
  color: #67C23A;
}

.success::before {
  content: '√';
}
</style>