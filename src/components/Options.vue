<script lang="ts">
import {defineComponent} from "vue";

export interface Env {
  envName: string,
  branchName: string,
  projectPath: string,
  publishCmd: string,
  statusCmd: string,
  startTimeCmd: string
}

export interface Project {
  projectName: string,
  showSQL: boolean,
  showConfigCenter: boolean,
  configCenterName: string,
  showProjectRemark: string,
  projectDesc: string,
  newBranchCmd: string,
  gitUrl: string,
  envs: Env[]
}

export default defineComponent({
  setup(prop, ctx) {
    const projects: Project[] = [
      {
        projectName: '11',
        showSQL: false,
        showConfigCenter: false,
        configCenterName: 'aaaa',
        showProjectRemark: 'aa',
        projectDesc: 'aa',
        newBranchCmd: 'aa',
        gitUrl: 'aa',
        envs: []
      }
    ];
    const editProject = () => {

    }
    const delProject = () => {

    }
    return {
      projects, delProject, editProject
    }
  }
})

</script>

<template>
  <div class="el-container">
    <div class="el-col-12 el-col-lg-offset-5">
      <el-form style="margin-bottom: 10px">
        <div>项目默认配置</div>
        <hr/>
        <div>
          <el-form-item>
            <el-checkbox>默认展示SQL</el-checkbox>
          </el-form-item>
          <div class="panel" style="margin-bottom: 5px">
            <el-form-item>
              <el-checkbox>默认展示配置中心</el-checkbox>
            </el-form-item>
            <el-form-item>
              <label>默认配置中心名称</label>
              <el-input placeholder="nacos"/>
            </el-form-item>
          </div>
          <el-form-item>
            <el-checkbox>默认展示项目说明</el-checkbox>
          </el-form-item>
        </div>
        <div>
          <el-button>保存默认配置</el-button>
        </div>
      </el-form>
      <div>
        <div>项目配置</div>
        <hr/>
        <el-button type="primary">新增项目</el-button>
        <el-table :data="projects" border style="margin-top:10px;" width="100%">
          <el-table-column prop="projectName" label="项目名称" width="100"/>
          <el-table-column prop="projectDesc" label="项目描述" width="500"/>
          <el-table-column label="操作">
            <el-button @click="editProject">编辑</el-button>
            <el-button @click="delProject">删除</el-button>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<style scoped>
.panel {
  border: 1px dashed #00000011;
  padding: 10px;
}

a {
  text-decoration: none;
  color: #10234b;
}
</style>