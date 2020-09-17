<!--  -->
<template>
  <div class="login_container">
    <div class="login_box">
      <div class="logo_box">
        <!-- <img src="~assets/img/logo.png" alt /> -->
        <div id="system_name">仲一科技人才系统</div>
      </div>
      <el-form ref="loginFormRef" label-width="0px" :model="loginForm" :rules="loginFormRules">
        <el-form-item class="el-form-item" prop="name">
          <el-input
            placeholder="请输入邮箱"
            class="input_login"
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" prop="password">
          <el-input
            placeholder="请输入密码"
            type="password"
            class="input_login"
            prefix-icon="el-icon-s-tools"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-input class="input_code" v-model="loginForm.code"></el-input>
          <el-button type="primary" @click="getCodeClick">发送验证码</el-button>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getCode } from "network/login/getCode.js";
import { loginCheck } from "network/login/login.js";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        name: "175934443@qq.com",
        password: "222222",
        code: "9898",
      },
      loginFormRules: {
        //验证用户名
        name: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        loginCheck({
          us: this.loginForm.name,
          ps: this.loginForm.password,
          code: this.loginForm.code,
        })
          .then((res) => {
            if (res.err == 0) {
              this.$message.success(res.msg);

              // 登录成功后保存token,使用sessionStorage存储
              window.sessionStorage.setItem("token", res.token);
              //通过编程式导航跳转到主页
              this.$router.push("/home");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    getCodeClick() {
      // getCode();
      getCode({ mail: this.loginForm.name });
    },
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
  /* display: flex; */
  width: 100%;
  /* margin-left: 80px; */
  padding: 0 20px;
}
.logo_box {
  margin-bottom: 10px;
}
.input_code {
  width: 60%;
  margin-right: 20px;
}
.login_container {
  background-color: rgba(0, 152, 210, 0.5);
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: rgba(55, 68, 80, 0.3);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
}
.logo_box {
  text-align: center;
}
#system_name {
  font-size: 26px;
}
</style>