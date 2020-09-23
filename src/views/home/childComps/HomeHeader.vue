<!--  -->
<template>
  <!-- <div class="el-container"> -->
  <el-header>
    <div class="system_name">
      <!-- <img src="~assets/img/logo.png" alt /> -->
      <span>仲一科技人才系统</span>
    </div>
    <el-button size="small" type="info" @click="logout">退出登录</el-button>
  </el-header>
  <!-- </div> -->
</template>

<script>
export default {
  name: "HomeHeader",
  data() {
    return {};
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },

  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/
.el-header {
  display: flex;
  width: 100%;
  background-color: rgba(83, 92, 101, 0.8);
  padding-left: 0;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.system_name {
  display: flex;
  align-items: center;
}
.system_name span {
  margin-left: 20px;
}
</style>