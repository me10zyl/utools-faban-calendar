<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {basicSetup, EditorView} from "codemirror";
import {sql} from "@codemirror/lang-sql";

let sqlText = defineModel<string>({required: true});
let editorView = null;
onMounted(()=>{
   editorView = new EditorView({
    doc: sqlText.value,
    extensions: [basicSetup, sql(), EditorView.updateListener.of(update=>{
      if(update.docChanged) {
        sqlText.value = editorView.state.doc.text.join('\n')
      }
    })],
    parent: sqlEl.value
  });
})
const sqlEl = ref<HTMLElement>(null)
watch(sqlText, ()=>{
  if(editorView){
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: sqlText.value
      }
    })
  }
})
</script>

<template>
  <div ref="sqlEl" id="sqlEl">
  </div>
</template>

<style scoped>
#sqlEl{
  width: 100%;
}
</style>