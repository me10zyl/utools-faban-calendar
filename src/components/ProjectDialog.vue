<script lang="ts">
import {defineComponent, PropType, reactive, Ref, ref, toRefs} from "vue";
import EnvDialog, {Env} from "./EnvDialog.vue";
import {FormInstance, FormItemRule, FormRules} from "element-plus";


export interface Project {
  branch: string,
  projectName: string,
  showSQL: boolean,
  showConfigCenter: boolean,
  configCenterName: string,
  showProjectRemark: string,
  projectDesc: string,
  newBranchCmd: string,
  gitUrl: string,
  envs: Env[]
}
export default defineComponent({
  props: {
    projects : {
      require: true,
      type : Object as PropType<Project[]>
    }
  },
  emits : ['update:projects', 'save'],
  components: {EnvDialog},
  setup(props, {emit}) {
    const rules = reactive<FormRules<Project>>({
      projectName : [{required: true, message: '不能为空',trigger:'blur'}],
      showSQL: [{required: true, message: ''}]
    })
    const formData = reactive<Project>({
      branch: "",
      configCenterName: "",
      envs: [],
      gitUrl: "",
      newBranchCmd: "",
      projectDesc: "",
      projectName: "",
      showConfigCenter: false,
      showProjectRemark: "",
      showSQL: false
    })
    const dialogVisible = ref<boolean>(false)
    const title = ref<string>('新增项目')
    const add = ()=>{
      dialogVisible.value = true
      title.value = '新增项目'
      for(let key in formData){
        formData[key] = null;
      }
    }
    const del = ()=>{

    }

    const edit = ()=>{
      dialogVisible.value = true
      title.value = '删除项目'
    }
    const editEnv = ()=>{
      envDialog.value.edit()
    }
    const delEnv = ()=>{
      envDialog.value.del()
    }
    const envDialog = ref()
    const addEnv = ()=>{
      envDialog.value.add()
    }
    const save = async ()=>{
      await formEl.value.validate((valid, fields)=>{
        if(valid){
          console.log('可以')
          dialogVisible.value = false
          props.projects.push(Object.assign({}, formData))
        }else{
          console.log('不太行')
        }
      })
    }
    const formEl: Ref<FormInstance> = ref()
    return {
      dialogVisible, add, del, edit, formData, title, editEnv, delEnv, envDialog, addEnv, save,formEl, rules
    }
  }
})
</script>

<template>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" :title="title" width="500">
      <el-form :model="formData" ref="formEl" :rules="rules">
        <el-form-item label="项目名称" :label-width="100" prop="projectName">
          <el-input class="el-col-12" v-model="formData.projectName" />
        </el-form-item>
        <el-form-item label="展示SQL" :label-width="100" prop="showSQL">
          <el-checkbox v-model="formData.showSQL" />
        </el-form-item>
        <el-form-item label="展示配置中心" :label-width="100" prop="showConfigCenter">
          <el-checkbox v-model="formData.showConfigCenter" />
        </el-form-item>
        <el-form-item label="配置中心名称" :label-width="100" prop="configCenterName">
          <el-input class="el-col-12" v-model="formData.configCenterName" />
        </el-form-item>
        <el-form-item label="项目描述" :label-width="100" prop="projectDesc">
          <el-input type="textarea" v-model="formData.projectDesc"/>
        </el-form-item>
        <el-form-item label="新分支命令" :label-width="100" prop="newBranchCmd">
          <el-input  v-model="formData.newBranchCmd"/>
        </el-form-item>
        <el-form-item label="git地址" :label-width="100" prop="gitUrl">
          <el-input  v-model="formData.gitUrl"/>
        </el-form-item>
        <el-form-item label="环境" :label-width="100" prop="envs">
          <el-button @click="addEnv">添加环境</el-button>
          <el-table :data="formData.envs" border style="margin-top:10px;" width="100%">
            <el-table-column prop="envName" label="项目名称" width="100"/>
            <el-table-column prop="branchName" label="项目描述" width="500"/>
            <el-table-column label="操作">
              <el-button @click="editEnv">编辑</el-button>
              <el-button @click="delEnv">删除</el-button>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
    <EnvDialog ref="envDialog"/>
  </teleport>
</template>

<style scoped>

</style>