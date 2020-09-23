<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  //增删改查后页面自动更新
  provide() {
    return { reload: this.reload };
  },
  components: {},
  data() {
    return { isRouterAlive: true };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style>
@import "assets/css/base.css";
</style>
