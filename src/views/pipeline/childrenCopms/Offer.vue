<!--  -->
<template>
  <div>
    <el-row>
      <el-button size="small" @click="offer_follow">offer跟进</el-button>
      <el-button size="small" @click="entry">入职</el-button>
      <el-button size="small" @click="entry_obsolete">入职失败</el-button>
      <el-button size="small" @click="restrat_pipeline">重启流程</el-button>
    </el-row>
    <!-- //时间线显示备注信息 -->
    <div class="block">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in offerDialogInfo.remarks"
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
        <el-row :gutter="10" v-show="label=='entry'">
          <el-col :span="4">
            <span v-show="label=='entry'">入职时间</span>
          </el-col>
          <el-col :span="16">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker v-model="entry_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="label=='entry'">
          <el-col :span="4">
            <span v-show="label=='entry'">保证期结束</span>
          </el-col>
          <el-col :span="16">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker v-model="guarantee_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">
            <span v-show="label=='offer_follow'">offer跟进</span>
            <span v-show="label=='entry_obsolete'">结束备注</span>
            <span v-show="label=='restrat_pipeline'">原因备注</span>
            <span v-show="label=='entry'">入职备注</span>
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
        <el-row :gutter="10" v-show="label=='offer_follow'||label=='entry'">
          <el-col :span="4">
            <span v-show="label=='offer_follow'">跟进提醒</span>
            <span v-show="label=='entry'">入职提醒</span>
          </el-col>
          <el-col :span="16">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker v-model="remindtime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="label=='offer_follow'">
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
  name: "Offer",
  props: ["candidateId", "candidateInfo", "parHandleClose", "userList"],
  data() {
    return {
      // 入职对话框信息
      guarantee_time: new Date(),
      // 入职时间
      entry_time: new Date(),
      index: 0, //用于保存切换pipelineTabBar，作为事件总结参数
      offerDialogInfo: {},
      //保存选择了哪个按钮
      label: "",
      //状态对应列表
      statusList: {
        offer_follow: "offer跟进",
        entry: "入职",
        entry_obsolete: "入职失败",
        restrat_pipeline: "重启流程",
      },
      //保存备注信息 提醒人 提醒时间
      remarks: "",
      reminder: [],
      remindtime: new Date(),
      newCandidateId: "",
      newCandidateInfo: {},
      dialogVisible: false,
      interviewPlanDialogVisible: false, //面试安排对话框

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

        this.offerDialogInfo = this.newCandidateInfo.pipeline_info.offer;
        console.log(this.offerDialogInfo);
      },
      deep: true,
    },
  },
  methods: {
    saveRemarks() {
      this.dialogVisible = false;
      // 保存所有流程提醒事项;
      this.newCandidateInfo.pipeline_info.reminds.push({
        remindtime: this.remindtime,
        reminder: this.reminder,
      });

      //保存子流程内提醒事项
      console.log(this.label);
      console.log(this.offerDialogInfo);
      this.offerDialogInfo[this.label].reminder.push(this.reminder[0]);
      this.offerDialogInfo[this.label].remarks.push(this.remarks);
      this.offerDialogInfo[this.label].remindtime = this.remindtime;
      //获得添加备注的时候的添加用户
      let remarkTime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      let remarker = window.sessionStorage.getItem("us");
      console.log(remarkTime);
      this.offerDialogInfo.remarks.push({
        remarks: this.remarks,
        remarkTime: remarkTime,
        remarker: remarker,
      });

      //根据状态列表得到状态值
      let statustime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      this.offerDialogInfo.subpipeline = this.statusList[this.label];
      if (this.label == "offer_follow") {
        //切换到offer流程 index=4
        this.index = 4;
      }
      if (this.label == "entry") {
        this.newCandidateInfo.pipeline = "入职";
        this.newCandidateInfo.pipeline_info.subpipeline = "已入职";
        //将入职时间 保证期结束时间添加到入职信息中
        this.offerDialogInfo[this.label].entry_time = this.entry_time;
        this.offerDialogInfo[this.label].guarantee_time = this.guarantee_time;
        //将入职时间 保证期结束时间添加到入职流程入职信息中
        this.newCandidateInfo.pipeline_info.entry.entry = {
          entry_time: this.entry_time,
          guarantee_time: this.guarantee_time,
          remarks: this.remarks,
          remindtime: this.remindtime,
          statustime: statustime,
        };
        // 将入职信息加入到备注信息中
        this.remarks =
          "入职情况:" +
          "<br /> " +
          "入职时间:" +
          timeFormat(this.entry_time, "YYYY-mm-dd HH:MM:SS") +
          "<br /> " +
          "保证期结束时间:" +
          timeFormat(this.guarantee_time, "YYYY-mm-dd HH:MM:SS") +
          "<br /> " +
          "入职提醒:" +
          timeFormat(this.remindtime, "YYYY-mm-dd HH:MM:SS") +
          "<br /> " +
          "入职备注:" +
          this.remarks;

        this.offerDialogInfo.remarks.push({
          remarks: this.remarks,
          remarkTime: remarkTime,
          remarker: remarker,
        });
        // 将首次入职添加到entry流程备注中
        this.newCandidateInfo.pipeline_info.entry.remarks.push({
          remarks: this.remarks,
          remarkTime: remarkTime,
          remarker: remarker,
        });

        //切换到入职流程 index=5
        this.index = 5;
      }
      if (this.label == "entry_obsolete") {
        this.newCandidateInfo.pipeline = "淘汰";
        this.newCandidateInfo.pipeline_info.subpipeline = "未入职";
        // 将备注添加到淘汰流程备注中
        this.newCandidateInfo.pipeline_info.obsolete.remarks.push({
          remarks: this.remarks,
          remarkTime: remarkTime,
          remarker: remarker,
        });

        //切换到淘汰流程 index=7
        this.index = 7;
      }
      if (this.label == "restrat_pipeline") {
        this.newCandidateInfo.pipeline = "callList";
        this.newCandidateInfo.pipeline_info.subpipeline = "重启流程";

        //切换到淘汰流程 index=0
        this.index = 0;
      }

      //更新状态时间

      this.offerDialogInfo.statustime = statustime;
      this.offerDialogInfo[this.label].statustime = statustime;
      //重新将this.offerDialogInfo赋值给newCandidateInfo.pipeline_info

      this.newCandidateInfo.pipeline_info.offer = this.offerDialogInfo;
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

    //时间选择器值改变触发
    cascaderChange(reminder) {
      console.log(reminder[0]);
    },
    //对话框关闭事件
    dialogClose() {
      this.dialogVisible = false;
    },
    //offer跟进
    offer_follow() {
      this.dialogVisible = true;
      this.label = "offer_follow";
    },
    // 入职
    entry() {
      this.dialogVisible = true;
      this.label = "entry";
    },
    // 入职失败
    entry_obsolete() {
      this.dialogVisible = true;
      this.label = "entry_obsolete";
    },
    //  重启流程
    restrat_pipeline() {
      this.dialogVisible = true;
      this.label = "restrat_pipeline";
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.newCandidateInfo = this.candidateInfo;
    console.log(this.newCandidateInfo);
    this.offerDialogInfo = this.newCandidateInfo.pipeline_info.offer;
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