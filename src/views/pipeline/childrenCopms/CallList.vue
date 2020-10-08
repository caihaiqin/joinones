<!--  -->
<template>
  <div>
    <el-row>
      <el-button size="small" @click="confirmRecommend">确认推荐</el-button>
      <el-button size="small" @click="toCommunicate">待沟通</el-button>
      <el-button size="small" @click="candidateRefuse">人才拒绝</el-button>
      <el-button size="small" @click="counselorRefuse">顾问拒绝</el-button>
      <el-button size="small" @click="customerRefuse">客户拒绝</el-button>
      <el-button size="small" @click="recommended">已推荐</el-button>
    </el-row>
    <!-- //时间线显示备注信息 -->
    <div class="block">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in callListDialogInfo.remarks"
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
              <el-card>{{activity.remarks}}</el-card>
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
            <span>备注</span>
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
        <el-row :gutter="10">
          <el-col :span="4">
            <span>添加提醒</span>
          </el-col>
          <el-col :span="16">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker v-model="remindtime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">
            <span>提醒人</span>
          </el-col>
          <el-col :span="16">
            <div class="block">
              <span class="demonstration"></span>
              <el-cascader
                placeholder="请选择提醒人"
                v-model="reminder"
                :options="options"
                @change="cascaderChange"
              ></el-cascader>
            </div>
          </el-col>
        </el-row>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="2">
          <el-col :span="10">
            <el-button type="primary" @click="saveRemarks">保存备注</el-button>
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
import PipelineBar from "./PipelineBar";
import { updateCandidateById } from "network/candidate/getCandidate.js";
import { timeFormat } from "common/utils.js";
export default {
  // 注入刷新页面依赖
  inject: ["reload"],
  name: "CallList",
  props: ["candidateId", "candidateInfo", "parHandleClose", "userList"],
  components: { PipelineBar },
  //监听candidateId数据变化，重新赋值
  watch: {
    candidateInfo: {
      //深度监听，可监听到对象、数组的变化
      handler(newV, oldV) {
        // do something, 可使用this
        // console.log(newV, oldV);
        this.newCandidateInfo = newV;

        this.callListDialogInfo = this.newCandidateInfo.pipeline_info.callList;
      },
      deep: true,
    },
  },
  methods: {
    //时间选择器值改变触发
    cascaderChange(reminder) {
      console.log(reminder[0]);
    },
    //点击确认推荐按钮
    confirmRecommend() {
      console.log(this.candidateId);
      this.label = "confirmRecommend";
      this.newCandidateInfo.pipeline_info.subpipeline = "待审核";
      this.newCandidateInfo.pipeline = "审核";
      updateCandidateById(this.candidateId, {
        pipeline: this.newCandidateInfo.pipeline,
        pipeline_info: this.newCandidateInfo.pipeline_info,
      });
      this.parHandleClose();
      this.reload();
    },
    //点击待沟通按钮
    toCommunicate() {
      this.dialogVisible = true;
      this.label = "communicate";
    },
    //点击人才拒绝按钮
    candidateRefuse() {
      this.dialogVisible = true;
      this.label = "candidate_refuse";
    },
    //点击顾问拒绝按钮
    counselorRefuse() {
      this.dialogVisible = true;
      this.label = "counselor_refuse";
    },
    //点击客户拒绝按钮
    customerRefuse() {
      this.dialogVisible = true;
      this.label = "customer_refuse";
    },
    //点击已推荐按钮
    recommended() {
      this.dialogVisible = true;
      this.label = "recommended";
    },
    //点击保存备注按钮
    saveRemarks() {
      this.dialogVisible = false;
      //保存所有流程提醒事项
      this.newCandidateInfo.pipeline_info.reminds.push({
        remindtime: this.remindtime,
        reminder: this.reminder,
      });

      //保存子流程内提醒事项
      this.callListDialogInfo[this.label].reminder.push(this.reminder[0]);
      this.callListDialogInfo[this.label].remindtime = this.remindtime;
      this.callListDialogInfo[this.label].remarks.push(this.remarks);
      //获得添加备注的时候的添加用户
      let remarkTime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      let remarker = window.sessionStorage.getItem("us");
      console.log(remarkTime);
      //保存备注信息
      this.callListDialogInfo.remarks.push({
        remarks: this.remarks,
        remarkTime: remarkTime,
        remarker: remarker,
      });

      //根据状态列表得到状态值
      this.callListDialogInfo.subpipeline = this.statusList[this.label];
      this.newCandidateInfo.pipeline_info.subpipeline = this.statusList[
        this.label
      ];
      //更新状态时间
      let statustime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      this.callListDialogInfo.statustime = statustime;
      this.callListDialogInfo[this.label].statustime = statustime;
      //重新将this.callListDialogInfo赋值给newCandidateInfo.pipeline_info

      this.newCandidateInfo.pipeline_info.callList = this.callListDialogInfo;
      updateCandidateById(this.candidateId, {
        pipeline_info: this.newCandidateInfo.pipeline_info,
      })
        .then((res) => {
          if (res.err == 0) {
            this.$message("保存成功");
            //提醒人 备注清空
            this.reminder = "";
            this.remarks = "";
            //列表刷新
            this.reload();
          } else {
            this.$message("保存失败");
          }
        })
        .catch((err) => {
          this.$message("内部错误");
        });
    },
    //对话框关闭时间
    dialogClose() {
      this.dialogVisible = false;
    },
  },
  data() {
    return {
      callListDialogInfo: {},
      //保存选择了哪个按钮
      label: "",
      //状态对应列表
      statusList: {
        confirmRecommend: "已推荐",
        communicate: "待沟通",
        candidate_refuse: "人才拒绝",
        counselor_refuse: "顾问拒绝",
        customer_refuse: "客户拒绝",
        recommended: "已推荐",
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
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.newCandidateInfo = this.candidateInfo;
    this.callListDialogInfo = this.newCandidateInfo.pipeline_info.callList;
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