<template>
  <div id="soundRecording" v-loading="loading" element-loading-text="正在翻译请等候……">
    <div>
      <!-- 录音区 -->
      <div class="voice">
        <!-- <el-col :span='3'>
          <div class="drop" style="width: 90%">
            <el-select size='mini' v-model="voice" @change="changeVoiceFile" placeholder='请选择录音'>
              <el-option v-for="item in voiceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-col>-->
        <el-col :span="21" style="margin-bottom: 20px;padding-right: 7px;position: relative;">
          <aplayer
            ref="player"
            style="width: 100%"
            :autoplay="true"
            id="aplayer"
            theme="#2e83d3"
            :music="musicObj"
          />
          <!-- <div class="open">
            <el-button size="mini" class="mini" @click="prevVoice" :disabled="firstBtn">
              <span class="iconfont">&#xe603;</span>
            </el-button>
            <el-button size="mini" class="mini" @click="nextVoice" :disabled="lastBtn">
              <span class="iconfont">&#xe602;</span>
            </el-button>
          </div>-->
        </el-col>
      </div>

      <!-- 选择框 -->
      <div class="chose">
        <div class="vant">
          <div class="box" v-for="(items,index) in selst" :key="index">
            <p>{{items.person}}</p>
            <el-select v-model="items.value" placeholder="请选择" @change="changval">
              <el-option
                v-for="item in speakerWriteList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <!-- 确定框 -->
          <div class="masck">
            <el-button @click="keep">保存</el-button>
          </div>
        </div>

        <!-- 转换的文字 -->
      </div>
      <!-- 所有文本 -->
      <div class="text">
        <div class="item" v-for="(item,index) in answerData" :key="index">
          <div class="title">{{item.realName}}</div>
          <div class="content">
            <p>{{item.paragraph}}</p>
            <span>{{item.beginTime+" / "+item.endTime}}</span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <div class="pagination" v-if="shuju.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="shuju.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";
