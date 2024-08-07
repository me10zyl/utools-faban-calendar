<script lang="ts">
import {defineComponent, PropType, reactive, Ref, ref, toRefs} from "vue";
import EnvDialog from "./EnvDialog.vue";
import {FormInstance, FormItemRule, FormRules} from "element-plus";
import {CustomForm, DefaultOptions, Project} from "../js/options";
import myStorage from "../js/myStorage";
import CustomFormDialog from "./CustomFormDialog.vue";
import {deepClone} from "../js/util";
import CodeMirror from "@/components/CodeMirror.vue";
import myUtools from "@/js/myUtools";
export default defineComponent({
  props: {
    projects : {
      require: true,
      type : Object as PropType<Project[]>
    }
  },
  emits : ['update:projects', 'save'],
  components: {CodeMirror, CustomFormDialog, EnvDialog},
  setup(props, {emit}) {
    const rules = reactive<FormRules<Project>>({
      projectName : [{required: true, message: '项目名称不能为空',trigger:'blur'}],
      projectDesc: [{required: true, message: '项目描述不能为空',trigger:'blur'}],
      releaseBranch: [{message: '发布分支脚本不为空时必填', validator: rule => {
        debugger
          return formData.newBranchCmd == '' || (!!formData.releaseBranch && formData.releaseBranch.trim() !== '')
        }, trigger: 'blur'}],
      gitUrl: [{message: '发布分支脚本不为空时必填', validator: rule => {
          return formData.newBranchCmd == '' || (!!formData.gitUrl && formData.gitUrl.trim() !== '')
        }, trigger: 'blur'}]
    })
    let init = {
      configCenterName: "",
      envs: [],
      gitUrl: "",
      newBranchCmd: myUtools.readFile('scripts/new-branch.bat'),
      projectDesc: "",
      projectName: "",
      showConfigCenter: true,
      showSQL: true,
      customForms: [],
      showProjectInfo: true
    };
    const formData = reactive<Project>(deepClone(init))
    const dialogVisible = ref<boolean>(false)
    const title = ref<string>('新增项目')

    function setDefaults(formData: Project) {
      let defaultConf: DefaultOptions = myStorage.getOptions()?.defaultOptions;
      formData.configCenterName = defaultConf.defaultConfCenterName
      formData.showSQL =  defaultConf.defaultShowSQL;
      formData.showProjectInfo =  defaultConf.defaultShowProjectInfo;
      formData.customForms =  defaultConf.defaultCustomForms;
      formData.showConfigCenter = defaultConf.defaultShowConfCenter;
      formData.envs = defaultConf.defaultEnvs;
    }

    const add = ()=>{
      dialogVisible.value = true
      title.value = '新增项目'
      /*if(formEl.value) {
        formEl.value.resetFields()
      }*/
      let init1 = deepClone(init);
      for(let key in formData){
        formData[key] = init1[key];
      }
      setDefaults(formData)
      editObject = null
    }
    let editObject = null;
    const del = (row:Project)=>{
      props.projects.splice(props.projects.indexOf(row), 1)
    }
    const edit = (row:Project)=>{
      dialogVisible.value = true
      title.value = '编辑项目'
      Object.assign(formData, row)
      editObject = row
      console.log('edit', editObject)
    }
    const envDialog = ref<InstanceType<typeof EnvDialog>>()

    const save = async ()=>{
      await formEl.value.validate((valid, fields)=>{
        if(valid){
          dialogVisible.value = false
          if(editObject == null) {
            props.projects.push(Object.assign({}, formData))
          }else{
            Object.assign(editObject, formData)
          }
        }else{
          console.log('不太行')
        }
      })
    }
    const formEl = ref<FormInstance>()
    const customFormDialog = ref<InstanceType<typeof CustomFormDialog>>()
    const coverDefaultEnv = ()=>{
      formData.envs = myStorage.getOptions().defaultOptions.defaultEnvs
    }
    const coverDefaultCustomForm = ()=>{
      formData.customForms = myStorage.getOptions().defaultOptions.defaultCustomForms
    }
    return {
      dialogVisible, add, del, edit, formData, title,  envDialog,  save,formEl, rules, customFormDialog, coverDefaultEnv, coverDefaultCustomForm
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
        <el-form-item label="展示项目说明" :label-width="100" prop="showProjectInfo">
          <el-checkbox  v-model="formData.showProjectInfo"/>
        </el-form-item>
        <el-form-item label="配置中心名称" :label-width="100" prop="configCenterName" v-if="formData.showConfigCenter">
          <el-input class="el-col-12" v-model="formData.configCenterName" />
        </el-form-item>
        <el-form-item label="项目描述" :label-width="100" prop="projectDesc">
          <el-input type="textarea" v-model="formData.projectDesc"/>
        </el-form-item>
        <el-form-item label="git地址" :label-width="100" prop="gitUrl">
          <el-input  v-model="formData.gitUrl"/>
        </el-form-item>
        <el-form-item label="正式环境分支" :label-width="100" prop="releaseBranch" class="el-col-12">
          <el-input  v-model="formData.releaseBranch"/>
        </el-form-item>
        <el-form-item label="新分支命令" :label-width="100" prop="newBranchCmd">
<!--          <el-input  v-model="formData.newBranchCmd" type="textarea"/>-->
          <code-mirror v-model="formData.newBranchCmd" lang="batch"></code-mirror>
        </el-form-item>
        <el-form-item label="自定义按钮" :label-width="100" prop="customForms">
          <el-button @click="customFormDialog.add">添加自定义表单</el-button>
          <el-popconfirm title="此操作会覆盖默认按钮到当前项目表单，确认覆盖?" cancel-button-text="取消" confirm-button-text="确认" @confirm="coverDefaultCustomForm">
            <template #reference>
              <el-button @click="">刷新默认自定义表单</el-button>
            </template>
          </el-popconfirm>
          <el-table :data="formData.customForms" border style="margin-top:10px;" width="100%">
            <el-table-column prop="label" label="表单标签" width="100"/>
            <el-table-column prop="typeString" label="表单类型" width="100"/>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button @click="customFormDialog.edit(scope.row)">编辑</el-button>
                <el-button @click="customFormDialog.del(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="环境" :label-width="100" prop="envs">
          <el-button @click="envDialog.add">添加环境</el-button>
          <el-popconfirm title="此操作会覆盖默认环境到当前项目环境配置，确认覆盖?" cancel-button-text="取消" confirm-button-text="确认" @confirm="coverDefaultEnv">
            <template #reference>
              <el-button @click="">刷新默认环境</el-button>
            </template>
          </el-popconfirm>
          <el-table :data="formData.envs" border style="margin-top:10px;" width="100%">
            <el-table-column prop="envName" label="环境名称" width="100"/>
            <el-table-column prop="fabanBranchName" label="发版分支名称" width="100"/>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button @click="envDialog.edit(scope.row)">编辑</el-button>
                <el-button @click="envDialog.del(scope.row)">删除</el-button>
              </template>
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
    <EnvDialog ref="envDialog" :envs="formData.envs"/>
    <CustomFormDialog ref="customFormDialog" :custom-forms="formData.customForms"/>
  </teleport>
</template>

<style scoped>

</style>