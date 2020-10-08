<!--  -->
<template>
  <div>
    <el-row>
      <el-button size="small" @click="interview_follow">面试跟进</el-button>
      <el-button size="small" @click="interview_plan">面试安排</el-button>
      <el-button size="small" @click="interview_obsolete">面试淘汰</el-button>
      <el-button size="small" @click="offer">offer</el-button>
      <el-button size="small" @click="offer_obsolete">offer淘汰</el-button>
      <el-button size="small" @click="restrat_pipeline">重启流程</el-button>
    </el-row>
    <!-- //时间线显示备注信息 -->
    <div class="block">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in interviewDialogInfo.remarks"
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
    <!-- //面试跟进 面试淘汰 offer淘汰 重启流程对话框 -->
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
            <span v-show="label=='interview_follow'">跟进备注</span>
            <span v-show="label=='interview_obsolete'">结束备注</span>
            <span v-show="label=='offer_obsolete'">结束备注</span>
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
        <el-row :gutter="10" v-show="label=='interview_follow'">
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
        <el-row :gutter="10" v-show="label=='interview_follow'">
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
            <el-input placeholder="请输入内容" v-model="interviewDialogInfo.interview_plan.interviewer"></el-input>
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

    <!-- //offer对话框 -->
    <el-dialog
      :title="'面试安排:'+newCandidateInfo.name"
      :visible.sync="offerDialogVisible"
      width="60%"
      :before-close="offerDialogClose"
      :append-to-body="true"
    >
      <!-- //页面中用到了2个
      <el-dialog></el-dialog>弹框（或者是dialog中再嵌套dialog），会出现2个灰色蒙版层叠加，需要再点一下蒙层才会消失。
      用一个属性解决 :append-to-body="true"-->
      <span>
        <el-row :gutter="10" align="middle">
          <el-col :span="4">推荐职位</el-col>
          <el-col :span="16">
            <span></span>
          </el-col>
        </el-row>
        <el-row :gutter="10" align="middle">
          <el-col :span="4">收费金额</el-col>
          <el-col :span="7">
            <el-input v-model="offerInfo.charge">
              <template slot="append">W</template>
            </el-input>
          </el-col>
        </el-row>

        <el-row :gutter="10" align="middle">
          <el-col :span="4">
            <span>offer时间</span>
          </el-col>
          <el-col :span="16">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker v-model="offerInfo.offer_time" type="datetime" placeholder="选择面试时间"></el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">
            <span>入职时间</span>
          </el-col>
          <el-col :span="16">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker v-model="offerInfo.entry_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="4">
            <span>offer年薪</span>
          </el-col>
          <el-col :span="6">
            <el-input v-model="offerInfo.package">
              <template slot="append">W</template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-input v-model="offerInfo.months">
              <template slot="append">k/个月</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="offerInfo.month_salary">
              <template slot="prepend">*</template>
              <template slot="append">个月</template>
            </el-input>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="4">
            <span>offer备注</span>
          </el-col>
          <el-col :span="16">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="offerInfo.offerRemarks"
            ></el-input>
          </el-col>
        </el-row>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="2">
          <el-col :span="10">
            <el-button type="primary" @click="offerInfoSave">{{statusList[label]}}</el-button>
          </el-col>
          <el-col :span="10">
            <el-button @click="offerDialogVisible = false">取 消</el-button>
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
  name: "Interview",
  props: ["candidateId", "candidateInfo", "parHandleClose", "userList"],
  watch: {
    candidateInfo: {
      //深度监听，可监听到对象、数组的变化
      handler(newV, oldV) {
        // do something, 可使用this
        // console.log(newV, oldV);
        this.newCandidateInfo = newV;

        this.interviewDialogInfo = this.newCandidateInfo.pipeline_info.interview;
        console.log(this.interviewDialogInfo);
      },
      deep: true,
    },
  },
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

      //offer数据临时保存
      offerInfo: {
        //收费
        charge: 0,
        // offer时间
        offer_time: new Date(),
        // 入职时间
        entry_time: new Date(),
        // 年薪
        package: 0,
        // 多少月
        months: 0,
        // 月薪
        month_salary: 0,
        //offer备注
        offerRemarks: "",
      },

      index: 0, //用于保存切换pipelineTabBar，作为事件总结参数
      interviewDialogInfo: {},
      //保存选择了哪个按钮
      label: "",
      //状态对应列表
      statusList: {
        interview_follow: "面试跟进",
        interview_plan: "面试安排",
        interview_obsolete: "面试淘汰",
        offer: "offer",
        offer_obsolete: "offer淘汰",
        restrat_pipeline: "重启流程",
      },
      //保存备注信息 提醒人 提醒时间
      remarks: "",
      reminder: [],
      remindtime: new Date(),
      newCandidateId: "",
      newCandidateInfo: {},
      //dialogVisible面试跟进 面试淘汰 offer淘汰 重启流程对话框控制
      dialogVisible: false,
      interviewPlanDialogVisible: false, //面试安排对话框
      offerDialogVisible: false, //offer对话框

      options: [],
    };
  },
  methods: {
    //时间选择器值改变触发
    cascaderChange(reminder) {
      console.log(reminder[0]);
    },
    // offer对话框关闭

    offerDialogClose() {
      this.offerDialogVisible = false;
    },
    // 面试跟进 面试淘汰 offer淘汰 重启流程对话框关闭
    dialogClose() {
      this.dialogVisible = false;
    },
    //面试跟进按钮
    interview_follow() {
      this.dialogVisible = true;
      this.label = "interview_follow";
    },
    //面试安排按钮
    interview_plan() {
      this.interviewPlanDialogVisible = true;
      this.label = "interview_plan";
    },
    //面试淘汰按钮
    interview_obsolete() {
      this.dialogVisible = true;
      this.label = "interview_obsolete";
    },
    //offer按钮
    offer() {
      this.offerDialogVisible = true;
      this.label = "offer";
    },
    //offer淘汰按钮
    offer_obsolete() {
      this.dialogVisible = true;
      this.label = "offer_obsolete";
    },
    //重启流程按钮
    restrat_pipeline() {
      this.dialogVisible = true;
      this.label = "restrat_pipeline";
    },
    //offer信息提交按钮
    offerInfoSave() {
      this.offerDialogVisible = false;
      //更新状态时间
      let statustime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      this.interviewDialogInfo.statustime = statustime;
      // this.interviewDialogInfo[this.label].statustime = statustime;

      // console.log(this.label);
      // console.log(this.interviewDialogInfo);
      let offerInfo = {
        //收费
        charge: this.offerInfo.charge,
        // offer时间
        offer_time: this.offerInfo.offer_time,
        // 入职时间
        entry_time: this.offerInfo.entry_time,
        // 年薪
        package: this.offerInfo.package,
        // 多少月
        months: this.offerInfo.months,
        // 月薪
        month_salary: this.offerInfo.month_salary,
        remarks: this.offerInfo.offerRemarks,
        statustime: statustime,
      };
      this.interviewDialogInfo[this.label].push(offerInfo);
      // 将首次offerInfo添加到offer流程中
      this.newCandidateInfo.pipeline_info.offer[this.label].push(offerInfo);
      //获得添加备注的时候的添加用户
      let remarkTime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      let remarker = window.sessionStorage.getItem("us");
      console.log(remarkTime);
      // 将offer信息加入到备注信息中
      this.remarks =
        this.offerInfo.offerRemarks +
        "<br />" +
        "offer情况:" +
        "<br /> " +
        "收费:" +
        this.offerInfo.charge +
        "W" +
        "<br /> " +
        "offer时间:" +
        timeFormat(this.offerInfo.offer_time, "YYYY-mm-dd HH:MM:SS") +
        "<br /> " +
        "入职时间:" +
        timeFormat(this.offerInfo.entry_time, "YYYY-mm-dd HH:MM:SS") +
        "<br /> " +
        "薪酬:" +
        this.offerInfo.package +
        "( " +
        this.offerInfo.months +
        "个月" +
        "*" +
        this.offerInfo.month_salary +
        "k/月" +
        ")";

      this.interviewDialogInfo.remarks.push({
        remarks: this.remarks,
        remarkTime: remarkTime,
        remarker: remarker,
      });
      // 将首次offer添加到offer流程备注中
      this.newCandidateInfo.pipeline_info.offer.remarks.push({
        remarks: this.remarks,
        remarkTime: remarkTime,
        remarker: remarker,
      });

      //根据状态列表得到状态值
      this.interviewDialogInfo.subpipeline = this.statusList[this.label];
      //如果点击的是通过按钮，则将this.newCandidateInfo.pipeline更新为推荐，如果点击的是打回按钮，则将
      //this.newCandidateInfo.pipeline更新为callList

      if (this.label == "offer") {
        this.newCandidateInfo.pipeline = "offer";
        // this.newCandidateInfo.pipeline_info.subpipeline = "面试中";
        this.newCandidateInfo.pipeline_info.subpipeline =
          "offer" +
          "(" +
          this.interviewDialogInfo.offer[
            this.interviewDialogInfo.offer.length - 1
          ].package +
          "W)";
        //切换到offer流程 index=4
        this.index = 4;
      }

      console.log(this.newCandidateInfo.pipeline);

      //重新将this.interviewDialogInfo赋值给newCandidateInfo.pipeline_info

      this.newCandidateInfo.pipeline_info.interview = this.interviewDialogInfo;

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
      this.interviewDialogInfo.statustime = statustime;
      // this.interviewDialogInfo[this.label].statustime = statustime;

      console.log(this.label);
      console.log(this.interviewDialogInfo);
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
      this.interviewDialogInfo[this.label].push(interviewPlanInfo);
      // // 将首次面试安排添加到面试流程中
      // this.newCandidateInfo.pipeline_info.interview[this.label].push(
      //   interviewPlanInfo
      // );
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
      this.interviewDialogInfo.remarks.push({
        remarks: this.remarks,
        remarkTime: remarkTime,
        remarker: remarker,
      });
      // 将首次面试安排添加到面试流程备注中
      // this.newCandidateInfo.pipeline_info.interview.remarks.push({
      //   remarks: this.remarks,
      //   remarkTime: remarkTime,
      //   remarker: remarker,
      // });

      //根据状态列表得到状态值
      this.interviewDialogInfo.subpipeline = this.statusList[this.label];
      //如果点击的是通过按钮，则将this.newCandidateInfo.pipeline更新为推荐，如果点击的是打回按钮，则将
      //this.newCandidateInfo.pipeline更新为callList

      if (this.label == "interview_plan") {
        this.newCandidateInfo.pipeline = "面试";
        // this.newCandidateInfo.pipeline_info.subpipeline = "面试中";
        this.newCandidateInfo.pipeline_info.subpipeline =
          "面试中" +
          "(" +
          this.interviewDialogInfo.interview_plan[
            this.interviewDialogInfo.interview_plan.length - 1
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

      //重新将this.interviewDialogInfo赋值给newCandidateInfo.pipeline_info

      this.newCandidateInfo.pipeline_info.interview = this.interviewDialogInfo;
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
    //面试安排对话框关闭事件
    interviewPlanDialogClose() {
      this.interviewPlanDialogVisible = false;
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
      console.log(this.interviewDialogInfo);
      this.interviewDialogInfo[this.label].reminder.push(this.reminder[0]);
      this.interviewDialogInfo[this.label].remarks.push(this.remarks);
      this.interviewDialogInfo[this.label].remindtime = this.remindtime;
      //获得添加备注的时候的添加用户
      let remarkTime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      let remarker = window.sessionStorage.getItem("us");
      console.log(remarkTime);
      this.interviewDialogInfo.remarks.push({
        remarks: this.remarks,
        remarkTime: remarkTime,
        remarker: remarker,
      });

      //根据状态列表得到状态值
      this.interviewDialogInfo.subpipeline = this.statusList[this.label];

      if (this.label == "interview_plan") {
        this.newCandidateInfo.pipeline = "面试";
        this.newCandidateInfo.pipeline_info.subpipeline =
          "面试中" +
          this.interviewDialogInfo.interview_plan[
            this.interviewDialogInfo.interview_plan.length - 1
          ].sequence +
          "面";
        //切换到面试流程 index=3
        this.index = 3;
      }
      if (this.label == "interview_obsolete") {
        this.newCandidateInfo.pipeline = "淘汰";
        this.newCandidateInfo.pipeline_info.subpipeline = "面试淘汰";
        // 将备注添加到淘汰流程备注中
        this.newCandidateInfo.pipeline_info.obsolete.remarks.push({
          remarks: this.remarks,
          remarkTime: remarkTime,
          remarker: remarker,
        });

        //切换到淘汰流程 index=7
        this.index = 7;
      }
      if (this.label == "offer_obsolete") {
        this.newCandidateInfo.pipeline = "淘汰";
        this.newCandidateInfo.pipeline_info.subpipeline = "offer淘汰";
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

        //切换到callList流程 index=0
        this.index = 0;
      }

      //更新状态时间
      let statustime = timeFormat(new Date(), "YYYY-mm-dd HH:MM:SS");
      this.interviewDialogInfo.statustime = statustime;
      this.interviewDialogInfo[this.label].statustime = statustime;
      //重新将this.interviewDialogInfo赋值给newCandidateInfo.pipeline_info

      this.newCandidateInfo.pipeline_info.interview = this.interviewDialogInfo;
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
  },

  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.newCandidateInfo = this.candidateInfo;
    console.log(this.newCandidateInfo);
    this.interviewDialogInfo = this.newCandidateInfo.pipeline_info.interview;
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