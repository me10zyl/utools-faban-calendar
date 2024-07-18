<script setup>

import Vditor from "vditor";
import {onMounted} from "vue";

onMounted(()=>{
  const contentEditor = new Vditor('vditor', {
    height: 360,
    toolbarConfig: {
      pin: true,
    },
    cache: {
      enable: false,
    },
    after: () => {
      contentEditor.setValue('hello, Vditor + Vue!')
    },
  })
})

</script>

<template>

</template>

<style scoped>

</style>