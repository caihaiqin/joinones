<!--  -->
<template>
  <div>
    <el-button size="small" type="primary" @click="downTemplate">下载模板</el-button>
    <!-- //action 文件上传后台api接口地址
    //on-preview预览事件
    //on-remove 单击叉号触发-->
    <el-upload
      :action="uploadUrl"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      list-type="text"
    >
      <el-button size="small" type="primary" class="upload">点击上传</el-button>

      <div slot="tip" class="el-upload__tip">只能上传docx文件，且不超过20M</div>
    </el-upload>
    <el-button size="small" type="primary" class="analysisBtn" @click="analysisBtn">解析简历</el-button>
    <div class="tag">
      <el-tag>{{this.msg}}</el-tag>
    </div>

    <el-table :data="addCandidateForm" border stripe row-key="id">
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
    </el-table>
    <el-button type="primary" @click="addCandidate">提交</el-button>
  </div>
</template>

<script>
import {
  getCandidateByFile,
  addCandidateFromExcel,
} from "network/candidate/getCandidate.js";
import { downFile } from "network/file/file.js";

export default {
  name: "ExcelAddCandidate",
  data() {
    return {
      msg: "候选人清单",
      filename: "", //保存上传后返回的文件名
      uploadUrl: this.$apiUrl + "/file/upload?file",
      addCandidateForm: [],
    };
  },

  methods: {
    //下载excel模板
    downTemplate() {
      console.log("点击下载模板");
      downFile("excel").then((res) => {
        window.location = res.fileUrl;
      });
      // window.location = "http://127.0.0.1:3000/public/excel_template.xlsx";
    },
    //插入数据
    addCandidate() {
      addCandidateFromExcel(this.addCandidateForm)
        .then((res) => {
          console.log(res);
          this.$message(res.msg);
          this.msg = "成功插入候选人清单";
          this.addCandidateForm = res.unrepetitionList;
        })
        .catch((err) => {
          console.log(err);
          this.$message(err.msg);
        });
    },
    //解析简历
    analysisBtn() {
      console.log("解析Excel数据");
      getCandidateByFile(this.filename).then((res) => {
        this.addCandidateForm = res.data;
        console.log(this.addCandidateForm);
      });
    },
    //监听文件上传成功
    handleSuccess(response, file, fileList) {
      console.log(response.filename);
      this.filename = response.filename;
      // console.log(file);
      console.log(fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
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
.analysisBtn {
  margin: 50px 0;
}
.el-tag {
  margin-bottom: 10px;
}
.upload {
  margin-top: 20px;
}
</style>