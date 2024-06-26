<script lang="ts">
import {defineComponent, PropType, reactive, ref} from "vue";
import {Env} from "../js/options";
import {FormInstance, FormRules} from "element-plus";
import myUtools from "@/js/myUtools";
import {deepClone} from "@/js/util";
import CodeMirror from "@/components/CodeMirror.vue";


export default defineComponent({
  components: {CodeMirror},
  props: {
    envs: {
      type: Object as PropType<Env[]>,
      required: true
    }
  },
  setup(props) {
    let target = {
      envName: "",
      envTestUrl: "",
      fabanBranchName: "",
      jenkinsUrl: "",
      startTime: "",
      mergeBranchCmd: myUtools.readFile('scripts/merge.bat'),
      publishCmd: myUtools.readFile('scripts/publish.bat')
    };
    const formData: Env = reactive<Env>(deepClone(target))
    let editObject = null;
    const edit = (row) => {
      reset()
      dialogVisible.value = true;
      title.value = '编辑环境'
      Object.assign(formData, row)
      editObject = row;
    }

    function reset() {
      let clone = deepClone(target);
      for (let key in formData) {
        formData[key] = clone[key];
      }
    }

    const add = () => {
      dialogVisible.value = true;
      title.value = '添加环境'
      // if(formEl.value){
      //   formEl.value.resetFields()
      // }
      reset();
      editObject = null
    }
    const del = (row) => {
      props.envs.splice(props.envs.indexOf(row), 1)
    }
    const dialogVisible = ref(false);
    const title = ref('添加环境');
    const save = async (formEl: FormInstance) => {
      await formEl.validate((isValid, invalidFields) => {
        if (isValid) {
          dialogVisible.value = false
          if (editObject == null) {
            props.envs.push(Object.assign({}, formData))
          } else {
            Object.assign(editObject, formData)
          }
        }
      });
    }
    const formEl = ref<FormInstance>()
    const rules = reactive<FormRules<Env>>({
      envName: [{required: true, message: '环境名称必填'}],
      fabanBranchName: [{required: true, message: '发版分支名称必填'}],
      envTestUrl: [{
        required: false, validator: (rule, value, callback, source, options) => {
          if (!value) {
            return true;
          }
          return value.match(/^http(s)?:/).length > 0
        }, message: '链接必须以http或https开头'
      }],
      jenkinsUrl: [{
        validator: (rule, value, callback, source, options) => {
          if (!formData.publishCmd || formData.publishCmd.trim() === '') {
            return true;
          }
          return !!value;
        }, message: '发版命令存在时必填jenkins链接', trigger: 'blur'
      }, {
        validator: (rule, value, callback, source, options) => {
          if (!value) {
            return true;
          }
          return value != '' && value.match(/^http(s)?:/).length > 0
        }, message: '链接必须以http或https开头', trigger: 'blur'
      }],
      jenkinsUsername: [{
        validator: rule => {
          if (formData.publishCmd && formData.publishCmd.trim() !== '') {
            return !!formData.jenkinsUsername && formData.jenkinsUsername.trim() !== ''
          }
          return true
        }, trigger: 'blur', message: '发版命令存在时必须设置jenkins用户名'
      }],
      jenkinsPasswordOrToken: [{
        validator: rule => {
          if (formData.publishCmd && formData.publishCmd.trim() !== '') {
            return !!formData.jenkinsUsername && formData.jenkinsUsername.trim() !== ''
          }
          return true
        }, trigger: 'blur', message: '发版命令存在时必须设置jenkins的密码或token'
      }]
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
      <el-form-item label="环境名称" :label-width="120" prop="envName">
        <el-input v-model="formData.envName" class="el-col-12"/>
      </el-form-item>
      <el-form-item label="发版分支名称" :label-width="120" prop="fabanBranchName">
        <el-input v-model="formData.fabanBranchName" class="el-col-12"/>
      </el-form-item>
      <el-form-item label="环境测试地址" :label-width="120" prop="envTestUrl">
        <el-input v-model="formData.envTestUrl"/>
      </el-form-item>
      <el-form-item label="jenkins地址" :label-width="120" prop="jenkinsUrl">
        <el-input v-model="formData.jenkinsUrl"/>
      </el-form-item>
      <el-form-item label="jenkins用户名" :label-width="120" prop="jenkinsUsername">
        <el-input v-model="formData.jenkinsUsername" class="el-col-12"/>
      </el-form-item>
      <el-form-item label="jenkins密码/token" :label-width="120" prop="jenkinsPasswordOrToken">
        <el-input v-model="formData.jenkinsPasswordOrToken" class="el-col-12" type="password"/>
      </el-form-item>
      <el-form-item label="合并分支命令" :label-width="120" prop="mergeBranchCmd">
        <code-mirror lang="batch" v-model="formData.mergeBranchCmd"/>
      </el-form-item>
      <el-form-item label="发版命令" :label-width="120" prop="publishCmd">
        <code-mirror lang="batch" v-model="formData.publishCmd"/>
      </el-form-item>
<!--      <el-form-item label="程序运行状态检测命令" :label-width="120" prop="statusCmd">
        <code-mirror lang="batch" v-model="formData.statusCmd"/>
      </el-form-item>
      <el-form-item label="程序运行开始时间查询命令" :label-width="120" prop="startTimeCmd">
        <code-mirror lang="batch" v-model="formData.startTimeCmd"/>
      </el-form-item>-->
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