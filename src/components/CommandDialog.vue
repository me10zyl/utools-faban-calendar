<script setup lang="ts">
import {onUpdated, ref, watch} from "vue";
import {Command} from "@/js/calendar.d";

const props = defineProps<{
  executeResult: Command
}>()

const dialogVisible = ref<boolean>(false)
const show = () => {
  dialogVisible.value = true
}
const title = ref<string>('命令执行结果窗口')
watch(props.executeResult, ()=>{
  if(props.executeResult.exitCode === 0){
    title.value = '命令执行结果窗口 - 执行成功'
  }else if(props.executeResult.exitCode !== undefined){
    title.value = '命令执行结果窗口 - 执行失败'
  }
})
defineExpose({
  show
})
</script>

<template>
  <teleport to="body">
    <el-dialog :title="title" v-model="dialogVisible" width="70%">
      <div>
        <el-result
            :icon="executeResult.exitCode === 0 ? 'success' : 'error'"
            :title="executeResult.exitCode === 0 ? '执行成功' : '执行失败'"
            style="margin-top: 0;padding-top: 0;padding-bottom: 10px"
        >
        </el-result>
        <div v-for="command in executeResult.commands" :class="{stdout: command.type==='stdout', stderr: command.type==='stderr' }">
          {{command.text}}
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false" type="primary">关闭</el-button>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped>
.stdout{
  color: #67C23A;
}
.stderr{
  color: #F56C6C;
}
</style>