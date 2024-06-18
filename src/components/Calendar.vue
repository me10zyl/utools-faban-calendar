<script lang="ts">
import {computed, defineComponent, onMounted, reactive, ref, watch} from "vue";
import {Item} from "../js/calendar";
import myStorage from "../js/myStorage";
import {generateRandomString, now} from "../js/util";
import router from '../router'
import {ElMessage} from "element-plus";

export default defineComponent({
  setup: (props, ctx) => {
    const items = reactive<Item[]>([])
    const init: Item = {
      id: '',
      selected: true,
      selectProjectName: "",
      createTime: "",
      isUpdateConfigCenter: false,
      isUpdateSQL: false,
      project: undefined,
      projectInfo: "",
      reqName: "",
      selectBranch: "",
      sql: "",
      updateConfigCenterText: "",
      status: 'normal'
    };
    const dynamic = Object.assign({}, init) as Item
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
      selectItem.value = Object.assign({}, init) as Item
    }

    const clickNew = () => {
      unSelectAll()
      reset();
      selectItem.value.id = generateRandomString()
      selectItem.value.createTime = now();
      items.push(selectItem.value)
    }
    const changeSelectProject = (changed) => {
      selectItem.value.project = options.projects.find(e => e.projectName === changed);
    }
    const clickItem = (item: Item) => {
      unSelectAll()
      item.selected = true
      selectItem.value = item
    }
    const disableItem = () => {
      if (selectItem.value.status === 'normal') {
        selectItem.value.status = 'abandon';
      } else if(selectItem.value.status === 'abandon') {
        selectItem.value.status = 'normal'
      } else if(selectItem.value.status === 'finished'){
        ElMessage('已完成状态不能被废弃')
      }
    }
    watch(items, (value: Item[], oldValue, onCleanup) => {
      myStorage.saveCalendar(items);
      const errors = checkSuccess(selectItem.value);
      if (errors.length === 0 && selectItem.value.status === 'normal') {
        selectItem.value.status = 'finished'
      }else if(errors.length > 0 && selectItem.value.status !== 'abandon'){
        selectItem.value.status = 'normal'
      }
    })
    onMounted(() => {
      const calendars = myStorage.getCalendars();
      calendars.forEach(e => {
        items.push(e)
      });
      items.forEach(e => {
        if (e.selected) {
          clickItem(e)
        }
      })
    })
    const goToSettings = () => {
      router.push('/options')
    }

    function checkSuccess(item: Item): string[] {
      const errors = [];
      if(!item.project){
        errors.push("未选择项目")
        return errors;
      }
      if (!(item.isUpdateSQL && item.project.showSQL)) {
        errors.push("未执行SQL")
      }
      if (!(item.isUpdateConfigCenter && item.isUpdateConfigCenter)) {
        errors.push("未修改配置中心配置")
      }
      if (item.project.envs.length > 0) {
        let strings1 = [];
        let strings2 = []
        item.project.envs.filter(e => !e.isPublished || !e.isMergedFabanBranch).forEach(e => {
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
      if (item.project.customForms.length > 0) {
        let stringValue = item.project.customForms.filter(e => e.type === 'checkbox' && !(e.value)).map(e => {
          return "未勾选" + e.label;
        }).join(",");
        if (stringValue) {
          errors.push(stringValue)
        }
      }
      return errors;
    }

    const checkSuccessText = computed(() => {
      let text = checkSuccess(selectItem.value);
      return text.length === 0 ? '已完成': text.join(' ')
    })

    return {
      items,
      selectItem,
      options,
      deleteItem,
      clickNew,
      changeSelectProject,
      clickItem,
      disableItem,
      goToSettings,
      checkSuccessText
    }
  }
})
</script>

<template>
  <el-row style="margin: 0;padding: 0">
    <el-col :span="8" class="left">
      <div class="toolbox">
        <el-button @click="clickNew">新建</el-button>
        <el-popconfirm title="确认删除?" cancel-button-text="取消" confirm-button-text="确认" @confirm="deleteItem">
          <template #reference>
            <el-button>删除</el-button>
          </template>
        </el-popconfirm>
        <el-button @click="disableItem">废弃</el-button>
        <el-button @click="goToSettings">设置</el-button>
      </div>
      <el-divider class="dividers"/>
      <ol class="list">
        <li v-for="item in items" :class="{'select-active': item.selected, 'abandon' : item.status === 'abandon'
        , success: item.status === 'finished'}"
            @click="clickItem(item)"
            style="cursor: pointer">
          {{ item.reqName || '新建需求' }}
        </li>
      </ol>
    </el-col>
    <el-col :span="16" class="right">
      <div :class="{title:true, abandon: selectItem.status === 'abandon', success: selectItem.status === 'finished'}">
        {{ selectItem.reqName || (items.filter(e => e.selected).length > 0 ? '新建需求' : '') }}
      </div>
      <el-divider class="dividers"/>
      <div class="main">
        <el-form :model="selectItem" v-if="selectItem.id !== ''">
          <el-form-item label="需求名称" :label-width="100">
            <el-col :span="6">
              <el-input v-model="selectItem.reqName"/>
            </el-col>
          </el-form-item>
          <el-form-item label="选择项目" :label-width="100">
            <el-col :span="6">
              <el-select v-model="selectItem.selectProjectName" @change="changeSelectProject"
                         placeholder="选择的项目名称">
                <el-option v-for="project in options.projects"
                           :key="project.projectName"
                           :label="project.projectName"
                           :value="project.projectName"
                >
                </el-option>
              </el-select>
            </el-col>
            <div style="margin-left: 10px">
              <el-input v-model="selectItem.project.branch" placeholder="填写本需求新建的分支"
                        v-if="selectItem.project"/>
            </div>
            <div style="margin-left: 10px">
              <el-button>复制分支名称</el-button>
            </div>
            <div style="margin-left: 10px">
              <el-button>新建分支</el-button>
            </div>
          </el-form-item>
          <template v-if="selectItem.project">
            <el-form-item :label-width="100" v-if="selectItem.project.showSQL">
              <el-checkbox v-model="selectItem.isUpdateSQL">已更数据库</el-checkbox>
              <el-input type="textarea" placeholder="数据库文本" v-model="selectItem.sql"/>
            </el-form-item>
            <el-form-item :label="selectItem.project.configCenterName + '配置'" :label-width="100"
                          v-if="selectItem.project.showConfigCenter">
              <el-checkbox v-model="selectItem.isUpdateConfigCenter">
                已更新{{ selectItem.project.configCenterName }}配置
              </el-checkbox>
              <el-input type="textarea" :placeholder="selectItem.project.configCenterName + '配置'"
                        v-model="selectItem.updateConfigCenterText"/>
            </el-form-item>
            <el-form-item :label="customForm.label" :label-width="100"
                          v-for="customForm in selectItem.project.customForms">
              <el-button v-if="customForm.type === 'button'" v-model="customForm.value"></el-button>
              <el-checkbox v-if="customForm.type === 'checkbox'" v-model="customForm.value"></el-checkbox>
              <el-input v-if="customForm.type === 'input'" v-model="customForm.value"/>
            </el-form-item>
            <el-form-item :label="env.envName + '环境'" :label-width="100" v-for="env in selectItem.project.envs">
              <el-checkbox v-model="env.isMergedFabanBranch">已合并到{{ env.fabanBranchName }}分支</el-checkbox>
              <el-checkbox v-model="env.isPublished">已发版</el-checkbox>
            </el-form-item>
            <el-form-item label="项目说明" :label-width="100" v-if="selectItem.project.showProjectInfo">
              <el-row style="width: 100%">
                <el-col :span="12">
                  <el-input type="textarea" v-model="selectItem.projectInfo" :rows="10"/>
                </el-col>
              </el-row>
            </el-form-item>
          </template>

          <div
              :class="{successText: true, success: selectItem.status === 'finished', error: selectItem.status !== 'finished' && selectItem.status !== 'abandon'}">
            状态：<span>{{ checkSuccessText }}</span>
          </div>
          <div style="padding-left: 20px;display: flex;align-items: center;justify-content: end">
            <div>
              <el-popconfirm title="确认删除?" cancel-button-text="取消" confirm-button-text="确认"
                             @confirm="deleteItem">
                <template #reference>
                  <el-button>删除此项目</el-button>
                </template>
              </el-popconfirm>
            </div>
            <div style="display: flex;justify-content: end;align-items: end;margin-left: 15px" class="create-time">
              创建时间 {{ selectItem.createTime }}
            </div>
          </div>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.select-active {
  background: #5f616522;
}

.dividers {
  margin-bottom: 0;
  margin-top: 5px
}

.left {
  background: #cccccc44;
  height: 100vh;
}

.right {

}

.list {
  padding: 0;
  margin: 0;
  font-size: var(--fontSize);
  color: var(--fontColor);
}

.list li {
  list-style: none;
  padding: 5px 0 0 15px;
}

.toolbox {
  margin-top: 5px;
  margin-left: 5px;
  height: var(--toolHeight);
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
  padding-top: 35px;
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
  align-items: center;
  justify-content: end;
  font-size: 10px;
  margin-bottom: 10px;

}

.error {
  color: #c0260e;
}

.success {
  color: #258d5e;
}
.success::before{
  content: '√';
}
</style>