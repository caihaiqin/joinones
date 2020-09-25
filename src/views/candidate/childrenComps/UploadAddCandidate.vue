<!-- 
 -->
<template>
  <div>
    <el-button size="small" type="primary" @click="downChineseTemplate">下载中文模板</el-button>
    <el-button size="small" type="primary" @click="downEnglishTemplate">下载英文模板</el-button>
    <!-- //action 文件上传后台api接口地址
    //on-preview预览事件
    //on-remove 单击叉号触发-->
    <el-upload
      :action="uploadUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      list-type="text"
    >
      <el-button size="small" type="primary" class="upload">点击上传</el-button>

      <div slot="tip" class="el-upload__tip">只能上传docx文件，且不超过20M</div>
    </el-upload>
    <el-button size="small" type="primary" class="analysisBtn" @click="analysisBtn">解析简历</el-button>
    <!-- <el-dialog
      title="提示"
      :visible.sync="analysisdialogVisible"
      width="80%"
      :before-close="analysisDialogClose"
    >
    <span>-->
    <upload-analysis-candidate
      :candidateInfoFromFile="candidateInfoFromFile"
      :analysisDialogClose="analysisDialogClose"
      v-if="childData"
    ></upload-analysis-candidate>
    <!-- </span>
    </el-dialog>-->

    <el-dialog
      :visible="showDoc == true || showPdf == true || showImg==true"
      :show-close="true"
      :width="'60%'"
      :height="'800px'"
      class="dialog-div-pre-style"
      :before-close="closePreviewClick"
      center
    >
      <div v-if="showDoc == true" class="dialog-body-content-base-style">
        <iframe
          frameborder="0"
          :src="'https://view.officeapps.live.com/op/view.aspx?src=' + previewPath"
          width="100%"
        ></iframe>
      </div>
      <div
        v-else-if="showPdf == true"
        class="dialog-body-content-base-style"
        style="justify-content: center; align-items: center"
      >
        <embed :src="pdfUrl" style="width: 100%; height: 100%" />
      </div>
      <div v-else-if="showImg==true" class="dialog-body-content-base-style">
        <!-- <el-image-viewer :on-close="closeImgViewer" :url-list="[this.previewPath]" /> -->
        <img :src="previewPath" alt />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import UploadAnalysisCandidate from "./UploadAnalysisCandidate";
import { getCandidateByFile } from "network/candidate/getCandidate.js";
import { downFile } from "network/file/file.js";
export default {
  name: "UploadAddCandidate",
  data() {
    return {
      childData: true,
      //控制简历解析对话框
      analysisdialogVisible: false,
      candidateInfoFromFile: {
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
        pipeline: "",
        education: "",
        email: "",
        marriage: "",
      },
      filename: "", //保存上传后返回的文件名

      showDoc: false,
      showPdf: false,
      showImg: false,
      fileUrl: "",
      images: [],
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      pdfUrl: "",
      scale: 1.0,
      previewVisible: false,
      previewPath: "",
      uploadUrl: this.$apiUrl + "/file/upload?file",
    };
  },
  components: {
    ElImageViewer,
    UploadAnalysisCandidate,
  },
  methods: {
    downChineseTemplate() {
      console.log("点击下载中文模板");
      downFile("chinese").then((res) => {
        window.location = res.fileUrl;
      });
    },
    downEnglishTemplate() {
      console.log("点击下载英文模板");
      downFile("english").then((res) => {
        window.location = res.fileUrl;
      });
    },
    analysisDialogClose() {
      this.analysisdialogVisible = false;
      this.childData = false;

      setTimeout(() => {
        this.childData = true;
      }, 0);
    },
    // 解析简历
    analysisBtn() {
      console.log("解析Excel数据");
      getCandidateByFile(this.filename).then((res) => {
        this.candidateInfoFromFile = res.data;
        console.log(this.candidateInfoFromFile);
      });
      this.analysisdialogVisible = true;
      this.childData = true;
    },

    closeImgViewer() {
      this.showImg = false;
    },
    /**
     * pdf预览
     */
    previewPdf(row) {
      let type = this.iconByType(row);
      this.fileUrl = row.url;
      if (
        type.indexOf("doc") != -1 ||
        type.indexOf("docx") != -1 ||
        type.indexOf("xsl") != -1 ||
        type.indexOf("xslx") != -1
      ) {
        this.showDoc = true;
      } else if (type.indexOf("pdf") != -1) {
        this.pdfUrl =
          "http://47.105.218.26:8888/group1/M00/00/00/rB-LJlzT042AbKdCAAiu_35Yccs182.pdf";
        this.showPdf = true;
      } else if (
        type.indexOf("jpg") != -1 ||
        type.indexOf("png") != -1 ||
        type.indexOf("jpeg") != -1
      ) {
        this.images = this.getUrlListByName(row.url);
        const viewer = this.$el.querySelector(".images").$viewer;
        viewer.show();
      } else if (
        type.indexOf("avi") != -1 ||
        type.indexOf("mp4") != -1 ||
        type.indexOf("webm") != -1 ||
        type.indexOf("m4v") != -1 ||
        type.indexOf("rmvb") != -1 ||
        type.indexOf("mpg") != -1 ||
        type.indexOf("3gp") != -1 ||
        type.indexOf("swf") != -1 ||
        type.indexOf("mkv") != -1
      ) {
        this.positivePlayerOptions.sources[0].src =
          "//nos.netease.com/vod163/demo.mp4";
        this.positivePlayerOptions.sources[0].type = "video/mp4";
        this.showVideo = true;
      } else {
        this.$message("当前文件暂不支持预览");
      }
      // this.showPdf = true
    },
    /**
     * 通过文件后缀返回文件的图标
     */
    iconByType(row) {
      return row.fileName.substring(
        row.fileName.lastIndexOf(".") + 1,
        row.fileName.length
      );
    },
    closePreviewClick() {
      if (this.showDoc == true) {
        this.showDoc = false;
      } else if (this.showPdf == true) {
        this.showPdf = false;
      } else if (this.showImg == true) {
        this.showImg = false;
      }
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
    handlePreview(file) {
      console.log(file);
      console.log(this.$apiUrl);
      this.previewPath = this.$apiUrl + file.response.path;
      console.log(this.previewPath);
      let type = file.name.split(".")[1];
      console.log(type);
      if (
        type.indexOf("doc") != -1 ||
        type.indexOf("docx") != -1 ||
        type.indexOf("xsl") != -1 ||
        type.indexOf("xslx") != -1
      ) {
        this.showDoc = true;
      } else if (type.indexOf("pdf") != -1) {
        this.pdfUrl = this.previewPath;
        this.showPdf = true;
      } else if (
        type.indexOf("jpg") != -1 ||
        type.indexOf("png") != -1 ||
        type.indexOf("jpeg") != -1
      ) {
        // this.images = this.getUrlListByName(this.previewPath);
        // const viewer = this.$el.querySelector(".images").$viewer;
        // viewer.show();
        this.showImg = true;
        console.log(this.showImg);
      } else {
        this.$message("当前文件暂不支持预览");
      }
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
.dialog-body-content-base-style {
  width: 100%;
  height: 800px;
}
.analysisBtn {
  margin: 50px 0;
}
.upload {
  margin-top: 20px;
}
</style>