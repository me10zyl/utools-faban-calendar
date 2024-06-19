<script setup lang="ts">
import {ref} from "vue";
import myStorage from "../js/myStorage";
import {ElMessage} from "element-plus";
import myUtools from "../js/myUtools";

type ExportType =  'calendar' | 'options'

const dialogVisible = ref<boolean>(false)
const show = () => {
  dialogVisible.value = true
}
const exportData = ref<string>()
const doExport = (exportType: ExportType)=>{
  if(exportType === 'calendar'){
    exportData.value = JSON.stringify(myStorage.getCalendars());
  }else if(exportType === 'options'){
    exportData.value = JSON.stringify(myStorage.getOptions())
  }
}
const copyContent = ()=>{
  if(exportData.value === ''){
    ElMessage('还没有导出任何内容')
    return
  }
  myUtools.copy(exportData.value)
  ElMessage('已复制')
}
defineExpose({
  show
})
</script>

<template>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" title="导出" width="600" height="700">
      <el-input type="textarea" rows="3" v-model="exportData" />
      <el-button style="margin-top: 5px" @click="doExport('calendar')">导出发版日历</el-button>
      <el-button style="margin-top: 5px" @click="doExport('options')">导出设置</el-button>
      <el-button style="margin-top: 5px" @click="copyContent">复制当前内容到剪贴板</el-button>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped>

</style>