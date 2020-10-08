<!--  -->
<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="candidateList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="selection" width="55"></el-table-column>//索引列 type=index
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名" width="60"></el-table-column>
      <el-table-column prop="sex" label="性别" width="60"></el-table-column>
      <el-table-column prop="age" label="年龄" width="60"></el-table-column>
      <el-table-column prop="phonenum" label="电话" width="140"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="target_position" label="推荐职位" width="70"></el-table-column>
      <el-table-column prop="target_customs" label="推荐客户" width="70"></el-table-column>
      <el-table-column label="pipeline" width="80">
        <template slot-scope="scope">
          <i
            :class="iconList[scope.row.pipeline].className"
            @click="pipelineClick(iconList[scope.row.pipeline].key,iconList[scope.row.pipeline].index,scope.row.id)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <div
            :class="pipelineClass[scope.row.pipeline_info.subpipeline]"
            class="pipelineStatus"
          >{{scope.row.pipeline_info.subpipeline}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="work_seniority" label="工作年限" width="80"></el-table-column>
      <el-table-column prop="area" label="所在地区" width="80"></el-table-column>
      <el-table-column prop="position" label="当前职位" width="80"></el-table-column>
      <el-table-column prop="company" label="目前公司" width="80"></el-table-column>
      <el-table-column prop="counselor" label="所属顾问" width="80"></el-table-column>
    </el-table>
    <el-dialog
      :title="currentPipeline"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <span>
        <pipeline-bar :active="pipelineIndex" />
        <call-list
          v-show="currentPipeline=='callList'"
          :candidateId="candidateId"
          :candidateInfo="candidateInfo"
          :userList="userList"
          :parHandleClose="handleClose"
        />
        <audit
          v-show="currentPipeline=='audit'"
          :candidateId="candidateId"
          :candidateInfo="candidateInfo"
          :userList="userList"
          :parHandleClose="handleClose"
        />
        <recommend
          v-show="currentPipeline=='recommend'"
          :candidateId="candidateId"
          :candidateInfo="candidateInfo"
          :userList="userList"
          :parHandleClose="handleClose"
        />
        <interview
          v-show="currentPipeline=='interview'"
          :candidateId="candidateId"
          :candidateInfo="candidateInfo"
          :userList="userList"
          :parHandleClose="handleClose"
        />
        <offer
          v-show="currentPipeline=='offer'"
          :candidateId="candidateId"
          :candidateInfo="candidateInfo"
          :userList="userList"
          :parHandleClose="handleClose"
        />
        <entry
          v-show="currentPipeline=='entry'"
          :candidateId="candidateId"
          :candidateInfo="candidateInfo"
          :userList="userList"
          :parHandleClose="handleClose"
        />
        <over-insured
          v-show="currentPipeline=='over_insured'"
          :candidateId="candidateId"
          :candidateInfo="candidateInfo"
          :userList="userList"
          :parHandleClose="handleClose"
        />
        <obsolete
          v-show="currentPipeline=='obsolete'"
          :candidateId="candidateId"
          :candidateInfo="candidateInfo"
          :userList="userList"
          :parHandleClose="handleClose"
        />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CallList from "./CallList";
import Audit from "./Audit";
import Recommend from "./Recommend";
import Interview from "./Interview";
import Offer from "./Offer";
import Entry from "./Entry";
import OverInsured from "./OverInsured";
import Obsolete from "./Obsolete";
import PipelineBar from "./PipelineBar";

import { getCandidateById } from "network/candidate/getCandidate";
import { getAllUser } from "network/user/user";

export default {
  name: "PipelineCandidateList",
  props: ["candidateData"],
  components: {
    CallList,
    Audit,
    Recommend,
    PipelineBar,
    Interview,
    Offer,
    Entry,
    OverInsured,
    Obsolete,
  },

  data() {
    return {
      userList: [], //保存所有用户列表
      pipelineIndex: 1, //被点击流程序号
      candidateId: "", //被点击流程的候选人Id
      candidateInfo: {}, //被点击流程的候选人信息
      dialogVisible: false, //控制流程对话框显示
      currentPipeline: "", //得到当前点击的流程名称
      candidateList: [], //候选人列表
      multipleSelection: [], //保存多选选择项
      pipelineClass: {
        待沟通: "toCommunicate",
        人才拒绝: "candidateRefuse",
        客户拒绝: "customerRefuse",
        顾问拒绝: "counselorRefuse",
        已推荐: "recommended",
        打回: "repulse",
      },
      iconList: {
        callList: {
          className: "iconfont icon-liebiaoqingdan",
          key: "callList",
          index: 1,
        },
        审核: { className: "iconfont icon-shenhe", key: "audit", index: 2 },
        推荐: {
          className: "iconfont icon-tuijianshangjia",
          key: "recommend",
          index: 3,
        },
        面试: {
          className: "iconfont icon-gongzuomianshi",
          key: "interview",
          index: 4,
        },
        offer: { className: "iconfont icon-offer", key: "offer", index: 5 },
        入职: {
          className: "iconfont icon-yuangongruzhi",
          key: "entry",
          index: 6,
        },
        过保: {
          className: "iconfont icon-yanjizhushou-shangchuan_shifouguobao",
          key: "over_insured",
          index: 7,
        },
        淘汰: {
          className: "iconfont icon-taotaiku",
          key: "obsolete",
          index: 8,
        },
      },
    };
  },
  //监听candidateData数据变化，重新赋值
  watch: {
    candidateData: {
      //深度监听，可监听到对象、数组的变化
      handler(newV, oldV) {
        // do something, 可使用this
        console.log(newV, oldV);
        this.candidateList = newV;
      },
      deep: true,
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    pipelineClick(key, index, id) {
      getCandidateById(id).then((res) => {
        this.candidateInfo = res.data[0];
        this.currentPipeline = key;
        this.pipelineIndex = index;
        this.candidateId = id;
        this.dialogVisible = true;
      });
    },
    handleClose() {
      this.currentPipeline = "";
      this.dialogVisible = false;
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    getAllUser()
      .then((res) => {
        if (res.err == 0) {
          this.userList = res.data;
          console.log(this.userList);
        } else {
          this.$message(res.msg);
        }
      })
      .catch((err) => {
        this.$message(err);
      });
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/
.el-table {
  font-size: 12px;
}
.iconfont {
  cursor: pointer;
}
.iconfont:hover {
  color: #5fa0ff;
}

.pipelineStatus {
  text-align: center;
  background-color: #00ba52;
}
/* //用于动态绑定Pipeline状态样式 */
.toCommunicate {
  background-color: #00ba52;
}
.candidateRefuse {
  background-color: #ff7900;
}
.counselorRefuse {
  background-color: #00bdff;
}
.customerRefuse {
  background-color: #767485;
  color: white;
}
.recommended {
  background-color: #ccccff;
}
.repulse {
  background-color: tomato;
  color: white;
}
</style>