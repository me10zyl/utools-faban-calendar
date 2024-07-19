<script lang="ts">
import {defineComponent, onMounted, reactive, Ref, ref, watch} from "vue";
import ProjectDialog from "./ProjectDialog.vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import type {ValidateFieldsError} from "async-validator";
import {InternalRuleItem, ValidateOption, Value, Values} from "async-validator/dist-types/interface.d.ts";
import CustomFormDialog from "./CustomFormDialog.vue";
import customFormDialog from "./CustomFormDialog.vue";
import storage from "../js/storage";
import {CustomForm, DefaultOptions, Options, Project} from "../js/options";
import myStorage from "../js/myStorage";
import EnvDialog from "./EnvDialog.vue";
import myUtools from "../js/myUtools";

export default defineComponent({
  computed: {
    myUtools() {
      return myUtools
    },
    customFormDialog() {
      return customFormDialog
    }
  },
  components: {EnvDialog, CustomFormDialog, ProjectDialog},
  setup(prop, ctx) {
    const projectDialog = ref()
    const projects = reactive<Project[]>([]);
    const editProject = (row:Project) => {
/*      let opts: Options = myStorage.getOptions();
      let project = opts.projects.find(e=>e.projectName === row.projectName);*/
      projectDialog.value.edit(row)
    }
    const delProject = (row:Project) => {
      projectDialog.value.del(row)
    }
    const addProject = () => {
      projectDialog.value.add()
    }
    const projectDialogVisible = ref(false)
    const validateForm = () => {
      return new Promise((resolve, reject) => {
        if (!formEl.value) reject(false)
        formEl.value.validate((isValid: boolean, invalidFields?: ValidateFieldsError) => {
          if (isValid) {
            resolve(isValid)
          } else {
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
      defaultCustomForms: [],
      defaultEnvs: []
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
    onMounted(() => {
      let opts: Options = myStorage.getOptions();
      Object.assign(formData, opts?.defaultOptions)
      let projects_ = opts?.projects;
      if (projects_) {
        projects_.forEach(e => projects.push(e))
      }
    })
    const options: Options = reactive<Options>({
      defaultOptions: formData as DefaultOptions,
      projects: projects as Project[]
    })
    watch(options, async (value, oldValue, onCleanup) => {
      let valid = await validateForm();
      if (valid) {
        myStorage.saveOptions(options)
      }
    })
    const envDialog = ref<InstanceType<typeof EnvDialog>>(null)
    return {
      envDialog,
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
    <div class="el-col-23">
      <el-link style="margin-bottom: 5px" @click="myUtools.redirect('Calendar')">←发版日历</el-link>
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
            <el-form-item label="默认配置中心名称" :label-width="120" prop="defaultConfCenterName"
                          v-if="formData.defaultShowConfCenter">
              <el-input placeholder="nacos" v-model="formData.defaultConfCenterName" size="small" class="el-col-12"/>
            </el-form-item>
          </div>
          <el-form-item label="默认展示项目说明" :label-width="120" prop="defaultShowProjectInfo">
            <el-checkbox v-model="formData.defaultShowProjectInfo"></el-checkbox>
          </el-form-item>
          <el-form-item label="默认自定义表单" :label-width="120" prop="defaultCustomForms">
            <el-button @click="customFormAdd(customFormDialog)">添加自定义表单</el-button>
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
          <el-form-item label="默认环境" :label-width="120" prop="envs">
            <el-button @click="envDialog.add()">添加环境</el-button>
            <el-table :data="formData.defaultEnvs" border style="margin-top:10px;" width="100%">
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
          <div>全局配置</div>
          <hr/>
          <el-form-item label="项目基础路径" :label-width="120" prop="basePath">
            <el-input v-model="formData.basePath" />
          </el-form-item>
          <el-form-item label="数据备份保存路径" :label-width="120" prop="basePath">
            <el-input v-model="formData.bakPath" />
          </el-form-item>
          <el-tooltip content="markdown上传图片图床的token,获取方法：使用API POST https://sm.ms/api/v2/token， 参考链接：https://doc.sm.ms/" placement="top-start">
            <el-form-item label="sm.ms Token" :label-width="120" prop="smmsToken">
              <el-input v-model="formData.smmsToken" />
            </el-form-item>
          </el-tooltip>
        </div>
      </el-form>
      <div>
        <div>项目配置</div>
        <hr/>
        <el-button type="primary" @click="addProject">新增项目</el-button>
        <el-table :data="projects" border style="margin-top:10px;" width="100%">
          <el-table-column prop="projectName" label="项目名称" width="160"/>
          <el-table-column prop="projectDesc" label="项目描述" width="300"/>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button @click="editProject(scope.row)">编辑</el-button>
              <el-popconfirm title="确认删除?" cancel-button-text="取消" confirm-button-text="确认" @confirm="delProject(scope.row)">
                <template #reference>
                  <el-button>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
  <ProjectDialog ref="projectDialog" :projects="projects"/>
  <CustomFormDialog ref="customFormDialog" :custom-forms="formData.defaultCustomForms"/>
  <EnvDialog  ref="envDialog" :envs="formData.defaultEnvs" :sync-btn="true" />
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