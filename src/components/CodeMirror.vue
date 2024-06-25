<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {basicSetup, EditorView} from "codemirror";
import {sql} from "@codemirror/lang-sql";
let sqlText = defineModel<string>({required: true});
let props = defineProps<{
  lang: string
}>();
let editorView = null;
onMounted(()=>{
  let extensions = [basicSetup,  EditorView.updateListener.of(update=>{
    if(update.docChanged) {
      sqlText.value = editorView.state.doc.text.join('\n')
    }
  })];
  if(props.lang === 'sql'){
    extensions.push(sql())
  }
  editorView = new EditorView({
    doc: sqlText.value,
    extensions: extensions,
    parent: sqlEl.value
  });
})
const showDialog = ref<boolean>(false)
const sqlEl = ref<HTMLElement>(null)
const envs = {

}
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
  <div v-if="lang === 'batch'">
    <el-link @click="showDialog = true" class="var">查看可用变量</el-link>
  </div>
  <div ref="sqlEl" id="sqlEl">
  </div>
  <el-dialog title="可用变量" v-model="showDialog">
    <div>
      <div v-for="env in envs">
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="showDialog = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
#sqlEl{
  width: 100%;
}
.var{
  font-size: 11px;
}
</style>