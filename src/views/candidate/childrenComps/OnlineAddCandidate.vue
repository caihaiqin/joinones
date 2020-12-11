<!--  -->
<template>
  <div>
    <el-form ref="loginFormRef" :model="addCandidateForm" :rules="addCandidateFormRules">
      <el-row :gutter="20">
        <el-form-item class="el-form-item" prop="name">
          <el-col :span="4">
            <span>姓名</span>
          </el-col>
          <el-col :span="18">
            <el-input v-model="addCandidateForm.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>性别</span>
          </el-col>
          <el-col :span="4">
            <el-select v-model="addCandidateForm.sex" placeholder="请选择">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item" prop="phonenum">
          <el-col :span="4">
            <span>手机</span>
          </el-col>
          <el-col :span="18">
            <el-input v-model="addCandidateForm.phonenum"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item" prop="email">
          <el-col :span="4">
            <span>邮箱</span>
          </el-col>
          <el-col :span="18">
            <el-input v-model="addCandidateForm.email"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>学历</span>
          </el-col>
          <el-col :span="6">
            <el-select v-model="addCandidateForm.education" placeholder="请选择">
              <el-option label="博士" value="博士"></el-option>
              <el-option label="硕士" value="硕士"></el-option>
              <el-option label="本科" value="本科"></el-option>
              <el-option label="大专" value="大专"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>婚姻</span>
          </el-col>
          <el-col :span="6">
            <el-select v-model="addCandidateForm.marriage" placeholder="请选择">
              <el-option label="已婚" value="已婚"></el-option>
              <el-option label="未婚" value="未婚"></el-option>
              <el-option label="离异" value="离异"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>岗位</span>
          </el-col>
          <el-col :span="18">
            <el-input v-model="addCandidateForm.position"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>年薪</span>
          </el-col>
          <el-col :span="18">
            <el-input v-model="addCandidateForm.salary"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>工作年限</span>
          </el-col>
          <el-col :span="18">
            <el-input v-model="addCandidateForm.work_seniority"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>公司</span>
          </el-col>
          <el-col :span="18">
            <el-input v-model="addCandidateForm.company"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>所属顾问</span>
          </el-col>
          <el-col :span="18">
            <el-input v-model="addCandidateForm.counselor"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>地点</span>
          </el-col>
          <el-col :span="18">
            <el-input v-model="addCandidateForm.area"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>录入时间</span>
          </el-col>
          <el-col :span="18">
            <el-date-picker v-model="addCandidateForm.update_date" type="date" placeholder="选择日期"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-col :span="4">
            <span>pipeline</span>
          </el-col>
          <el-col :span="18">
            <el-select v-model="addCandidateForm.pipeline" placeholder="请选择">
              <el-option label="callList" value="callList"></el-option>
              <el-option label="审核" value="审核"></el-option>
              <el-option label="推荐" value="推荐"></el-option>
              <el-option label="面试" value="面试"></el-option>
              <el-option label="offer" value="offer"></el-option>
              <el-option label="入职" value="入职"></el-option>
              <el-option label="过保" value="过保"></el-option>
              <el-option label="淘汰" value="淘汰"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-button type="primary" @click="addCandidate">提交</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addCandidateOnline } from "network/candidate/getCandidate.js";
export default {
  name: "OnlineAddCandidate",
  methods: {
    addCandidate() {
      if (
        this.addCandidateForm.name == "" ||
        this.addCandidateForm.email == "" ||
        this.addCandidateForm.phonenum == ""
      ) {
        this.$message("姓名、手机、邮箱为必填项");
      } else {
        addCandidateOnline(this.addCandidateForm)
          .then((res) => {
            if (res.err == 0) {
              this.$message("插入成功");
              this.$store.commit("callListNumIncrease"); //更新vuex中callList流程候选人人数
              this.$router.push("/candidate");
            }
            if (res.err == -99) {
              this.$message("候选人已存在");
            }
          })
          .catch((err) => {
            this.$message("插入失败");
          });
      }
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
      // education_options: [
      //   [
      //     {
      //       value: "1",
      //       label: "博士",
      //     },
      //     {
      //       value: "2",
      //       label: "硕士",
      //     },
      //     {
      //       value: "3",
      //       label: "本科",
      //     },
      //     {
      //       value: "4",
      //       label: "大专",
      //     },
      //   ],
      // ],
      addCandidateForm: {
        name: "",
        salary: "",
        phonenum: "",
        work_seniority: "",
        position: "",
        company: "",
        functions: "",
        counselor: "",
        update_date: "",
        area: "",
        sex: "",
        age: "",
        pipeline: "callList",
        education: "",
        email: "",
        marriage: "",
      },
      addCandidateFormRules: {
        //验证用户名
        phonenum: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: checkPhonenum,
            message: "请输入正确手机号码",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            message: "请输入正确邮箱",
            trigger: "blur",
          },
        ],
      },
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 <style scoped src='./assets/css/base.css'>*/

.el-form-item {
  width: 50%;
  float: left;
}
</style>