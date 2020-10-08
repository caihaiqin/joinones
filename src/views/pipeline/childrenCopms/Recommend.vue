<!--  -->
<template>
  <div>
    <el-row>
      <el-button size="small" @click="recommend_follow">推荐跟进</el-button>
      <el-button size="small" @click="interview_plan">面试安排</el-button>
      <el-button size="small" @click="recommend_obsolete">推荐淘汰</el-button>
      <el-button size="small" @click="restrat_pipeline">重启流程</el-button>
    </el-row>
    <!-- //时间线显示备注信息 -->
    <div class="block">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in recommendDialogInfo.remarks"
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
            <span v-show="label=='recommend_follow'">跟进备注</span>
            <span v-show="label=='recommend_obsolete'">结束备注</span>
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
        <el-row :gutter="10" v-show="label=='recommend_follow'">
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
        <el-row :gutter="10" v-show="label=='recommend_follow'">
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
    <!-- //面试安排对话框 -->
    <el-dialog
      :title="'面试安排:'+newCandidateInfo.name"
      :visible.sync="interviewPlanDialogVisible"
      width="60%"
      :before-close="interviewPlanDialogClose"
      :append-to-body="true"
    >
      <!-- //页面中用到了2个
      <el-dialog></el-dialog>弹框（或者是dialog中再嵌套dialog），会出现2个灰色蒙版层叠加，需要再点一下蒙层才会消失。
      用一个属性解决 :append-to-body="true"-->
      <span>
        <el-row :gutter="10">
          <el-col :span="4">
            <span>面试轮次</span>
          </el-col>
          <el-col :span="16">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in interviewPlanSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="4">
            <span>面试时间</span>
          </el-col>
          <el-col :span="16">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker v-model="interviewtime" type="datetime" placeholder="选择面试时间"></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">
            <span>面试提醒时间</span>
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
        <el-row :gutter="10">
          <el-col :span="4">
            <span>面试地点</span>
          </el-col>
          <el-col :span="16">
            <el-input placeholder="请输入内容" v-model="location"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">
            <span>面试官</span>
          </el-col>
          <el-col :span="16">
            <el-input placeholder="请输入内容" v-model="recommendDialogInfo.interview_plan.interviewer"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">
            <span>面试备注</span>
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
            <el-button type="primary" @click="interviewPlan">{{statusList[label]}}</el-button>
          </el-col>
          <el-col :span="10">
            <el-button @click="interviewPlanDialogVisible = false">取 消</el-button>
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
  name: "Recommend",
  props: ["candidateId", "candidateInfo", "parHandleClose", "userList"],
  data() {
    return {
      // 面试轮次选项数据,保存到sequence
      value: "",
      interviewPlanSelect: [
        {
          value: "1",
          label: "1面",
        },
        {
          value: "2",
          label: "2面",
        },
        {
          value: "3",
          label: "3面",
        },
        {
          value: "4",
          label: "4面",
        },
        {
          value: "5",
          label: "5面",
        },
        {
          value: "6",
          label: "6面",
        },
        {
          value: "7",
          label: "7面",
        },
      ],
      //面试时间
      interviewtime: new Date(),
      //面试地点
      location: "",
      //面试官
      interviewer: "",

      index: 0, //用于保存切换pipelineTabBar，作为事件总结参数
      recommendDialogInfo: {},
      //保存选择了哪个按钮
      label: "",
      //状态对应列表
      statusList: {
        recommend_follow: "推荐跟进",
        interview_plan: "面试安排",
        recommend_obsolete: "推荐淘汰",
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

        this.recommendDialogInfo = this.newCandidateInfo.pipeline_info.recommend;
        console.log(this.recommendDialogInfo);
      },
      deep: true,
    },
  },
  methods: {
    //时间选择器值改变触发
    cascaderChange(reminder) {
      console.log(reminder[0]);
    },
    //提交面试安排按钮
    interviewPlan() {
      this.interviewPlanDialogVisible = false;
      // 保存所有流程提醒事项;
      this.newCandidateInfo.pipeline_info.reminds.push({
        remindtime: this.remindtime,
        reminder: this.reminder,
      });
      //更新状态时间
      let statustime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      this.recommendDialogInfo.statustime = statustime;
      // this.recommendDialogInfo[this.label].statustime = statustime;

      console.log(this.label);
      console.log(this.recommendDialogInfo);
      let interviewPlanInfo = {
        sequence: this.value,
        interviewtime: this.interviewtime,
        remindtime: this.remindtime,
        location: this.location,
        interviewer: this.interviewer,
        remarks: this.remarks,
        statustime: statustime,
        reminder: this.reminder,
      };
      this.recommendDialogInfo[this.label].push(interviewPlanInfo);
      // 将首次面试安排添加到面试流程中
      this.newCandidateInfo.pipeline_info.interview[this.label].push(
        interviewPlanInfo
      );
      //获得添加备注的时候的添加用户
      let remarkTime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      let remarker = window.sessionStorage.getItem("us");
      console.log(remarkTime);
      // 将面试信息加入到备注信息中
      this.remarks =
        this.remarks +
        "<br />" +
        "面试安排:" +
        "<br /> " +
        "面试轮次:" +
        this.value +
        "面" +
        "<br /> " +
        "面试时间:" +
        timeFormat(this.interviewtime, "YYYY-mm-dd HH:MM:SS") +
        "<br /> " +
        "面试地点:" +
        this.location +
        "<br /> " +
        "面试官:" +
        this.interviewer +
        "<br /> " +
        "面试提醒:" +
        timeFormat(this.remindtime, "YYYY-mm-dd HH:MM:SS");
      this.recommendDialogInfo.remarks.push({
        remarks: this.remarks,
        remarkTime: remarkTime,
        remarker: remarker,
      });
      // 将首次面试安排添加到面试流程备注中
      this.newCandidateInfo.pipeline_info.interview.remarks.push({
        remarks: this.remarks,
        remarkTime: remarkTime,
        remarker: remarker,
      });

      //根据状态列表得到状态值
      this.recommendDialogInfo.subpipeline = this.statusList[this.label];
      //如果点击的是通过按钮，则将this.newCandidateInfo.pipeline更新为推荐，如果点击的是打回按钮，则将
      //this.newCandidateInfo.pipeline更新为callList

      if (this.label == "interview_plan") {
        this.newCandidateInfo.pipeline = "面试";
        // this.newCandidateInfo.pipeline_info.subpipeline = "面试中";
        this.newCandidateInfo.pipeline_info.subpipeline =
          "面试中" +
          "(" +
          this.recommendDialogInfo.interview_plan[
            this.recommendDialogInfo.interview_plan.length - 1
          ].sequence +
          "面)";
        //切换到面试流程 index=3
        this.index = 3;
      }
      // if (this.label == "recommend_obsolete") {
      //   this.newCandidateInfo.pipeline = "淘汰";
      //   this.newCandidateInfo.pipeline_info.subpipeline = "推荐淘汰";

      //   //切换到淘汰流程 index=7
      //   this.index = 7;
      // }
      // if (this.label == "restrat_pipeline") {
      //   this.newCandidateInfo.pipeline = "callList";
      //   this.newCandidateInfo.pipeline_info.subpipeline = "重启流程";

      //   //切换到callList流程 index=0
      //   this.index = 0;
      // }
      console.log(this.newCandidateInfo.pipeline);

      //重新将this.recommendDialogInfo赋值给newCandidateInfo.pipeline_info

      this.newCandidateInfo.pipeline_info.recommend = this.recommendDialogInfo;
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
    //点击保存备注按钮
    saveRemarks() {
      this.dialogVisible = false;
      // 保存所有流程提醒事项;
      this.newCandidateInfo.pipeline_info.reminds.push({
        remindtime: this.remindtime,
        reminder: this.reminder,
      });

      //保存子流程内提醒事项
      console.log(this.label);
      console.log(this.recommendDialogInfo);
      this.recommendDialogInfo[this.label].reminder.push(this.reminder[0]);
      this.recommendDialogInfo[this.label].remarks.push(this.remarks);
      this.recommendDialogInfo[this.label].remindtime = this.remindtime;
      //获得添加备注的时候的添加用户
      let remarkTime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      let remarker = window.sessionStorage.getItem("us");
      console.log(remarkTime);
      this.recommendDialogInfo.remarks.push({
        remarks: this.remarks,
        remarkTime: remarkTime,
        remarker: remarker,
      });

      //根据状态列表得到状态值
      this.recommendDialogInfo.subpipeline = this.statusList[this.label];

      if (this.label == "interview_plan") {
        this.newCandidateInfo.pipeline = "面试";
        this.newCandidateInfo.pipeline_info.subpipeline = "面试中";
        //切换到面试流程 index=3
        this.index = 3;
      }
      if (this.label == "recommend_obsolete") {
        this.newCandidateInfo.pipeline = "淘汰";
        this.newCandidateInfo.pipeline_info.subpipeline = "推荐淘汰";
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

        //切换到淘汰流程 index=7
        this.index = 7;
      }

      //更新状态时间
      let statustime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      this.recommendDialogInfo.statustime = statustime;
      this.recommendDialogInfo[this.label].statustime = statustime;
      //重新将this.recommendDialogInfo赋值给newCandidateInfo.pipeline_info

      this.newCandidateInfo.pipeline_info.recommend = this.recommendDialogInfo;
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
    //面试安排对话框关闭事件
    interviewPlanDialogClose() {
      this.interviewPlanDialogVisible = false;
    },
    recommend_follow() {
      this.dialogVisible = true;
      this.label = "recommend_follow";
    },
    interview_plan() {
      this.interviewPlanDialogVisible = true;
      this.label = "interview_plan";
    },
    recommend_obsolete() {
      this.dialogVisible = true;
      this.label = "recommend_obsolete";
    },
    restrat_pipeline() {
      this.dialogVisible = true;
      this.label = "restrat_pipeline";
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.newCandidateInfo = this.candidateInfo;
    console.log(this.newCandidateInfo);
    this.recommendDialogInfo = this.newCandidateInfo.pipeline_info.recommend;
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