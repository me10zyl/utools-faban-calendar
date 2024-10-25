<script setup lang="ts">
import myUtools from "@/js/myUtools.js";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import myStorage from "@/js/myStorage";
import {Item} from "@/js/calendar.d";
const date = ref();
const dialogVisible = ref<boolean>(false)
const show = () => {
  dialogVisible.value = true
}
const exportData = ref<string>()
const doExport = ()=>{
  myUtools.copy(exportData.value)
  ElMessage('已复制')
}
const doSearch = ()=>{
  let calendars = myStorage.getCalendars();
  let string = ''

  function getString(item: Item) {
    return item.createTime + ' ' + item.reqName +  '\n';
  }

  for (let i = 0; i < calendars.length; i++) {
    let item = calendars[i];
    if(date.value.length >= 2) {
      if (new Date(item.createTime) >= date.value[0] && new Date(item.createTime) <= date.value[1]) {
        console.log('11')
        string += getString(item)
      }
    }else if(date.value.length === 1){
      if (new Date(item.createTime) >= date.value[0]) {
        string += getString(item)
      }
    }else{
      string += getString(item)
    }
  }
  if(string.endsWith("\n")){
    string = string.substring(0, string.length - 1)
  }
  exportData.value = string
}
const getThisMonth = ()=>{
  let month = new Date().getMonth();
  let date1 = new Date();
  date1.setMonth(month);
  date1.setDate(1);
  date1.setHours(0);
  date1.setMinutes(0);
  date1.setSeconds(0);
  return [date1, new Date()]
}
const getToday = ()=>{
  let date1 = new Date();
  date1.setHours(0);
  date1.setMinutes(0);
  date1.setSeconds(0);

  let date2 = new Date();
  date2.setHours(23);
  date2.setMinutes(59);
  date2.setSeconds(59);
  return [date1, date2]
}
const getLastMonth = ()=>{
  let month = new Date().getMonth();
  let date1 = new Date();
  date1.setMonth(month-1);
  date1.setDate(1);
  date1.setHours(0);
  date1.setMinutes(0);
  date1.setSeconds(0);

  let date2 = new Date();
  date2.setMonth(month);
  date2.setDate(0);
  date2.setHours(23);
  date2.setMinutes(59);
  date2.setSeconds(59);
  return [date1, date2]
}
defineExpose({
  show
})
</script>

<template>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" title="格式化导出" width="600" height="700">
      <el-form>
        <el-form-item :label-width="90" label="需求日期范围">
          <el-date-picker style="width: 80px" v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
          <el-button-group style="margin-left: 10px">
            <el-button @click="date = getToday();doSearch()">今天</el-button>
            <el-button @click="date = getThisMonth();doSearch()">这个月</el-button>
            <el-button @click="date = getLastMonth();doSearch()">上个月</el-button>
            <el-button @click="doSearch">搜索</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item :label-width="90" label="结果数据">
          <el-input type="textarea" rows="10" v-model="exportData" />
        </el-form-item>
        <el-form-item :label-width="90">
          <el-button type="primary" @click="doExport">复制结果</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭对话框</el-button>
        </div>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped>

</style>