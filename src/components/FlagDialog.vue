<script setup lang="ts">
import {ref} from "vue";
import {Flag, Item} from "../js/calendar";

const dialogVisible = ref(false);
const selectItem = ref<Item>();
const show = (select:Item)=>{
  dialogVisible.value = true
  selectItem.value = select
}
defineExpose({
  show
})
const clickFlag = (type,label)=>{
  const flag : Flag = {
    type: type,
    label: label
  }
  selectItem.value.flag = flag
  dialogVisible.value = false
}
const clearFlag = ()=>{
  delete selectItem.value.flag
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="设置优先级" width="600" height="700">
    <div class="row">
      <el-tag type="danger" @click="clickFlag('danger', '1')">1</el-tag>
      <el-tag type="warning" @click="clickFlag('warning', '2')">2</el-tag>
      <el-tag type="success" @click="clickFlag('success', '3')">3</el-tag>
      <el-tag type="primary" @click="clickFlag('primary', '4')">4</el-tag>
      <el-tag type="info" @click="clickFlag('info', '5')">5</el-tag>
      <el-button type="text" @click="clearFlag" style="justify-self: right">清除优先级</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.row{
  display: flex;
  gap: 20px;
  cursor: pointer;
}
</style>