import Aplayer from "vue-aplayer";
import "APlayer/dist/APlayer.min.css";
import { getPaginationData } from "../../../utils/utils";
export default {
  components: { vuedraggable, Aplayer },
  props: ["deleteIntertext"],
  data() {
    return {
      selectIdsArr: [],
      shuju:"",
      answerData: [],
      selst: [],
      loading: true,
      interName: null,
      isShowNav: false,
      interviewId: null,
      projectId: null,
      voice: "",
      isEdit: false,
      editObj: {
        speaker: "",
        voiceName: "",
        startTime: "",
        endTime: "",
        voiceDuration: "",
        speakText: ""
      },
      vName: null,
      editorId: null,
      voiceList: [],
      voiceArr: [],
      voiceIndex: null,
      lastBtn: false,
      firstBtn: false,

      allData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,

      active: null,
      list: [],
      speakerWriteList: [],
      timeArr: null,
      isSave: false,
      noMessage: false,
      startEditM: 0,
      startEditS: 0,
      endEditM: 0,
      endEditS: 0,
      staEditM: "00",
      staEditS: "00",
      eEditM: "00",
      eEditS: "00",
      EditM: 0,
      EditS: 0,
      Editm: 0,
      Edits: 0,
      value: "",
      options: "",
      startM: 0,
      startS: 0,
      endM: 0,
      endS: 0,
      staM: "00",
      staS: "00",
      eM: "00",
      eS: "00",
      M: 0,
      S: 0,
      m: 0,
      s: 0,
      num: 0,
      musicObj: {
        src: "https://i.ringdata.com/"
      },
      status: null,
      writeObj: {
        speaker: "",
        voiceName: "",
        startTime: "",
        endTime: "",
        voiceDuration: "",
        speakText: ""
      }
    };
  },
  created() {
    this.interName = this.$route.query.ina;
    this.projectId = this.$route.query.id;
    this.interviewId = this.$route.query.inId;
    this.status = this.$route.query.sta;
    this.num = this.$route.query.val;
    this.voice = this.$route.query.voice;
    // this.loading = false;

    // 根据传过来的值 渲染指定的讲话者
    for (var i = 1; i <= this.num; i++) {
      var obj = {};
      obj.person = "讲话者" + i;
      obj.value = "";
      this.selst.push(obj);
    }
    this.$emit("getChild", {
      breadcrumbList: this.breadcrumbList,
      link: "/talk",
      interviewName: this.interName
    });
    this.getSpeakerList();
    this.getVoiceList();
  },

  mounted() {
    // this.loading = false;
    this.translation();
    // this.init();
    // this.$forceUpdate();
    // 暂时关闭
  },

  watch: {
    deleteIntertext(val) {
      if (val == true) {
        // this.loading = true;
        this.deleteItem(null);
      } else {
        // this.loading = false;
      }
    }
  },
  methods: {
    // 初始化分页
    init() {
      this.answerData = getPaginationData(
        this.shuju,
        this.currentPage,
        this.pageSize
      );
      this.loading = false;
    },
    // 刚刚进入页面进行翻译
    translation() {
      let params = {
        fileId: this.voice,
        number: this.num
      };
      this.httpPost("/interview/voice/data", params).then(res => {
        //  this.$set(this.shuju,0,res.data)
        this.shuju = res.data;
        this.$nextTick(() => {
          this.init();
        });
      });
    },

    //保存並发送给后端
    keep() {
      // 查找下拉框是否填写数据
      var data = this.selst.filter((item, index) => {
        return item.value == "";
      });
      if (data.length === 0) {
        const newData = this.shuju.map(item => {
          return {
            speakerId: item["id"],
            name: item["realName"],
            beginTime: item["beginTime"],
            duration: item["duration"],
            endTime: item["endTime"],
            paragraph: item["paragraph"],
            interviewId: this.interviewId,
            fileId: this.voice
          };
        });
        let params = {
          list: newData
        };
        this.httpPost("/interview/batch/paragraphAI", params).then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
        });
      } else {
        this.$message({
          message: "请选择讲话者名称",
          type: "warning"
        });
      }
    },

    // 替换人名
    quer() {
      // console.log(val)
      // console.log(this.selst)
      // console.log(this.speakerWriteList)
      // console.log(this.shuju)
      // 替换id
      for (const item of this.shuju) {
        for (const items of this.selst) {
          if (item.name === items.person) {
            item.id = items.value;
          }
        }
      }
      // console.log(this.shuju)

      // 根据id 替换人名
      for (const item of this.shuju) {
        for (const items of this.speakerWriteList) {
          if (item.id === items.value) {
            item.realName = items.label;
          }
        }
      }
    },

    // 录入模式删除
    deleteItem(id) {
      var params;
      if (id) {
        this.$confirm("此操作将永久删除该文本, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            params = {
              projectId: +this.projectId,
              interviewId: +this.interviewId,
              paragraphId: id,
              fileId: null
            };
            this.delText(params);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        params = {
          projectId: +this.projectId,
          paragraphId: null,
          interviewId: +this.interviewId,
          fileId: this.voice
        };
        this.delText(params);
      }
    },

    // 删除
    delText(params) {
      this.httpPost("interview/delete/paragraph", params)
        .then(res => {
          if (res.code == 0) {
            // this.loading = false;
            this.getWriteList();
            this.$message({ type: "success", message: res.message });
          } else {
            // this.loading = false;
            this.$message({ type: "error", message: res.message });
          }
        })
        .catch(error => {
          // this.loading = false;
          // this.$message({type: 'error', message: error})
        });
    },

    // 下拉框对应的值
    changval(val) {
      for (const item of this.selst) {
        if (item.value) {
          this.selectIdsArr.push(item.value);
        }
      }
      this.quer();
    },

    // 获取录音列表
    getVoiceList() {
      this.voiceList = [];
      let params = {
        interviewId: this.interviewId,
        type: 1,
        projectId: this.projectId
      };
      this.httpPost("/interview/file", params)
        .then(res => {
          let _this = this;
          if (res.code == 0) {
            res.data.data.forEach(item => {
              let obj = {};
              obj.label = item.name;
              obj.value = item.id;
              this.voiceList.push(obj);
              let vObj = {
                id: item.id,
                title: item.name,
                author: item.userName,
                src: this.baseUrl + item.filePath,
                pic: this.baseUrl + item.backGround
              };
              this.voiceArr.push(vObj);
            });
            // this.voice = this.voiceList[0].value;
            // this.vName = this.voiceList[0].label;

            this.$emit("getSamllChild", {
              voice: this.voice,
              name: this.vName,
              interviewName: this.interName
            });
            // 根据id 查找对应的下标 进行显示
            let index = this.voiceArr.findIndex(item => item.id == this.voice);
            this.musicObj = this.voiceArr[index];
            this.writeObj.voiceName = this.voiceList[0].label;
            this.voiceIndex = 0;
            this.getWriteList();
          } else {
            // this.loading = false;
            this.$message({ type: "error", message: res.message });
          }
        })
        .catch(error => {
          // this.loading = false;
        });
    },

    // 获取讲话者列表
    getSpeakerList() {
      this.speakerWriteList = [];
      let params = {
        interviewId: this.interviewId,
        projectId: this.projectId
      };
      this.httpPost("interview/list/speaker/", params)
        .then(res => {
          if (res.code == 0) {
            res.data.forEach(item => {
              let obj = {};
              obj.label = item.name;
              obj.value = item.id;
              this.speakerWriteList.push(obj);
            });
          } else {
            this.$message({ type: "error", message: res.message });
          }
        })
        .catch(error => {
          this.$message({ type: "error", message: error });
        });
    },

    // 重置数据
    initDate() {
      this.isEdit = null;
      this.writeObj.speaker = null;
      this.editorId = null;
      this.writeObj.speakText = "";
      this.writeObj.startTime = "";
      this.writeObj.endTime = "";
      this.writeObj.voiceDuration = "";
      this.editObj.speakText = "";
      this.editObj.startTime = "";
      this.editObj.endTime = "";
      this.editObj.voiceDuration = "";
      this.active = null;
      this.startM = 0;
      this.startS = 0;
      this.endM = 0;
      this.endS = 0;
      this.staM = "00";
      this.staS = "00";
      this.eM = "00";
      this.eS = "00";
      this.M = 0;
      this.S = 0;
      this.m = 0;
      this.s = 0;

      this.startEditM = 0;
      this.startEditS = 0;
      this.endEditM = 0;
      this.endEditS = 0;
      this.staEditM = "00";
      this.staEditS = "00";
      this.eEditM = "00";
      this.eEditS = "00";
      this.EditM = 0;
      this.EditS = 0;
      this.Editm = 0;
      this.Edits = 0;
    },

    // 录入模式保存对话文本
    writeSaveDialogue(params) {
      this.httpPost("interview/save/paragraph", params)
        .then(res => {
          if (res.code == 0) {
            this.initDate();
            this.getWriteList();
            this.$message({ type: "success", message: res.message });
          }
        })
        .catch(error => {
          this.$message({ type: "error", message: error });
        });
    },

    // 录入模式保存
    writeItem() {
      var start = this.M + this.S;
      var end = this.m + this.s;
      this.writeObj.startTime = this.staM + ":" + this.staS;
      this.writeObj.endTime = this.eM + ":" + this.eS;
      var duration = end - start;
      if (!this.voice) {
        this.$message({ type: "warning", message: "请选择录音" });
        return;
      }
      if (!this.writeObj.speaker) {
        this.$message({ type: "warning", message: "请选择讲话者" });
        return;
      }
      if (!this.writeObj.speakText || this.writeObj.speakText.trim() == "") {
        this.$message({ type: "warning", message: "请输入对话文本" });
        return;
      }
      if (!this.writeObj.startTime) {
        this.$message({ type: "warning", message: "请选择开始时间" });
        return;
      }
      if (!this.writeObj.endTime) {
        this.$message({ type: "warning", message: "请选择结束时间" });
        return;
      }
      if (duration <= 0) {
        this.$message({ type: "warning", message: "结束时间不可小于开始时间" });
        return;
      } else {
        this.writeObj.voiceDuration = duration * 1000;
      }
      var params;
      params = {
        fileId: this.voice,
        status: this.status,
        projectId: this.projectId,
        interviewId: this.interviewId,
        speakId: this.writeObj.speaker,
        beginTime: this.writeObj.startTime,
        endTime: this.writeObj.endTime,
        paragraph: this.writeObj.speakText,
        name: this.writeObj.voiceName,
        duration: this.writeObj.voiceDuration
      };
      this.writeSaveDialogue(params);
    },

    // 编辑模式保存
    EditItem() {
      var start = this.EditM + this.EditS;
      var end = this.Editm + this.Edits;
      this.editObj.startTime = this.staEditM + ":" + this.staEditS;
      this.editObj.endTime = this.eEditM + ":" + this.eEditS;
      var duration = end - start;
      if (!this.voice) {
        this.$message({ type: "warning", message: "请选择录音" });
        return;
      }
      if (!this.editObj.speaker) {
        this.$message({ type: "warning", message: "请选择讲话者" });
        return;
      }
      if (!this.editObj.speakText || this.editObj.speakText.trim() == "") {
        this.$message({ type: "warning", message: "请输入对话文本" });
        return;
      }
      if (!this.editObj.startTime) {
        this.$message({ type: "warning", message: "请选择开始时间" });
        return;
      }
      if (!this.editObj.endTime) {
        this.$message({ type: "warning", message: "请选择结束时间" });
        return;
      }
      if (duration <= 0) {
        this.$message({ type: "warning", message: "结束时间不可小于开始时间" });
        return;
      } else {
        this.editObj.voiceDuration = duration * 1000;
      }
      var params;
      params = {
        id: this.editorId,
        projectId: this.projectId,
        fileId: this.voice,
        status: this.status,
        interviewId: this.interviewId,
        speakId: this.editObj.speaker,
        beginTime: this.editObj.startTime,
        endTime: this.editObj.endTime,
        paragraph: this.editObj.speakText,
        name: this.editObj.voiceName,
        duration: this.editObj.voiceDuration
      };
      this.writeSaveDialogue(params);
    },

    // 获取详情
    getDetail(val) {
      let params = {
        paragraphId: val,
        projectId: +this.projectId
      };
      this.httpPost("/interview/detail/paragraph/", params).then(res => {
        if (res.code == 0) {
          var resData = res.data;
          this.editorId = resData.id;
          this.editObj.speakText = resData.paragraph;
          this.editObj.endTime = resData.endTime;
          this.editObj.voiceName = resData.name;
          this.editObj.voiceDuration = resData.duration;
          this.editObj.speaker = resData.speakId;
          this.voice = resData.fileId;
          var start = resData.beginTime;
          var end = resData.endTime;
          var getStr = function(val) {
            var item;
            if (val < 10) {
              item = "0" + val;
              return item;
            } else {
              item = val + "";
              return item;
            }
          };
          this.startEditM = +start.substring(0, 2);
          this.startEditS = +start.substring(3, 5);
          this.staEditM = getStr(this.startEditM);
          this.staEditS = getStr(this.startEditS);
          this.EditM = this.startEditM * 60;
          this.EditS = this.startEditS;
          this.endEditM = +end.substring(0, 2);
          this.endEditS = +end.substring(3, 5);
          this.eEditM = getStr(this.endEditM);
          this.eEditS = getStr(this.endEditS);
          this.Editm = this.endEditM * 60;
          this.Edits = this.endEditS;
        }
      });
    },

    // 录入模式点击编辑录音内容
    editText(val) {
      this.isEdit = val;
      let aplayer = this.$refs.player;
      aplayer.pause();
      this.getDetail(val);
    },

    // 切换录音文件
    changeVoiceFile(val) {
      this.voiceList.forEach((item, index) => {
        if (item.value == val) {
          this.writeObj.voiceName = item.label;
          this.$emit("getSamllChild", {
            voice: this.voice,
            name: this.writeObj.voiceName
          });
          let aplayer = this.$refs.player;
          aplayer.pause();
          this.musicObj = {
            title: this.voiceArr[index].title,
            author: this.voiceArr[index].author,
            src: this.voiceArr[index].src,
            pic: this.voiceArr[index].pic
          };
          aplayer.play();
        }
      });
      this.writeObj.speaker = null;
      this.editorId = null;
      this.writeObj.speakText = "";
      this.writeObj.startTime = "";
      this.writeObj.endTime = "";
      this.writeObj.voiceDuration = "";
      this.active = null;
      this.startM = 0;
      this.startS = 0;
      this.endM = 0;
      this.endS = 0;
      this.staM = "00";
      this.staS = "00";
      this.eM = "00";
      this.eS = "00";
      this.M = 0;
      this.S = 0;
      this.m = 0;
      this.s = 0;
      this.getWriteList();
    },

    prevVoice() {
      this.lastBtn = false;
      this.voiceIndex = this.voiceIndex - 1;
      if (this.voiceIndex >= 0) {
        let aplayer = this.$refs.player;
        aplayer.pause();
        this.musicObj = {
          title: this.voiceArr[this.voiceIndex].title,
          author: this.voiceArr[this.voiceIndex].author,
          src: this.voiceArr[this.voiceIndex].src,
          pic: this.voiceArr[this.voiceIndex].pic
        };
        this.voice = this.voiceList[this.voiceIndex].value;
        this.firstBtn = false;
        aplayer.play();
        this.getWriteList();
      } else {
        this.$message({ type: "warning", message: "当前是第一段录音" });
        this.firstBtn = true;
        this.voiceIndex = this.voiceIndex + 1;
        return;
      }
    },
    nextVoice() {
      this.firstBtn = false;
      this.voiceIndex = this.voiceIndex + 1;
      if (this.voiceIndex < this.voiceArr.length) {
        let aplayer = this.$refs.player;
        aplayer.pause();
        this.musicObj = {
          title: this.voiceArr[this.voiceIndex].title,
          author: this.voiceArr[this.voiceIndex].author,
          src: this.voiceArr[this.voiceIndex].src,
          pic: this.voiceArr[this.voiceIndex].pic
        };
        this.voice = this.voiceList[this.voiceIndex].value;
        this.lastBtn = false;
        aplayer.play();
        this.getWriteList();
      } else {
        this.$message({ type: "warning", message: "当前是最后一段录音" });
        this.lastBtn = true;
        this.voiceIndex = this.voiceIndex - 1;
        return;
      }
    },

    // 切换录入模式讲话者
    changeSpeakerWrite(val) {},

    startMChange(val) {
      this.M = val * 60;
      if (val < 10) {
        this.staM = "0" + val;
      } else {
        this.staM = val + "";
      }
    },
    startSChange(val) {
      this.S = val;
      if (val < 10) {
        this.staS = "0" + val;
      } else {
        this.staS = val + "";
      }
    },
    endMChange(val) {
      this.m = val * 60;
      if (val < 10) {
        this.eM = "0" + val;
      } else {
        this.eM = val + "";
      }
    },
    endSChange(val) {
      this.s = val;
      if (val < 10) {
        this.eS = "0" + val;
      } else {
        this.eS = val + "";
      }
    },
    startEditMChange(val) {
      this.EditM = val * 60;
      if (val < 10) {
        this.staEditM = "0" + val;
      } else {
        this.staEditM = val + "";
      }
    },
    startEditSChange(val) {
      this.EditS = val;
      if (val < 10) {
        this.staEditS = "0" + val;
      } else {
        this.staEditS = val + "";
      }
    },
    endEditMChange(val) {
      this.Editm = val * 60;
      if (val < 10) {
        this.eEditM = "0" + val;
      } else {
        this.eEditM = val + "";
      }
    },
    endEditSChange(val) {
      this.Edits = val;
      if (val < 10) {
        this.eEditS = "0" + val;
      } else {
        this.eEditS = val + "";
      }
    },

    // 格式化毫秒
    formatDuring(mss) {
      var minutes = Math.floor((mss / 1000 / 60) << 0);
      var seconds = Math.floor((mss / 1000) % 60);
      return minutes + " m " + seconds + " s ";
    },
    // 格式化日期
    formateDate(val) {
      var d = new Date(val);
      let h = d.getHours() > 9 ? d.getHours() : "0" + d.getHours();
      let m = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes();
      let s = d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds();
      // youWant=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      let res = h + ":" + m + ":" + s;
      return res;
      //yyyy-MM-dd hh:mm:ss
    },

    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val;
      window.scrollTo(0, 0);
      this.init();
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
      window.scrollTo(0, 0);
      this.init();
    }
  }
};
</script>


