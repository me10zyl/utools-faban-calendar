<script setup lang="ts">
import myUtools, {CmdVars} from "@/js/myUtools";
import {onUpdated, ref} from "vue";
import {Command, ExecCallback} from "@/js/calendar.d";
import CommandDialog from "@/components/CommandDialog.vue";

const props = defineProps<{
  cmdVars: CmdVars,
  cmd: string
}>();


const lastMessage = ref<string>('')
const execResult = ref<Command>({
  commands: [],
  exitCode: undefined,
  execScript: ""
})
const runExec = () => {
  execResult.value.exitCode = undefined;
  execResult.value.commands.splice(0, execResult.value.commands.length)
  execResult.value.execScript = ''
  // let cmd = myUtools.readFile('scripts/status-merged.bat');
  const script = myUtools.evaluateCmd(props.cmd, props.cmdVars, (e: ExecCallback) => {
    commandDialog.value.show()
    if (e.type === 'finished') {
      lastMessage.value = ':' + e.lastMessage;
      execResult.value.exitCode = e.data as number
    }else{
      execResult.value.commands.push({
        type: e.type,
        text: e.data as string
      })
    }
  });
  execResult.value.execScript = script;
}

const commandDialog = ref<InstanceType<typeof CommandDialog>>()
onUpdated(() => {
  lastMessage.value = ''
})

</script>

<template>
  <el-button @click="runExec" class="cmdStatus">
    <slot></slot>
    <span class="success">{{ lastMessage }}</span>
  </el-button>
  <teleport to="body">
    <CommandDialog :execute-result="execResult" ref="commandDialog"/>
  </teleport>
</template>

<style scoped>
.cmdStatus{
  cursor: pointer;
  color: var(--fontColor);
}
.success {
  color: #09bcd6;
}

</style>