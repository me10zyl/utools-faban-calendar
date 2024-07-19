<script setup lang="ts">
import {computed, onMounted, onUpdated, ref, watch} from "vue";
import {basicSetup, EditorView} from "codemirror";
import {sql} from "@codemirror/lang-sql";
import storage from "@/js/storage";
import myStorage from "@/js/myStorage";
import {Env, Project} from "@/js/options.d";
import {ElMessage} from "element-plus";
import {b} from "vite/dist/node/types.d-aGj9QkWt";
import {yaml} from "@codemirror/lang-yaml";

interface EnvVar {
  label: string
  variableName: string
  desc: string
  value?: string
}

let sqlText = defineModel<string>({required: true});
let props = withDefaults(defineProps<{
  lang: string,
  syncBtn?: boolean,
  cmdText?: 'statusMergedCmd' | 'publishCmd' | 'mergeBranchCmd' | 'statusCmd' | 'statusStartTimeCmd',
  envName?: 'string'
}>(), {
  syncBtn(props) {
      return false
  },
})
// const emit = defineEmits(['update:model-value']);
let editorView = null;
onMounted(() => {
  let extensions = [basicSetup, EditorView.updateListener.of(update => {
    if (update.docChanged) {
      // emit('update:model-value', editorView.state.doc.text.join('\n'))
       sqlText.value = editorView.state.doc.toString()
       sqlText['docChangedEvent'] = true
    }
  })];
  if (props.lang === 'sql') {
    extensions.push(sql())
  }else if(props.lang === 'yaml'){
    extensions.push(yaml())
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
    },{
      label:'jenkins账号',
      variableName: '{{jenkinsUsername}}',
      desc: 'jenkins的账号，用于发版命令'
    },{
      label:'jenkins账号或token',
      variableName: '{{jenkinsPasswordOrToken}}',
      desc: 'jenkins的账号或toke，用于发版命令'
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
  const syncOtherEnv = ()=>{
    let options = myStorage.getOptions();
    let success: boolean = false;
    options.projects.forEach((p: Project)=>{
      p.envs.forEach((env: Env)=>{
        if(env.envName === props.envName) {
          env[props.cmdText] = sqlText.value;
          success = true;
        }
      })
    })
    if(success) {
      myStorage.saveOptions(options)
      ElMessage('同步成功, 请重新进入程序应用更改')
    }
  }
</script>

<template>
  <div v-if="lang === 'batch'">
    <el-link @click="showDialog = true" class="var">查看可用环境变量</el-link>
    <el-popconfirm title="确认同步?同步后相同环境的本脚本将会一起改变" cancel-button-text="取消" confirm-button-text="确认" @confirm="syncOtherEnv" v-if="syncBtn && cmdText && envName">
      <template #reference>
        <el-link class="var" style="margin-left: 15px">同步其他环境</el-link>
      </template>
    </el-popconfirm>

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