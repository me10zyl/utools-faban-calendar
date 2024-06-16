<script lang="ts">
import {defineComponent, PropType, reactive, ref} from "vue";
import {Env} from "../js/options";



export default defineComponent({
  props : {

  },
  setup() {
    const formData: Env = <Env>reactive({})
    const edit = () => {
      dialogVisible.value = true;
      title.value = '编辑环境'
    }
    const add = () => {
      dialogVisible.value = true;
      title.value = '添加环境'
    }
    const del = (envName) => {

    }
    const dialogVisible = ref(false);
    const title = ref('添加环境');
    const save = ()=>{
      dialogVisible.value = false
    }
    return {
      edit, add, del, dialogVisible, title, formData, save
    }
  }
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="title" width="600" height="700">
    <el-form>
      <el-form-item label="环境名称" v-model="formData.envName" :label-width="100">
        <el-input />
      </el-form-item>
      <el-form-item label="发版分支名" v-model="formData.fabanBranchName" :label-width="100">
        <el-input />
      </el-form-item>
      <el-form-item label="项目路径" v-model="formData.projectPath" :label-width="100">
        <el-input />
      </el-form-item>
      <el-form-item label="发版命令" v-model="formData.publishCmd" :label-width="100">
        <el-input type="textarea"/>
      </el-form-item>
      <el-form-item label="程序运行状态检测命令" v-model="formData.statusCmd" :label-width="100">
        <el-input type="textarea"/>
      </el-form-item>
      <el-form-item label="程序运行开始时间查询命令" v-model="formData.startTimeCmd" :label-width="100">
        <el-input type="textarea"/>
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
</template>

<style scoped>

</style>