<style scoped>
#soundRecording >>> .aplayer .aplayer-info {
  margin-left: 0px;
  padding: 14px 7px 12px 10px;
  height: 66px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
#soundRecording >>> .aplayer {
  font-family: Arial, Helvetica, sans-serif;
  color: #000;
  background-color: #fff;
  margin: 0px 5px 5px 0;
  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07),
    0 1px 5px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  line-height: normal;
  position: relative;
}
#soundRecording >>> .el-input-number__decrease {
  width: 15px !important;
  font-size: 10px;
}
#soundRecording >>> .aplayer .aplayer-body .aplayer-info .aplayer-music {
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  overflow: hidden;
  margin-bottom: 0px;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 5px;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  cursor: default;
  padding-bottom: 2px;
}
#soundRecording
  >>> .aplayer
  .aplayer-info
  .aplayer-controller
  .aplayer-bar-wrap
  .aplayer-bar
  .aplayer-loaded {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #a7cdf0;
  height: 2px;
  -webkit-transition: all 0.5s ease;
  transition: all 0.5s ease;
}
#soundRecording >>> .el-input-number--mini .el-input__inner {
  padding-right: 15px;
  padding-left: 0px;
}
#soundRecording >>> .el-input-number--mini {
  width: 50px;
  margin-right: 3px;
  line-height: 26px;
}
#soundRecording
  >>> .aplayer-bar-wrap
  .aplayer-bar
  .aplayer-played
  .aplayer-thumb {
  position: absolute;
  top: 0;
  right: 5px;
  margin-top: -5px;
  margin-right: -10px;
  width: 10px;
  height: 10px;
  border: 0px solid;
  -webkit-transform: scale(0.8);
  transform: scale(0.8);
  will-change: transform;
  -webkit-transition: background-color 0.3s, border-color 0.3s,
    -webkit-transform 0.3s;
  transition: background-color 0.3s, border-color 0.3s, -webkit-transform 0.3s;
  transition: transform 0.3s, background-color 0.3s, border-color 0.3s;
  transition: transform 0.3s, background-color 0.3s, border-color 0.3s,
    -webkit-transform 0.3s;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  overflow: hidden;
}
#soundRecording >>> .aplayer-thumb {
  background-color: #2e83d3 !important;
}
#soundRecording >>> .aplayer-pic .aplayer-play .aplayer-icon-play {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 20px;
  width: 20px;
}
#soundRecording >>> .aplayer .aplayer-icon-back,
.aplayer .aplayer-icon-forward,
.aplayer .aplayer-icon-lrc,
.aplayer .aplayer-icon-order,
.aplayer .aplayer-icon-play {
  display: block !important;
}
#soundRecording >>> .aplayer-icon-play {
  display: block !important;
}
#soundRecording >>> .aplayer-pic .aplayer-pause .aplayer-icon-pause {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 12px;
  width: 12px;
}
#soundRecording >>> .aplayer .aplayer-pic {
  position: relative;
  float: left;
  height: 90px;
  width: 90px;
  background-size: cover;
  background-position: 50%;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  cursor: pointer;
}
.drop >>> .el-input--mini .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.drop >>> .el-input--mini .el-input__icon {
  line-height: 26px;
}
</style>
<style lang='scss' scoped>
#soundRecording {
  /* div {
    overflow: hidden;
  } */
  .left {
    .fs12 {
      display: inline-block;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      height: 35px;
    }
  }
  .open {
    text-align: center;
    margin-top: 10px;
    position: absolute;
    left: 45%;
    bottom: 12px;
    button {
      border: 0px solid #fff !important;
    }
    span {
      font-size: 20px;
      color: #2e83d3;
      display: inline-block;
      margin: 0 13px;
      cursor: pointer;
    }
  }
  .w150 {
    width: 130px !important;
  }
  .save {
    margin: 0px 0 10px;
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
    margin-right: 10px;
    line-height: 28px;
    color: #444;
    width: 15%;
  }
  .flr {
    float: right;
    text-align: right;
  }
  .col {
    span {
      color: #fff !important;
    }
  }
  .search {
    margin: 0px 0 10px;
  }
  .item {
    line-height: 20px;
    .wrp {
      padding: 10px 10px 10px 0;
      border-bottom: 1px solid #eee;
      min-height: 78px;
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
      margin: -4px 0 0;
      li {
        float: left;
        width: 100%;
        // margin-bottom: 5px;
        text-align: right;
        i {
          font-size: 16px;
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
.el-input--mini .el-input__inner {
  height: 28px !important;
  line-height: 28px !important;
}
.chose {
  display: flex;
  /* display: -webkit-flex; */
  /* justify-content: space-between; */
  /* flex-direction: row; */
  height: 100%;
  .vant {
    flex-wrap: wrap;
    align-content: space-between;
    display: flex;
    height: 100%;
    flex: 1;
    .masck {
      margin-left: 30px;
      button {
        color: #fff;
        background-color: #2e83d3;
        border-color: #2e83d3;
      }
    }
    .box {
      margin-bottom: 30px;

      display: flex;
      align-items: center;
      width: 18%;
      height: 100%;
      p {
        padding: 0 0 0 10px;
        width: 100%;
        text-align: center;
      }
      .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
    }
  }
}
.text {
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    border-bottom: 1px solid #eee;
    line-height: 20px;
    padding: 10px 10px 10px 0;
    min-height: 78px;
    .title {
      width: 12.5%;
      box-sizing: border-box;
      font-size: 12px;
    }
    .content {
      display: flex;
      flex-direction: column;
      width: 87.5%;
      p {
        font-size: 12px;
        /* color: #cccccc;   */
      }
      span {
        margin-top: 8px;
        font-size: 12px;
        color: #cccccc;
        border:none;
        cursor:auto;
        /* margin-top: 10px; */
      }
    }
  }
}
</style>