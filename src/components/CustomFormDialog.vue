<script lang="ts">
import {defineComponent, PropType, reactive, ref} from "vue";
import {ElForm, FormInstance} from "element-plus";


type CustomType = 'checkbox' | 'input' | 'button';
type CustomTypeLabel = '复选框' | '输入框' | '按钮'

export interface CustomForm {
  /**
   * 类型
   */
  type: CustomType,
  /**
   * 自定义按钮执行的命令
   */
  buttonCmd?: string,
  /**
   * 标签
   */
  label: string
}

export default defineComponent({
  props: {
    customForms: {
      type: Object as PropType<CustomForm[]>
    }
  },
  setup() {
    const formData = reactive<CustomForm>({
      label: "",
      type: 'checkbox'
    });
    const edit = () => {
      dialogVisible.value = true
      title.value = '编辑自定义表单'
    }
    const del = () => {

    }
    const add = () => {
      dialogVisible.value = true
      title.value = '新增自定义表单'
      if (formEl.value) {
        formEl.value.resetFields()
      }
    }

    const save = () => {

    }

    const dialogVisible = ref(false);
    const title = ref('编辑自定义表单');
    const formEl = ref<FormInstance>()
    console.log()

    interface CustomTypeOption{
      label : CustomTypeLabel,
      value: CustomType
    }

    const typeOptions: CustomTypeOption[] = [{
      value: 'checkbox',
      label: '复选框'
    },{
      value: 'input',
      label: '输入框'
    },{
      value: 'button',
      label: '按钮'
    }]
    return {
      add, edit, del, dialogVisible, formEl, formData, title, typeOptions, save
    }
  }
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="title" width="600">
    <el-form ref="formEl" label-position="left" :model="formData">
      <el-form-item prop="type" label="类型" :label-width="140">
        <el-select v-model="formData.type">
          <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="buttonCmd" label="自定义按钮执行的命令" :label-width="140">
        <el-input v-model="formData.buttonCmd"></el-input>
      </el-form-item>
      <el-form-item prop="label" label="标签" :label-width="140">
        <el-input v-model="formData.label"></el-input>
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