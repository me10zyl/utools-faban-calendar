<script lang="ts">
import {defineComponent, PropType, reactive, ref} from "vue";
import {ElForm, FormInstance, FormRules} from "element-plus";
import {CustomForm, CustomType, CustomTypeLabel} from "../js/options";




function getLabel(type: CustomType): CustomTypeLabel | null {
  switch (type) {
    case "button":
      return "按钮";
    case "input":
      return "输入框";
    case "checkbox":
      return "复选框";
  }
  return null;
}



export default defineComponent({
  props: {
    customForms: {
      type: Object as PropType<CustomForm[]>
    }
  },
  setup(props) {
    const formData = reactive<CustomForm>({
      label: "",
      type: 'checkbox',
      typeString: '复选框'
    });
    const edit = (row: CustomForm) => {
      dialogVisible.value = true
      title.value = '编辑自定义表单'
      Object.assign(formData, row)
    }
    const del = (row: CustomForm) => {
      props.customForms.splice(props.customForms.indexOf(row), 1)
    }

    function handle(form: CustomForm): void {
      form.typeString = getLabel(form.type)
    }

    const add = () => {
      dialogVisible.value = true
      title.value = '新增自定义表单'
      if (formEl.value) {
        formEl.value.resetFields()
      }
    }

    const save = async (formEl: FormInstance) => {
      await formEl.validate((isValid, invalidFields) => {
        if (isValid) {
          handle(formData)
          props.customForms.push(Object.assign({}, formData))
          dialogVisible.value = false
        }
      });
    }

    const dialogVisible = ref(false);
    const title = ref('编辑自定义表单');
    const formEl = ref<FormInstance>()
    console.log()

    interface CustomTypeOption {
      label: CustomTypeLabel,
      value: CustomType
    }

    const typeOptions: CustomTypeOption[] = [{
      value: 'checkbox',
      label: '复选框'
    }, {
      value: 'input',
      label: '输入框'
    }, {
      value: 'button',
      label: '按钮'
    }]
    const rules = reactive<FormRules<CustomForm>>({
      label: [{
        required: true,
        trigger: 'blur',
        message: '标签不能为空'
      }],
      buttonCmd: [{
        required: true,
        message: '类型为按钮时按钮命令必填',
        validator: (rule, value) => {
          return formData.type !== 'button' || value.trim() !== ''
        }
      }]
    })
    return {
      add, edit, del, dialogVisible, formEl, formData, title, typeOptions, save, rules
    }
  }
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="title" width="600">
    <el-form ref="formEl" label-position="left" :model="formData" :rules="rules">
      <el-form-item prop="type" label="类型" :label-width="140">
        <el-select v-model="formData.type">
          <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="label" label="标签" :label-width="140">
        <el-input v-model="formData.label"></el-input>
      </el-form-item>
      <el-form-item prop="buttonCmd" label="自定义按钮执行的命令" :label-width="140" v-if="formData.type === 'button'">
        <el-input v-model="formData.buttonCmd" type="textarea"></el-input>
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