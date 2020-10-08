<!--  -->
<template>
  <div>
    <el-row>
      
      <el-button size="small" @click="restrat_pipeline">重启流程</el-button>
    </el-row>
    <!-- //时间线显示备注信息 -->
    <div class="block">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in entryDialogInfo.remarks"
          :key="index"
          icon="el-icon-user"
          type="primary"
          :timestamp="activity.remarkTime"
          placement="top"
          v-show="activity.remarks.length>0"
        >
          <el-row :gutter="10">
            <el-col :span="4">
              <div class="remarker">
                <img src="~assets/img/boy.svg" alt />
                <div>{{activity.remarker}}</div>
              </div>
            </el-col>
            <el-col :span="20">
              <!-- <el-card>{{activity.remarks}}</el-card> -->
              <!-- //使用<p class="text" v-html="activity.remarks"></p>可以将字符串中的换行显示出来 -->
              <el-card>
                <p class="text" v-html="activity.remarks"></p>
              </el-card>
            </el-col>
          </el-row>
        </el-timeline-item>
      </el-timeline>
    </div>
    <el-dialog
      :title="newCandidateInfo.name"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="dialogClose"
      :append-to-body="true"
    >
      <!-- //页面中用到了2个
      <el-dialog></el-dialog>弹框（或者是dialog中再嵌套dialog），会出现2个灰色蒙版层叠加，需要再点一下蒙层才会消失。
      用一个属性解决 :append-to-body="true"-->
      <span>
        <el-row :gutter="10">
          <el-col :span="4">
            <span v-show="label=='restrat_pipeline'">原因备注</span>
          </el-col>
          <el-col :span="16">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="remarks"
            ></el-input>
          </el-col>
        </el-row>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="2">
          <el-col :span="10">
            <el-button type="primary" @click="saveRemarks">{{statusList[label]}}</el-button>
          </el-col>
          <el-col :span="10">
            <el-button @click="dialogVisible = false">取 消</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateCandidateById } from "network/candidate/getCandidate.js";
import { timeFormat } from "common/utils.js";
export default {
  inject: ["reload"],
  name: "OverInsured",
  props: ["candidateId", "candidateInfo", "parHandleClose", "userList"],
  data() {
    return {
      index: 0, //用于保存切换pipelineTabBar，作为事件总结参数
      entryDialogInfo: {},
      //保存选择了哪个按钮
      label: "",
      //状态对应列表
      statusList: {
        restrat_pipeline: "重启流程",
      },
      //保存备注信息 提醒人 提醒时间
      remarks: "",
      reminder: [],
      remindtime: new Date(),
      newCandidateId: "",
      newCandidateInfo: {},
      dialogVisible: false,
      options: [],
    };
  },
  watch: {
    candidateInfo: {
      //深度监听，可监听到对象、数组的变化
      handler(newV, oldV) {
        // do something, 可使用this
        // console.log(newV, oldV);
        this.newCandidateInfo = newV;

        this.entryDialogInfo = this.newCandidateInfo.pipeline_info.over_insured;
        console.log(this.entryDialogInfo);
      },
      deep: true,
    },
  },
  methods: {
    saveRemarks() {
      this.dialogVisible = false;

      this.entryDialogInfo[this.label].remarks.push(this.remarks);

      //获得添加备注的时候的添加用户
      let remarkTime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      let remarker = window.sessionStorage.getItem("us");
      console.log(remarkTime);
      this.entryDialogInfo.remarks.push({
        remarks: this.remarks,
      });

      //根据状态列表得到状态值
      let statustime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      this.entryDialogInfo.subpipeline = this.statusList[this.label];

      if (this.label == "restrat_pipeline") {
        this.newCandidateInfo.pipeline = "callList";
        this.newCandidateInfo.pipeline_info.subpipeline = "重启流程";
        

        //切换到callList流程 index=0
        this.index = 0;
      }

      //更新状态时间

      this.entryDialogInfo.statustime = statustime;
      this.entryDialogInfo[this.label].statustime = statustime;
      //重新将this.entryDialogInfo赋值给newCandidateInfo.pipeline_info

      this.newCandidateInfo.pipeline_info.over_insured = this.entryDialogInfo;
      //{
      // pipeline: this.newCandidateInfo.pipeline,
      // pipeline_info: this.newCandidateInfo.pipeline_info,
      //}
      updateCandidateById(this.candidateId, this.newCandidateInfo)
        .then((res) => {
          if (res.err == 0) {
            this.$message("提交成功");
            //提醒人 备注清空
            this.reminder = "";
            this.remarks = "";
            //列表刷新
            this.parHandleClose();
            //
            this.$EventBus.$emit("pipelineSubmit", this.index);
            // this.reload();
          } else {
            this.$message("保存失败");
          }
        })
        .catch((err) => {
          this.$message("内部错误");
        });
    },
    //对话框关闭事件
    dialogClose() {
      this.dialogVisible = false;
    },
    // 重启流程按钮
    restrat_pipeline() {
      this.dialogVisible = true;
      this.label = "restrat_pipeline";
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.newCandidateInfo = this.candidateInfo;
    console.log(this.newCandidateInfo);
    this.entryDialogInfo = this.newCandidateInfo.pipeline_info.over_insured;
    //将所有用户列表转化到options配置里
    for (let i = 0; i < this.userList.length; i++) {
      this.options.push({
        value: this.userList[i].us,
        label: this.userList[i].us,
      });
    }
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/
.el-row {
  margin-top: 20px;
}
.block {
  margin-top: 20px;
}
.remarker {
  width: 100%;
}
.remarker img {
  width: 20%;
}
</style>