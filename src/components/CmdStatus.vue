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
const exitCode = ref<number>(-1)
const runExec = () => {
  console.log(props)
  execResult.value.exitCode = undefined;
  execResult.value.commands.splice(0, execResult.value.commands.length)
  execResult.value.execScript = ''
  let cmd = myUtools.readFile('scripts/status-merged.bat');
  console.log(props.cmd,'cccc')
  const script = myUtools.evaluateCmd(props.cmd, props.cmdVars, (e: ExecCallback) => {
    console.log('exec:', e)
    commandDialog.value.show()
    if (e.type === 'finished') {
      lastMessage.value = e.lastMessage;
      exitCode.value = e.data as number;
    }else{
      execResult.value.commands.push({
        type: e.type,
        text: e.data as string
      })
    }
  });
  execResult.value.execScript = script;
}
const execResult = ref<Command>({
  commands: [],
  exitCode: undefined,
  execScript: ""
});
const commandDialog = ref<InstanceType<typeof CommandDialog>>()
onUpdated(() => {
  runExec()
})

</script>

<template>
  <div @click="runExec" class="cmdStatus">
    <slot></slot>
    <span>{{ lastMessage }}</span>
  </div>
  <CommandDialog :execute-result="execResult" ref="commandDialog"/>
</template>

<style scoped>
.cmdStatus{
  cursor: pointer;
}
</style>