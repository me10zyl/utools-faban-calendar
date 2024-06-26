<script setup lang="ts">
import {onUpdated, ref, watch} from "vue";
import {Command} from "@/js/calendar.d";
import ex = CSS.ex;

const props = defineProps<{
  executeResult: Command
}>()

const dialogVisible = ref<boolean>(false)
const show = () => {
  dialogVisible.value = true
}
const title = ref<string>('命令执行结果窗口')
watch(props.executeResult, () => {
  if (props.executeResult.exitCode === 0) {
    title.value = '命令执行结果窗口 - 执行成功'
  } else if (props.executeResult.exitCode !== undefined) {
    title.value = '命令执行结果窗口 - 执行失败'
  } else {
    title.value = '命令执行结果窗口'
  }
})
defineExpose({
  show
})
const scriptDialogVisible = ref<boolean>(false)
const showScript = ()=>{
  scriptDialogVisible.value = true
}
</script>

<template>
  <teleport to="body">
    <el-dialog :title="title" v-model="dialogVisible" width="70%">
      <template #header>
        <span role="heading" aria-level="2" class="el-dialog__title">{{ title }}</span>
        <el-link style="margin-left: 10px;" @click="showScript">查看执行脚本</el-link>
        <button aria-label="Close this dialog" class="el-dialog__headerbtn" type="button">
          <i class="el-icon el-dialog__close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
              <path fill="currentColor"
                    d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path>
            </svg>
          </i></button>
      </template>
      <div>
        <el-result
            :icon="executeResult.exitCode === 0 ? 'success' : 'error'"
            :title="executeResult.exitCode === 0 ? '执行成功' : '执行失败'"
            v-if="executeResult.exitCode !== undefined "
            style="margin-top: 0;padding-top: 0;padding-bottom: 10px"
        >
        </el-result>
        <div v-for="command in executeResult.commands"
             :class="{stdout: command.type==='stdout', stderr: command.type==='stderr' }">
          {{ command.text }}
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false" type="primary">关闭</el-button>
      </template>
    </el-dialog>
    <el-dialog title="执行脚本" v-model="scriptDialogVisible" width="80%">
<pre>
<code>
{{executeResult.execScript}}
</code>
</pre>
    </el-dialog>
  </teleport>
</template>

<style scoped>
.stdout {
  color: #67C23A;
}
pre{
  overflow: scroll;
}
.wrap{
  white-space: pre-wrap;       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
}

.stderr {
  color: #F56C6C;
}
</style>