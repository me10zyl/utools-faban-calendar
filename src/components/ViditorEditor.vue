<script setup lang="ts">

import Vditor from "vditor";
import 'vditor/dist/index.css'
import {onMounted, onUpdated, ref} from "vue";
import myUtools from "@/js/myUtools";
import myStorage from "@/js/myStorage";
import {mermaidRender} from "vditor/dist/ts/markdown/mermaidRender";
const content = defineModel<string>();
const vditorEl = ref<HTMLElement>(null)
let contentEditor:Vditor = null;
function getFileName(url:string){
  if(!url){
    return url;
  }
  return url.substring(url.lastIndexOf('/') + 1)
}
onMounted(()=>{
  contentEditor = new Vditor(vditorEl.value, {
    cdn: window.replaceUrl('/vditor'),
    height: 300,
    mode: 'ir',
    toolbar: [
      // 'emoji' , 'headings' , 'bold' , 'italic' , 'strike' , '|' , 'line' , 'quote' , 'list' , 'ordered-list' , 'check' ,'outdent' ,'indent' , 'code' , 'inline-code' , 'insert-after' , 'insert-before' ,'undo' , 'redo' , 'upload' , 'link' , 'table' , 'record' , 'edit-mode' , 'both' , 'preview' , 'fullscreen' , 'outline' , 'code-theme' , 'content-theme' , 'export', 'devtools' , 'info' , 'help' , 'br'
        'emoji', 'upload', 'check', 'list', 'ordered-list', 'table',  'link', '|' ,'fullscreen', 'export'
    ],
    toolbarConfig: {
      pin: false,
    },
    upload: {
      url: 'https://sm.ms/api/v2/upload',
      headers: {
        "Authorization": myStorage.getOptions().defaultOptions.smmsToken
      },
      fieldName: "smfile",
      linkToImgCallback: responseText => {
        console.log('linkToImgCallback responseText', responseText)
      },
      error(msg) {
        contentEditor.insertValue(`上传失败:${msg}`);
      },
      success(editor: HTMLPreElement, msg) {
        try {
          let json: object = JSON.parse(msg)
          if (!json.success && json.code === 'image_repeated') {
            contentEditor.insertValue(`![${getFileName(json.images)}](${json.images})`)
          } else if(json.success) {
            contentEditor.insertValue(`![${getFileName(json.data.url)}](${json.data.url})`)
          }else{
            contentEditor.insertValue(`上传失败:${msg} 请设置sm.ms Token`);
          }
        }catch (e){
          contentEditor.insertValue(`上传失败:${msg}`);
        }
      },
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
  margin-bottom: 3px;
}

:deep(.vditor-reset p),
:deep(.vditor-reset pre) {
  margin: 2px 0;
}
:deep(.vditor-reset h1),
:deep(.vditor-reset h2),
:deep(.vditor-reset h3),
:deep(.vditor-reset h4),
:deep(.vditor-reset h5),
:deep(.vditor-reset h6){
  padding-bottom: 0;
  margin: 3px;
}

:deep(.vditor-toolbar){
  padding-left: 3px !important ;
}
:deep(pre.vditor-reset){
  padding: 5px !important;
}
</style>