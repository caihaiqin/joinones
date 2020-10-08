<!--  -->
<template>
  <div class="pipeline_main">
    <el-card>
      <pipeline-tab-bar @selectPipeline="selectPipeline" />
    </el-card>
    <el-card>
      <pipeline-candidate-list :candidateData="candidateData" />
    </el-card>
  </div>
</template>

<script>
import PipelineTabBar from "./childrenCopms/PipelineTabBar";
import PipelineCandidateList from "./childrenCopms/PipelineCandidateList";
import { getCandidateByPipeline } from "network/candidate/getCandidate";
export default {
  name: "PipeLine",
  data() {
    return { candidateData: [] };
  },
  methods: {
    //按点击流程获取数据
    selectPipeline(pipeline) {
      getCandidateByPipeline(pipeline)
        .then((res) => {
          if (res.err == 0) {
            this.candidateData = res.data;
          }
        })
        .catch((err) => {
          this.$message(err);
        });
    },
  },
  components: { PipelineTabBar, PipelineCandidateList },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    //获取callList数据
    getCandidateByPipeline("callList")
      .then((res) => {
        if (res.err == 0) {
          console.log(res.data);
          this.candidateData = res.data;
        }
      })
      .catch((err) => {
        this.$message(err);
      });
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/
.pipeline_main {
  padding: 20px;
}
.el-step__title {
  font-size: 8px;
}
</style>