<script lang="ts">
import {defineComponent, onMounted, reactive, Ref, ref, watch} from "vue";
import ProjectDialog from "./ProjectDialog.vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import type {ValidateFieldsError} from "async-validator";
import {InternalRuleItem, ValidateOption, Value, Values} from "async-validator/dist-types/interface";
import CustomFormDialog from "./CustomFormDialog.vue";
import customFormDialog from "./CustomFormDialog.vue";
import storage from "../js/storage";
import {CustomForm, DefaultOptions, Options, Project} from "../js/options";
import myStorage from "../js/myStorage";

export default defineComponent({
  computed: {
    customFormDialog() {
      return customFormDialog
    }
  },
  components: {CustomFormDialog, ProjectDialog},
  setup(prop, ctx) {
    const projectDialog = ref()
    const projects = reactive<Project[]>([]);
    const editProject = (ev) => {
      console.log('editProject', ev)
      projectDialog.value.edit()
    }
    const delProject = () => {
      projectDialog.value.del()
    }
    const addProject = () => {
      projectDialog.value.add()
    }
    const projectDialogVisible = ref(false)
    const validateForm =  () => {
      return new Promise((resolve, reject)=>{
        if(!formEl.value) reject(false)
        formEl.value.validate((isValid: boolean, invalidFields?: ValidateFieldsError) => {
          if (isValid) {
            resolve(isValid)
          }else {
            reject(isValid)
          }
        });
      })
    }
    const formData = reactive<DefaultOptions>({
      defaultConfCenterName: "nacos",
      defaultShowConfCenter: true,
      defaultShowProjectInfo: true,
      defaultShowSQL: true,
      defaultCustomForms: []
    })
    const formEl = ref<FormInstance>()
    const rules = reactive<FormRules<DefaultOptions>>({
      defaultConfCenterName: [{
        required: false, message: '若展示默认中心默认配置中心名称必填', trigger: 'blur',
        validator: (rule: InternalRuleItem, value: Value, callback: (error?: string | Error) => void,
                    source: Values, options: ValidateOption) => {
          return !formData.defaultShowConfCenter || value.trim() !== ''
        }
      }]
    });
    const customFormDialog = ref<InstanceType<typeof CustomFormDialog> | null>(null)
    const customFormAdd = (el: InstanceType<typeof CustomFormDialog> | null) => {
      el.add()
    }
    const customFormEdit = (el: InstanceType<typeof CustomFormDialog> | null, row: CustomForm) => {
      el.edit(row)
    }
    const customFormDel = (el: InstanceType<typeof CustomFormDialog> | null, row: CustomForm) => {
      el.del(row)
    }
    onMounted(()=>{
      let opts:Options = myStorage.getOptions();
      Object.assign(formData, opts?.defaultOptions)
      let projects_ = opts?.projects;
      if(projects_){
        projects_.forEach(e=>projects.push(e))
      }
    })
    const options: Options = reactive<Options>({
      defaultOptions: formData as DefaultOptions,
      projects: projects as Project[]
    })
    watch(options, async (value, oldValue, onCleanup) => {
        let valid = await validateForm();
        if(valid){
          myStorage.saveOptions(options)
        }
    })
    return {
      projects,
      delProject,
      editProject,
      addProject,
      projectDialogVisible,
      projectDialog,
      formData,
      formEl,
      rules,
      customFormDialog,
      customFormAdd,
      customFormEdit,
      customFormDel
    }
  }
})

</script>

<template>
  <div class="el-container">
    <div class="el-col-12">
      <el-form style="margin-bottom: 10px" :model="formData" ref="formEl" :rules="rules" label-position="left">
        <div>项目默认配置</div>
        <hr/>
        <div>
          <el-form-item prop="defaultShowSQL" label="默认展示SQL" :label-width="120">
            <el-checkbox v-model="formData.defaultShowSQL"></el-checkbox>
          </el-form-item>
          <div class="panel" style="margin-bottom: 5px">
            <el-form-item label="默认展示配置中心" :label-width="120" prop="defaultShowConfCenter">
              <el-checkbox v-model="formData.defaultShowConfCenter"></el-checkbox>
            </el-form-item>
            <el-form-item label="默认配置中心名称" :label-width="120" prop="defaultConfCenterName" v-if="formData.defaultShowConfCenter">
              <el-input placeholder="nacos" v-model="formData.defaultConfCenterName" size="small" class="el-col-12"/>
            </el-form-item>
          </div>
          <el-form-item label="默认展示项目说明" :label-width="120" prop="defaultShowProjectInfo">
            <el-checkbox v-model="formData.defaultShowProjectInfo"></el-checkbox>
          </el-form-item>
          <el-form-item label="默认自定义表单" :label-width="120" prop="defaultCustomForms">
            <el-button @click="customFormAdd(customFormDialog)">添加自定义菜单</el-button>
            <el-table :data="formData.defaultCustomForms" border style="margin-top:10px;" width="100%">
              <el-table-column prop="label" label="表单标签" width="100"/>
              <el-table-column prop="typeString" label="表单类型" width="60"/>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button @click="customFormEdit(customFormDialog, scope.row)">编辑</el-button>
                  <el-button @click="customFormDel(customFormDialog, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
      </el-form>
      <div>
        <div>项目配置</div>
        <hr/>
        <el-button type="primary" @click="addProject">新增项目</el-button>
        <el-table :data="projects" border style="margin-top:10px;" width="100%">
          <el-table-column prop="projectName" label="项目名称" width="100"/>
          <el-table-column prop="projectDesc" label="项目描述" width="150"/>
          <el-table-column label="操作">
            <el-button @click="editProject">编辑</el-button>
            <el-button @click="delProject">删除</el-button>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
  <ProjectDialog ref="projectDialog" :projects="projects"/>
  <CustomFormDialog ref="customFormDialog" :custom-forms="formData.defaultCustomForms"/>
</template>

<style scoped>
.panel {
  border: 1px dashed #00000011;
}

a {
  text-decoration: none;
  color: #10234b;
}
</style>