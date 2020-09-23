<!--  -->
<template>
  <div class="addCandidate_container">
    <!-- 显示卡片 -->
    <el-card class="addCandidate_box_card">
      <el-tabs type="border-card">
        <el-tab-pane label="导入简历">
          <upload-add-candidate></upload-add-candidate>
        </el-tab-pane>
        <el-tab-pane label="文本粘贴">文本粘贴</el-tab-pane>
        <el-tab-pane label="在线添加">
          <online-add-candidate></online-add-candidate>
        </el-tab-pane>
        <el-tab-pane label="excel导入">excel</el-tab-pane>
        <el-tab-pane label="在线抓取">在线抓取</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import OnlineAddCandidate from "./childrenComps/OnlineAddCandidate";
import UploadAddCandidate from "./childrenComps/UploadAddCandidate";
export default {
  name: "addCandidate.vue",
  data() {
    return {};
  },
  components: {
    OnlineAddCandidate,
    UploadAddCandidate,
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/
.addCandidate_box_card {
  width: 100%;
  height: 100%;
}
</style>