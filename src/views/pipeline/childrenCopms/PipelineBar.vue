<!--  -->
<template>
  <div>
    <el-steps :active="classActive">
      <el-step title="callList" icon="iconfont icon-liebiaoqingdan" :class="{active:active>=1}"></el-step>
      <el-step title="审核" icon="iconfont icon-shenhe" :class="{active:active>=2}"></el-step>
      <el-step title="推荐" icon="iconfont icon-tuijianshangjia" :class="{active:active>=3}"></el-step>
      <el-step title="面试" icon="iconfont icon-gongzuomianshi" :class="{active:active>=4}"></el-step>
      <el-step title="offer" icon="iconfont icon-offer" :class="{active:active>=5}"></el-step>
      <el-step title="入职" icon="iconfont icon-yuangongruzhi" :class="{active:active>=6}"></el-step>
      <el-step
        title="过保"
        icon="iconfont icon-yanjizhushou-shangchuan_shifouguobao"
        :class="{active:active>=7}"
      ></el-step>
      <el-step title="淘汰" icon="iconfont icon-taotaiku" :class="{active:active>=8}"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: "PipelineBar",
  props: ["active"],
  //监听candidateData数据变化，重新赋值
  watch: {
    active: {
      //深度监听，可监听到对象、数组的变化
      handler(newV, oldV) {
        // do something, 可使用this
        // console.log(newV, oldV);
        this.classActive = newV;
      },
      deep: true,
    },
  },
  data() {
    return { classActive: 1 };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.classActive = this.active;
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/
.active {
  cursor: pointer;
}
</style>