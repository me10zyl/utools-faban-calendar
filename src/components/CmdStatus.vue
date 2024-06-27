<script setup lang="ts">
import myUtools, {CmdVars} from "@/js/myUtools";
import {onUpdated, ref} from "vue";
import {ExecCallback} from "@/js/calendar.d";

const props = defineProps<{
  cmdVars: CmdVars,
  cmd: string,
  initMessage: string,
  label: string
}>();

const lastMessage = ref<string>('')
const exitCode = ref<number>(-1)
const runExec = () => {
  myUtools.evaluateCmd(props.cmd, props.cmdVars, (e: ExecCallback) => {
    if (e.type === 'finished') {
      lastMessage.value = e.lastMessage;
      exitCode.value = e.data as number;
    }
  })
}
onUpdated(() => {
  runExec()
})

</script>

<template>
  <div @click="runExec">
    <span>{{label}}</span>
    <span>{{ lastMessage ? lastMessage : initMessage }}</span>
  </div>
</template>

<style scoped>

</style>