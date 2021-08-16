<template>
  <div id="soundRecording">
    <div>
      <!-- 切换栏 -->
      <div class="cao" style="margin-bottom: 20px">
        <el-row>
          <span v-if="speakType == 1" class="txt fs12">在线阅读对话文本，可以根据讲话者身份进行搜索或筛选</span>
          <span v-if="speakType == 2" class="txt fs12">在线录入对话文本，可以通过Word或Excel进行导入</span>
          <div
            v-if="speakType == 3"
            class="txt fs12"
            style="margin-top: 0"
          >单击对话文本，可以从该文本开始播放录音；双击对话文本，可以对文本进行修改</div>
          <el-col
            :span="2"
            v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_TEXT_EXPORT}"
            v-if="speakType == 1"
            class="fr"
          >
            <span @click="goExport" class="fs12">
              <i class="el-icon-upload2"></i> 导出对话文本
            </span>
          </el-col>
          <el-col :span="2" v-if="speakType == 2" class="fr">
            <span @click="goImportFile" class="fs12">
              <i class="el-icon-download"></i> 从文件导入
            </span>
          </el-col>
          <el-col :span="2" v-if="speakType == 2" class="fr">
            <span @click="centerDialogVisible=true" class="fs12">
              <i class="el-icon-cloudy"></i> AI语音识别
            </span>
          </el-col>
          <el-col :span="2" v-if="speakType == 2" class="fr">
            <span @click="manage" class="fs12">
              <i class="el-icon-tickets"></i> 讲话者管理
            </span>
          </el-col>
          <el-col :span="2" v-if="speakType == 2" class="fr">
            <span @click="deleteItwt" class="fs12">
              <i class="el-icon-delete"></i> 清空对话文本
            </span>
          </el-col>
          <el-col
            :span="2"
            v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_TEXT_AUDIT}"
            v-if="speakType == 3 && status == 3"
            class="fr col"
          >
            <el-button @click="openExamice" size="mini" type="primary" class="mini">
              <span>提交审核</span>
            </el-button>
          </el-col>
        </el-row>
      </div>

      <router-view @getSamllChild="getSamllChild" :deleteIntertext="deleteIntertext" />
      <el-form :model="numberValidateForm" ref="numberValidateForm">
        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
          <div class="number">
            <p>请输入访谈人数</p>
            <el-form-item
              prop="input"
              :rules="[
      { required: true, message: '人数不能为空'},
      { type: 'number', message: '人数必须为数字值'}
    ]"
            >
              <el-input
                type="input"
                v-model.number="numberValidateForm.input"
                autocomplete="off"
                placeholder="请输入人数"
              ></el-input>
            </el-form-item>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-form-item>
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="altext(numberValidateForm)">确 定</el-button>
            </el-form-item>
          </span>
        </el-dialog>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["type"],
  data() {
    return {
      numberValidateForm: {
        input: ""
      },
      centerDialogVisible: false,
      interName: null,
      interviewId: null,
      projectId: null,
      breadcrumbList: [
        {
          name: "访谈",
          path: "/talk"
        },
        {
          name: "对话文本"
        }
      ],
      speakType: "1",
      // selectValue: '2',
      dialogVisible: false,
      voice: null,
      voiceName: null,
      status: null,
      deleteIntertext: false
    };
  },
  watch: {
    type: function(val) {
      this.speakType = val;
    }
  },
  created() {
    this.interName = this.$route.query.ina;
    this.projectId = this.$route.query.id;
    this.interviewId = this.$route.query.inId;
    this.status = this.$route.query.sta;
    this.$emit("getChild", {
      breadcrumbList: this.breadcrumbList,
      link: "/talk",
      interviewName: this.interName,
      interviewId: this.interviewId
    });
    if (this.$route.path.indexOf("/talk/text/info") != -1) {
      this.speakType = "1";
    } else if (this.$route.path.indexOf("/talk/text/edit") != -1) {
      this.speakType = "2";
    } else if (this.$route.path.indexOf("/talk/text/audit") != -1) {
      this.speakType = "3";
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        if (val.path.indexOf("/talk/text/info") != -1) {
          this.speakType = "1";
        } else if (val.path.indexOf("/talk/text/edit") != -1) {
          this.speakType = "2";
        } else if (val.path.indexOf("/talk/text/audit") != -1) {
          this.speakType = "3";
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    // 获取子组件的voiceId
    getSamllChild(params) {
      if (params.voice) {
        this.voice = params.voice;
      }
      if (params.name) {
        this.voiceName = params.name;
      }
      if (params.interviewName) {
        this.interName = params.interviewName;
      }
    },
    // 打开审核弹框
    openExamice() {
      this.$confirm(
        "提交审核后，访问员将无法编辑访谈对话文本、上传录音和附件！是否仍然继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.checkStatus();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

    // 切换访谈状态
    checkStatus() {
      // 2:开始访谈 3:结束访谈 4;提交审核 5:审核通过
      let params = {
        interviewId: this.interviewId,
        projectId: this.projectId,
        status: 4
      };
      this.httpPost("/interview/detail/status", params)
        .then(res => {
          if (res.code == 0) {
            this.status = 4;
            this.$message({ type: "success", message: res.message });
          } else {
            this.$message({ type: "error", message: res.message });
          }
        })
        .catch(error => {
          this.$message({ type: "error", message: error });
        });
    },
    // al语音转文字
    altext(numberValidateForm) {
      this.speakType = "3";
      this.$refs.numberValidateForm.validate(valid => {
        if (valid) {
          this.centerDialogVisible = false;
          this.$router.push({
            path: "/talk/text/altext",
            query: {
              id: this.projectId,
              inId: this.interviewId,
              ina: this.interName,
              val: this.numberValidateForm.input,
              voice:this.voice
            }
          });
        } else {
          return false;
        }
      });
    },

    // 讲话者管理
    manage() {
      this.$router.push({
        path: "/talk/speaker",
        query: {
          id: this.projectId,
          inId: this.interviewId,
          ina: this.interName
        }
      });
    },

    // 清除对话文本
    deleteItwt() {
      this.$confirm(
        `确认清空录音为: ${this.voiceName} 的全部对话文本吗？清空后将无法恢复`,
        "清空对话文本",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          this.deleteIntertext = true;
        })
        .catch(action => {
          this.deleteIntertext = false;
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

    // 从文件导入
    goImportFile() {
      if (!this.voice) {
        this.$message({ type: "warning", message: "暂无录音文件，请先上传" });
      } else {
        this.$router.push({
          path: "/talk/text/import",
          query: {
            id: this.projectId,
            inId: this.interviewId,
            fileId: this.voice,
            ina: this.interName,
            val: this.vau
          }
        });
      }
    },
    // 导出对话文本
    goExport() {
      this.$router.push({
        path: "/talk/text/export",
        query: {
          id: this.projectId,
          inId: this.interviewId,
          ina: this.interName
        }
      });
    }
  }
};
</script>

<style scoped>
.drop >>> .el-input--mini .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.drop >>> .el-input--mini .el-input__icon {
  line-height: 26px;
}
.drop >>> .el-form-item__error {
  top: 39px;
}
</style>
<style>
.el-form-item__error {

  top: 39px;

}
</style>
<style lang='scss' scoped>
#soundRecording {
  div {
    overflow: hidden;
  }
  .number {
    display: flex;
    padding: 0 20px;
    /* align-items: center; */
    p {
      width: 40%;
      /* text-align: center; */
      line-height: 40px;
    }
  }
  .txt {
    margin: 20px 0 0;
    color: #2e83d3;
  }
  .voice {
    overflow: hidden;
    .txt {
      margin: 20px 0;
      color: #2e83d3;
    }
  }
  .current {
    background-color: #eee;
    padding: 5px;
  }
  .vItem {
    display: inline-block;
    margin-right: 15px;
    line-height: 28px;
    color: #444;
    width: 15%;
  }
  .fr {
    float: right;
    text-align: right;
    margin-left: 10px;
    span {
      cursor: pointer;
      color: #2e83d3;
      i {
        font-weight: bold;
      }
    }
  }
  .col {
    span {
      color: #fff !important;
    }
  }
  .item {
    line-height: 20px;
    .wrp {
      padding: 20px 0;
      border-bottom: 1px solid #ccc;
      min-height: 120px;
      .vItem {
        color: #999;
        span {
          font-size: 10px;
        }
      }
    }
    .jiao {
      border-bottom: 1px solid #ccc;
      .vItem {
        color: #999;
        span {
          font-size: 10px;
        }
      }
      .bgc {
        margin: 10px 0;
        cursor: pointer;
        padding: 10px 0;
      }
      .current {
        background-color: #eee;
      }
    }
    .ico {
      overflow: hidden;
      margin: 20px 0 0;
      li {
        float: left;
        width: 100%;
        margin-bottom: 8px;
        text-align: right;
        i {
          font-size: 18px;
          color: #666;
          cursor: pointer;
        }
      }
    }
    .name {
      font-size: 12px;
      padding-left: 15px;
      color: #444;
    }
    .txt {
      font-size: 12px;
      color: #444;
    }
  }
}
</style>
