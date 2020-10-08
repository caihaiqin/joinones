<!--  -->
<template>
  <div>
    <el-row>
      <el-button size="small" @click="entry_follow">入职跟进</el-button>
      <el-button size="small" @click="over_insured">过保</el-button>
      <el-button size="small" @click="resign">离职</el-button>
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
        <el-row :gutter="10" v-show="label!='over_insured'">
          <el-col :span="4">
            <span v-show="label=='entry_follow'">跟进备注</span>
            <span v-show="label=='resign'">结束备注</span>
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
        <el-row :gutter="10" v-show="label=='over_insured'">
          <el-col :span="4">
            <span v-show="label=='over_insured'">过保时间</span>
          </el-col>
          <el-col :span="16">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker v-model="guarantee_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="label=='entry_follow'">
          <el-col :span="4">
            <span v-show="label=='entry_follow'">跟进提醒</span>
          </el-col>
          <el-col :span="16">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker v-model="remindtime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="label=='entry_follow'">
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
  name: "Entry",
  props: ["candidateId", "candidateInfo", "parHandleClose", "userList"],

  data() {
    return {
      // 过保时间
      guarantee_time: "",
      index: 0, //用于保存切换pipelineTabBar，作为事件总结参数
      entryDialogInfo: {},
      //保存选择了哪个按钮
      label: "",
      //状态对应列表
      statusList: {
        entry_follow: "入职跟进",
        over_insured: "过保",
        resign: "离职",
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

        this.entryDialogInfo = this.newCandidateInfo.pipeline_info.entry;
        console.log(this.entryDialogInfo);
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
      console.log(this.entryDialogInfo);
      this.entryDialogInfo[this.label].reminder.push(this.reminder[0]);
      this.entryDialogInfo[this.label].remarks.push(this.remarks);
      this.entryDialogInfo[this.label].remindtime = this.remindtime;
      //获得添加备注的时候的添加用户
      let remarkTime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      let remarker = window.sessionStorage.getItem("us");
      console.log(remarkTime);
      this.entryDialogInfo.remarks.push({
        remarks: this.remarks,
        remarkTime: remarkTime,
        remarker: remarker,
      });

      //根据状态列表得到状态值
      let statustime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      this.entryDialogInfo.subpipeline = this.statusList[this.label];
      if (this.label == "entry_follow") {
        //切换到入职流程 index=5
        this.index = 5;
      }
      if (this.label == "over_insured") {
        this.newCandidateInfo.pipeline = "过保";
        this.newCandidateInfo.pipeline_info.subpipeline = "已过保";
        //将保证期结束时间添加到过保信息中
        this.entryDialogInfo[this.label].guarantee_time = this.guarantee_time;
        //将保证期结束时间添加到过保流程过保信息中
        this.newCandidateInfo.pipeline_info.over_insured.over_insured = {
          guarantee_time: this.guarantee_time,
          remarks: this.remarks,
          remindtime: this.remindtime,
          statustime: statustime,
        };
        // 将过保信息加入到备注信息中
        this.remarks =
          "过保情况:" +
          "<br /> " +
          "过保时间:" +
          timeFormat(this.guarantee_time, "YYYY-mm-dd HH:MM:SS") +
          "<br /> " +
          this.remarks;

        this.entryDialogInfo.remarks.push({
          remarks: this.remarks,
          remarkTime: remarkTime,
          remarker: remarker,
        });
        // 将首次过保添加到过保流程备注中
        this.newCandidateInfo.pipeline_info.over_insured.remarks.push({
          remarks: this.remarks,
          remarkTime: remarkTime,
          remarker: remarker,
        });

        //切换到过保流程 index=6
        this.index = 6;
      }
      if (this.label == "resign") {
        this.newCandidateInfo.pipeline = "淘汰";
        this.newCandidateInfo.pipeline_info.subpipeline = "未过保";
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

      this.entryDialogInfo.statustime = statustime;
      this.entryDialogInfo[this.label].statustime = statustime;
      //重新将this.entryDialogInfo赋值给newCandidateInfo.pipeline_info

      this.newCandidateInfo.pipeline_info.entry = this.entryDialogInfo;
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
    //入职跟进按钮
    entry_follow() {
      this.dialogVisible = true;
      this.label = "entry_follow";
    },
    // 过保按钮
    over_insured() {
      this.dialogVisible = true;
      this.label = "over_insured";
    },
    // 离职按钮
    resign() {
      this.dialogVisible = true;
      this.label = "resign";
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
    this.entryDialogInfo = this.newCandidateInfo.pipeline_info.entry;
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