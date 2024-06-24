<script setup lang="ts">
import {ref} from "vue";
import myUtools from "../js/myUtools";
import myStorage from "../js/myStorage";
import {ElMessage, Options} from "element-plus";
import {Item} from "../js/calendar";
type ImportType = 'calendar' | 'options'
const dialogVisible = ref<boolean>(false)
const show = () => {
  dialogVisible.value = true
}
const importData = ref<string>()

let emit = defineEmits(['importOK']);
const doImport = (importType : ImportType)=>{
    if(importData.value === ''){
      ElMessage('请输入导入信息')
      return
    }
    let json: any = null;
    try {
      json = JSON.parse(importData.value)
    }catch(e){
      ElMessage('导入格式错误')
      return
    }
    let type = '日历';
    try {
      if (importType === 'calendar') {
        if(Array.isArray(json) && json[0].reqName != undefined) {
          myStorage.saveCalendar(json)
        }else{
          ElMessage('导入格式错误')
          return
        }
      } else if (importType === 'options') {
        type = '设置'
        // let options = myStorage.getOptions();
        // json.projects.forEach(e => {
        //   options.projects.push(e)
        // })
        // options.defaultOptions = json.defaultOptions
        if('defaultOptions' in json){
          myStorage.saveOptions(json)
        }else{
          ElMessage('导入格式错误')
          return
        }
      }
    }catch (e){
      ElMessage('导入失败')
      return
    }
  ElMessage(`导入${type}成功`)
  dialogVisible.value = false
  emit('importOK')
}
defineExpose({
  show
})
</script>

<template>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" title="导入" width="600" height="700">
      <el-alert type="warning" :closable="false">
        导入将会导致所有数据清除并覆盖
      </el-alert>
      <el-input type="textarea" rows="3" v-model="importData" style="margin-top: 10px"/>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="doImport('calendar')">
            导入发版日历
          </el-button>
          <el-button type="primary" @click="doImport('options')">
            导入设置
          </el-button>
        </div>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped>

</style>