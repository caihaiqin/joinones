<!--  -->
<template>
  <div class="candidate_container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人才</el-breadcrumb-item>
      <el-breadcrumb-item>所有人才</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 显示列表卡片 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.keyword"
            class="input-with-select"
            @clear="clear"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchByKeyword"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addCandidate">添加候选人</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">候选人查重</el-button>
        </el-col>
      </el-row>

      <el-table :data="candidates" border stripe row-key="id">
        //索引列 type=index
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="姓名" width="140"></el-table-column>
        <!-- <el-table-column prop="sex" label="性别" width="60"></el-table-column> -->
        <el-table-column prop="age" label="年龄" width="60"></el-table-column>
        <el-table-column prop="phonenum" label="电话" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="work_seniority" label="工作年限" width="80"></el-table-column>
        <el-table-column prop="area" label="所在地区" width="80"></el-table-column>
        <el-table-column prop="position" label="当前职位" width="80"></el-table-column>
        <el-table-column prop="company" label="目前公司" width="80"></el-table-column>
        <el-table-column prop="counselor" label="所属顾问" width="80"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <!-- //修改按钮 -->
            <!-- <el-tooltip effect="dark" content="修改" placement="top" :enterable="false"> -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="UpdateCandidateClick(scope.row.id)"
            ></el-button>
            <!-- </el-tooltip> -->

            <!-- //删除按钮 -->
            <!-- <el-tooltip effect="dark" content="删除" placement="top" :enterable="false"> -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeCandidateClick(scope.row.id)"
            ></el-button>
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- //查重候选人对话框 -->
    <el-dialog title="候选人查重" :visible.sync="dialogVisible" width="50%" @close="checkCandidateClose">
      <!-- //对话框主体 -->
      <span>
        <el-form
          :model="checkCandidateInfo"
          :rules="checkCandidateInfoRules"
          ref="checkFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="checkCandidateInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phonenum">
            <el-input v-model="checkCandidateInfo.phonenum"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="checkCandidateInfo.email"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="checkCandidateClick">查询</el-button>
      </span>
    </el-dialog>
    <!-- 修改候选人信息对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="updatedialogVisible"
      width="80%"
      :before-close="updatedialogClose"
    >
      <span>
        <update-candidate
          :candidateId="candidateId"
          :updatedialogClose="updatedialogClose"
          v-if="childData"
        ></update-candidate>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import {
  getCandidateByPage,
  getCandidateAll,
  getCandidateByKeyword,
  checkCandidate,
  removeCandidateById,
} from "network/candidate/getCandidate.js";
import UpdateCandidate from "./childrenComps/UpdateCandidate";
export default {
  // 注入刷新页面依赖
  inject: ["reload"],
  name: "Candidate",
  components: { UpdateCandidate },
  methods: {
    // 删除候选人按钮
    removeCandidateClick(id) {
      this.$confirm("此操作将永久删除该候选人信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (id != "") {
            removeCandidateById(id);
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.reload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 修改候选人对话框关闭
    updatedialogClose() {
      this.updatedialogVisible = false;
      this.childData = false;

      setTimeout(() => {
        this.childData = true;
      }, 0);
    },
    // 修改候选人按钮
    UpdateCandidateClick(id) {
      console.log(id);
      this.updatedialogVisible = true;
      this.candidateId = id;
    },
    // 关闭查重对话框
    checkCandidateClose() {
      this.$refs.checkFormRef.resetFields();
    },
    // 候选人查重函数
    checkCandidateClick() {
      if (
        this.checkCandidateInfo.name == "" ||
        this.checkCandidateInfo.phonenum == "" ||
        this.checkCandidateInfo.email == ""
      ) {
        this.$message("请输入姓名、手机、邮箱");
      } else {
        checkCandidate(this.checkCandidateInfo)
          .then((res) => {
            this.$message(res.msg);
          })
          .catch((err) => {
            this.$message(err.msg);
          });
      }
    },
    //点击添加候选人跳转到添加候选人页面
    addCandidate() {
      this.$router.push("/addcandidate");
    },
    // 清空搜索框内容
    clear() {
      getCandidateByPage(this.queryInfo.pageSize, this.queryInfo.page).then(
        (res) => {
          console.log(res);
          this.candidates = res.data;
          this.total = this.iniTotal;
        }
      );
    },
    // 按关键字搜索候选人
    searchByKeyword() {
      getCandidateByKeyword(this.queryInfo.keyword).then((res) => {
        this.$message.success(res.msg);
        this.candidates = res.data;
        this.total = res.total;
      });
    },
    // 监听pageSize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      console.log(newSize);
      getCandidateByPage(this.queryInfo.pageSize, this.queryInfo.page)
        .then((res) => {
          if (res.err == 0) {
            this.candidates = res.data;

            this.$message.success(res.msg);
          }
        })
        .catch((err) => {
          this.$message.err(err.msg);
        });
    },
    // 监听当前页面改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      console.log(newPage);
      getCandidateByPage(this.queryInfo.pageSize, this.queryInfo.page).then(
        (res) => {
          console.log(res);
          this.candidates = res.data;
        }
      );
    },
  },
  data() {
    //验证邮箱规则
    let checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    //验证邮箱规则
    let checkPhonenum = (rule, value, cb) => {
      const regPhone = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (regPhone.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    return {
      childData: true,
      // 传递修改候选人ID
      candidateId: "",
      //控制修改候选人对话框显示
      updatedialogVisible: false,
      //控制查重对话框显示
      dialogVisible: false,
      candidates: [],
      queryInfo: {
        keyword: "",
        pageSize: 10,
        page: 1,
      },
      checkCandidateInfo: {
        name: "",
        email: "",
        phonenum: "",
      },
      checkCandidateInfoRules: {
        //验证姓名
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        //验证手机
        phonenum: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: checkPhonenum,
            message: "请输入正确手机号码",
            trigger: "blur",
          },
        ],
        //验证邮箱
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            message: "请输入正确邮箱",
            trigger: "blur",
          },
        ],
      },
      total: 0,
      iniTotal: 0,
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    // 获取所有候选人数据
    getCandidateAll().then((res) => {
      this.candidates = res.data;

      this.iniTotal = res.total;
      this.total = res.total;
    });
    getCandidateByPage(this.queryInfo.pageSize, this.queryInfo.page).then(
      (res) => {
        this.candidates = res.data;
      }
    );
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/
.candidate_container {
  padding: 20px;
}
.el-breadcrumb {
  margin-bottom: 20px;
}
.box-card {
  width: 100%;
}
.el-table {
  margin-top: 15px;
}
</style>