<script setup lang="ts">
import {computed, onMounted, onUpdated, ref, watch} from "vue";
import {basicSetup, EditorView} from "codemirror";
import {sql} from "@codemirror/lang-sql";

interface EnvVar {
  label: string
  variableName: string
  desc: string
  value?: string
}

let sqlText = defineModel<string>({required: true});
let props = defineProps<{
  lang: string
}>();
// const emit = defineEmits(['update:model-value']);
let editorView = null;
onMounted(() => {
  let extensions = [basicSetup, EditorView.updateListener.of(update => {
    if (update.docChanged) {
      // emit('update:model-value', editorView.state.doc.text.join('\n'))
       sqlText.value = editorView.state.doc.text.join('\n')
       sqlText['docChangedEvent'] = true
    }
  })];
  if (props.lang === 'sql') {
    extensions.push(sql())
  }
  editorView = new EditorView({
    doc: sqlText.value,
    extensions: extensions,
    parent: sqlEl.value
  });
})
const envVars = computed((): EnvVar[] => {
  return [
    {
      label: '分支名',
      variableName: '{{branch}}',
      desc: '填写的需求分支名称'
    },{
      label: 'git地址',
      variableName: '{{gitUrl}}',
      desc: '本项目的git地址'
    },{
      label: '项目基础路径',
      variableName: '{{basePath}}',
      desc: '全局配置中配置的项目基础路径，用于克隆一份代码，并新建分支、发版等'
    },{
      label: '项目名称',
      variableName: '{{projectName}}',
      desc: '本项目的项目名称，最好使用英文，将会用于创建目录等操作'
    },{
      label: '正式环境分支',
      variableName: '{{releaseBranch}}',
      desc: '本项目的正式环境分支，用于检出新分支'
    },{
      label : '当前环境发版分支',
      variableName: '{{fabanBranchName}}',
      desc: '获取当前环境的发版分支'
    }
  ];
})
const showDialog = ref<boolean>(false)
const sqlEl = ref<HTMLElement>(null)
onUpdated(()=>{
  if (editorView && !sqlText['docChangedEvent']) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: sqlText.value
      }
    })
  }
  sqlText['docChangedEvent'] = false
})
</script>

<template>
  <div v-if="lang === 'batch'">
    <el-link @click="showDialog = true" class="var">查看可用环境变量</el-link>
  </div>
  <div ref="sqlEl" id="sqlEl">
  </div>
  <el-dialog title="可用环境变量" v-model="showDialog">
    <div>
      <dl>
        <template v-for="env in envVars">
          <dt><h4>{{env.variableName}} {{ env.label }}</h4></dt>
          <dd>{{ env.desc }}</dd>
        </template>
      </dl>
    </div>
    <template #footer>
      <el-button type="primary" @click="showDialog = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
#sqlEl {
  width: 100%;
}

.var {
  font-size: 11px;
}
</style>