<!--  -->
<template>
  <div class="main">
    <div
      class="pipelineitem"
      v-for="(item,index) in list"
      :key="index"
      @click="click(index)"
      :class="{active:cur==index}"
    >
      <i :class="item.iconClass"></i>
      <div class="text">{{item.text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {
      cur: 0,
      list: [
        { iconClass: "iconfont icon-liebiaoqingdan", text: "callList" },
        { iconClass: "iconfont icon-shenhe", text: "审核" },
        { iconClass: "iconfont icon-tuijianshangjia", text: "推荐" },
        { iconClass: "iconfont icon-gongzuomianshi", text: "面试" },
        { iconClass: "iconfont icon-offer", text: "offer" },
        { iconClass: "iconfont icon-yuangongruzhi", text: "入职" },
        {
          iconClass: "iconfont icon-yanjizhushou-shangchuan_shifouguobao",
          text: "过保",
        },
        { iconClass: "iconfont icon-taotaiku", text: "淘汰" },
      ],
    };
  },
  methods: {
    click(index) {
      this.cur = index;
      this.$emit("selectPipeline", this.list[index].text);
    },
    // auditPass(index) {
    //   this.cur = index;
    //   this.$emit("selectPipeline", this.list[index].text);
    // },
  },

  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    //通过事件总线监听流程提交事件 切换到相应流程
    this.$EventBus.$on("pipelineSubmit", (index) => {
      this.click(index);
    });
  },
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/
.text {
  margin: 10px;
}
.main {
  display: flex;
  margin: 20px;
  width: 800px;
  box-shadow: 0px 0px 5px #888888;
}
.pipelineitem {
  display: inline-block;
  flex: 1;
  text-align: center;
  cursor: pointer;
}
.active {
  color: #5fa0ff;
}
</style>