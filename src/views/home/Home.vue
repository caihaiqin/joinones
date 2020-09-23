<!--  -->
<template>
  <el-container class="home_container">
    <home-header />
    <el-container class="aside_container">
      <home-aside />
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HomeHeader from "./childComps/HomeHeader";
import HomeAside from "./childComps/HomeAside";
export default {
  name: "Home",
  data() {
    return {};
  },
  components: {
    HomeHeader,
    HomeAside,
  },
  methods: {},
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/
/* .el-header {
  display: flex;
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
} */
/* .el-aside {
  background-color: rgba(83, 92, 101, 1);
} */
.home_container {
  height: 100%;
}
.aside_container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 60px;
}
.el-main {
  padding: 0;
}
</style>