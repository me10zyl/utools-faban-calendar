<script setup lang="ts">

import Vditor from "vditor";
import 'vditor/dist/index.css'
import {onMounted, onUpdated, ref} from "vue";
const content = defineModel<string>();
const vditorEl = ref<HTMLElement>(null)
let contentEditor = null;
onMounted(()=>{
  contentEditor = new Vditor(vditorEl.value, {
    cdn: '',
    height: 300,
    mode: 'ir',
    toolbar: [
      // 'emoji' , 'headings' , 'bold' , 'italic' , 'strike' , '|' , 'line' , 'quote' , 'list' , 'ordered-list' , 'check' ,'outdent' ,'indent' , 'code' , 'inline-code' , 'insert-after' , 'insert-before' ,'undo' , 'redo' , 'upload' , 'link' , 'table' , 'record' , 'edit-mode' , 'both' , 'preview' , 'fullscreen' , 'outline' , 'code-theme' , 'content-theme' , 'export', 'devtools' , 'info' , 'help' , 'br'
        'emoji', 'upload', 'check', 'list', 'ordered-list', 'table', 'fullscreen'
    ],
    toolbarConfig: {
      pin: false,
    },
    upload: {
      url: 'https://sm.ms/api/v2/upload',
      headers: {
        "Content-Type" : "multipart/form-data",
        "Authorization": "14ac5499cfdd2bb2859e4476d2e5b1d2bad079bf"
      },
      fieldName: "smfile"
    },
    cache: {
      enable: false,
    },
    blur(value) {
      console.log('blur', value)
        content.value = value
    },
    after: () => {
      contentEditor.setValue(content.value)
    },
  })
})

onUpdated(()=>{
  if(contentEditor) {
    contentEditor.setValue(content.value)
  }
})

</script>

<template>
<div  ref="vditorEl">
</div>
</template>

<style scoped>
:deep(.vditor-reset){
  font-size: var(--fontSize);
}
:deep(.vditor-reset ul){
  margin-bottom: 5px;
}

:deep(.vditor-reset p),
:deep(.vditor-reset pre) {
  margin: 5px 0;
}
:deep(.vditor-reset h1),
:deep(.vditor-reset h2),
:deep(.vditor-reset h3),
:deep(.vditor-reset h4),
:deep(.vditor-reset h5),
:deep(.vditor-reset h6){
  padding-bottom: 0;
  margin: 5px;
}
</style>