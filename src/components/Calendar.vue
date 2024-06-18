<script lang="ts">
import {computed, defineComponent, reactive, ref, watch} from "vue";
import {Item} from "../js/calendar";
import myStorage from "../js/myStorage";
import {generateRandomString, now} from "../js/util";
import router from '../router'

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
      if(selectItem.value.status === 'normal') {
        selectItem.value.status = 'abandon';
      }else {
        selectItem.value.status = 'normal'
      }
    }
    watch(selectItem, (value, oldValue, onCleanup) => {

    })

    const goToSettings = ()=>{
      router.push('/options')
    }


    return {
      items, selectItem, options, deleteItem, clickNew, changeSelectProject, clickItem, disableItem, goToSettings
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
        <li v-for="item in items" :class="{'select-active': item.selected, 'abandon' : item.status === 'abandon'}" @click="clickItem(item)"
            style="cursor: pointer">
          {{ item.reqName || '新建需求' }}
        </li>
      </ol>
    </el-col>
    <el-col :span="16" class="right">
      <div :class="{title:true, abandon: selectItem.status === 'abandon'}">
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
            <el-form-item :label-width="100">
              <el-checkbox v-model="selectItem.isUpdateSQL">已更数据库</el-checkbox>
              <el-input type="textarea" placeholder="数据库文本" v-model="selectItem.sql"/>
            </el-form-item>
            <el-form-item :label="selectItem.project.configCenterName + '配置'" :label-width="100">
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
          </template>
          <el-form-item label="项目说明" :label-width="100">
            <el-row style="width: 100%">
              <el-col :span="12">
                <el-input type="textarea" v-model="selectItem.projectInfo" :rows="10"/>
              </el-col>
            </el-row>
          </el-form-item>
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

.abandon{
  text-decoration: line-through;
}
</style>