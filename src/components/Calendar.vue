<script>
import {defineComponent, reactive} from "vue";

export defineComponent({
  setup:
})
const scripts = reactive([]);
</script>

<template>
<el-row style="margin: 0;padding: 0">
  <el-col :span="8" class="left">
    <ul>
      <li v-for=""></li>
    </ul>
  </el-col>
  <el-col :span="16" class="right">

  </el-col>
</el-row>
</template>

<style scoped>
.left{
  background: #cccccc11;
  min-height: 500px;
}
.right{
//border:  1px solid;
}
</style>