<script setup lang="ts">
import {ref} from "vue";
import myUtools from "../js/myUtools";
import myStorage from "../js/myStorage";
import {ElMessage, Options} from "element-plus";
import {Item} from "../js/calendar";
import {deepClone} from "../js/util";
type Prop = {
  selectItem: Item
}
const props = defineProps<Prop>();
const dialogVisible = ref<boolean>(false)
const show = () => {
  dialogVisible.value = true
}
const refreshProject = (project)=>{
    Object.assign(project, deepClone(myStorage.getOptions().projects.find(e=>e.projectName === project.projectName)))
}

defineExpose({
  show
})
</script>

<template>
  <teleport to="body">
    <el-dialog v-model="dialogVisible" title="刷新配置" width="280" height="700">
      <template #footer>
        <div style="margin-bottom: 20px">
          <el-popconfirm :title="`确认刷新${project.selectProjectName}?`" cancel-button-text="取消" confirm-button-text="确认" @confirm="refreshProject(project)"  v-for="project in props.selectItem.projects.filter(e=>e.selectProjectName)">
            <template #reference>
              <el-button type="primary">刷新{{project.selectProjectName}}的项目配置</el-button>
            </template>
          </el-popconfirm>
        </div>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped>

</style>