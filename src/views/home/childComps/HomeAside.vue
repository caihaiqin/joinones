<!-- 
 -->
<template>
  <!-- <div> -->
  <el-aside :width="isCollapse ? '60px':'200px'">
    <div class="toggle-button" @click="toggleClick">|||</div>
    <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#68a6fa"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath"
    >
      <!-- //一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in this.listItem" :key="item.id">
        <!-- //一级菜单模板 -->
        <template slot="title">
          <!-- //一级菜单图标 -->
          <i class="iconfont" :class="icons[item.id-1]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
          :index="menu_item.path"
          v-for="menu_item in item.children"
          :key="menu_item.id"
          @click="saveNavState(menu_item.path)"
        >
          <template slot="title">
            <!-- //一级菜单图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{menu_item.authName}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
  <!-- </div> -->
</template>

<script>
export default {
  name: "HomeAside",
  methods: {
    toggleClick() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(path) {
      sessionStorage.setItem("activePath", path);
      this.activePath = path;
    },
  },
  data() {
    return {
      activePath: "",
      isCollapse: false,
      icons: [
        "el-icon-user-solid",
        "el-icon-s-custom",
        "el-icon-s-unfold",
        "el-icon-crop",
        "el-icon-notebook-1",
      ],
      listItem: [
        {
          authName: "人才",
          id: 1,
          path: "/candidate",
          children: [
            { authName: "全部人才", id: 101, path: "/candidate", children: [] },
          ],
        },
        {
          authName: "客户",
          id: 2,
          path: "/customs",
          children: [
            { authName: "所有客户", id: 201, path: "/customs", children: [{}] },
          ],
        },
        { authName: "职位", id: 3, path: "/position", children: [{}] },
        {
          authName: "Pipeline",
          id: 4,
          path: "/pipeline",
          children: [
            {
              authName: "pipeline",
              id: 201,
              path: "/pipeline",
              children: [{}],
            },
          ],
        },

        { authName: "Mapping", id: 5, path: "/mapping", children: [{}] },
      ],
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/
.el-aside {
  background-color: rgba(83, 92, 101, 1);
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #555b6f;
  color: white;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>