<script lang="ts">
import {defineComponent, PropType, reactive, ref} from "vue";
import {Env} from "../js/options";
import {FormInstance, FormRules} from "element-plus";



export default defineComponent({
  props : {
    envs : {
      type : Object as PropType<Env[]>,
      required: true
    }
  },
  setup(props) {
    const formData: Env =reactive <Env>({
      envName: "",
      envTestUrl: "",
      fabanBranchName: "",
      jenkinsUrl: "",
      startTime: ""
    })
    let editObject = null;
    const edit = (row) => {
      dialogVisible.value = true;
      title.value = '编辑环境'
      Object.assign(formData, row)
      editObject  = row;
    }
    const add = () => {
      dialogVisible.value = true;
      title.value = '添加环境'
      if(formEl.value){
        formEl.value.resetFields()
      }
      editObject = null
    }
    const del = (row) => {
      props.envs.splice(props.envs.indexOf(row), 1)
    }
    const dialogVisible = ref(false);
    const title = ref('添加环境');
    const save = async (formEl: FormInstance)=>{
      await formEl.validate((isValid, invalidFields) => {
        if(isValid){
          dialogVisible.value = false
          if(editObject == null) {
            props.envs.push(Object.assign({}, formData))
          }else{
            Object.assign(editObject, formData)
          }
        }
      });
    }
    const formEl = ref<FormInstance>()
    const rules = reactive<FormRules<Env>>({
      envName: [{required: true, message: '环境名称必填'}],
      fabanBranchName: [{required:true, message: '发版分支名称必填'}],
      envTestUrl: [{required:false, validator: (rule, value, callback, source, options) => {
            if(!value){
              return true;
            }
            return value.match(/^http(s)?:/).length > 0
        }, message: '链接必须以http或https开头'}],
      jenkinsUrl: [{required:false, validator: (rule, value, callback, source, options) => {
          if(!value){
            return true;
          }
          return value.match(/^http(s)?:/).length > 0
        }, message: '链接必须以http或https开头'}]
    })
    return {
      edit, add, del, dialogVisible, title, formData, save, formEl, rules
    }
  }
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="title" width="600" height="700">
    <el-form ref="formEl" :model="formData" :rules="rules">
      <el-form-item label="环境名称" :label-width="100" prop="envName">
        <el-input v-model="formData.envName" class="el-col-12"/>
      </el-form-item>
      <el-form-item label="发版分支名称" :label-width="100" prop="fabanBranchName">
        <el-input v-model="formData.fabanBranchName"  class="el-col-12" />
      </el-form-item>
      <el-form-item label="环境测试地址"  :label-width="100" prop="envTestUrl">
        <el-input v-model="formData.envTestUrl"/>
      </el-form-item>
      <el-form-item label="jenkins地址"  :label-width="100" prop="jenkinsUrl">
        <el-input v-model="formData.jenkinsUrl"/>
      </el-form-item>
      <el-form-item label="发版命令" :label-width="100" prop="publishCmd">
        <el-input type="textarea"  v-model="formData.publishCmd"/>
      </el-form-item>
      <el-form-item label="程序运行状态检测命令"  :label-width="100" prop="statusCmd">
        <el-input type="textarea" v-model="formData.statusCmd"/>
      </el-form-item>
      <el-form-item label="程序运行开始时间查询命令"  :label-width="100" prop="startTimeCmd">
        <el-input type="textarea" v-model="formData.startTimeCmd"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save(formEl)">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>