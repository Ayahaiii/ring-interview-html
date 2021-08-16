<template>
  <div id='soundRecording'>
    <div v-loading='loading'>
      <!-- 录音区 -->
      <div class="voice">
        <el-col :span='3'>
          <div class="drop" style="width: 90%">
            <el-select size='mini' v-model="voice" @change="changeVoiceFile" placeholder='请选择录音'>
              <el-option v-for="item in voiceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span='21' style="margin-bottom: 20px;padding-right: 7px;">
          <aplayer ref='player' style="width: 100%" :music='musicObj' :autoplay='false' id="aplayer" theme='#2e83d3' />
          <div class="open">
            <el-button size='mini' class="mini" @click="prevVoice" :disabled='firstBtn'><span class="iconfont">&#xe603;</span></el-button>
            <el-button size='mini' class="mini" @click="nextVoice" :disabled='lastBtn'><span class="iconfont">&#xe602;</span></el-button>
          </div>
        </el-col>
      </div>
      <div>
        <el-row>
          <el-col :span='24'>
            <div style="text-align: right;margin-bottom: 10px">
              <span style="vertical-align: middle;" class="fs12">显示录音详情：</span><el-switch v-model="isShowNav" active-color="#2e83d3" inactive-color="#ccc"></el-switch>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 校对模式列表 -->
      <div style='min-height: 400px'>
        <div v-for="(item, index) in list" :key="'jiao'+index" class="item">
          <el-row class="jiao" v-bind:style="{background: item.type == 3 ? '#fafafa' : '#fff'}">
            <el-row @dblclick.native="editItem(item.id)" class="bgc">
              <el-col :span='3'><div class="name"><span class="fs12" v-bind:style="{color: item.type == 3 ? '#2e83d3' : '#444'}">{{ item.speakName }} :</span></div></el-col>
              <el-col :span='21' v-bind:class="{'current': active == item.id}">
                <div class="txt" v-if="active != item.id"><span class="fs12">{{ item.paragraph }}</span></div>
                <div class="text" v-if="active == item.id"><el-input size='mini' :autosize="{ minRows: 4, maxRows: 8}" v-model="saveObj.speakText" type='textarea'></el-input></div>
                <div style="margin: 10px 0 0;overflow:hidden;" v-if="isShowNav">
                  <el-row>
                    <span class="vItem" style='width: 180px'><span class="fs10">录音：{{ item.fileName }}</span></span>
                    <span class="vItem" style='width: 140px'><span class="fs10" v-if="item.beginTime">开始：{{ item.beginTime }}</span></span>
                    <span class="vItem" style='width: 140px'><span class="fs10" v-if="item.duration">时长：{{ item.duration ? formatDuring(item.duration) : '0s' }}</span></span>
                    <span class="vItem flr" style="margin-right: 0;width: 240px"><span class="fs10">录入时间：{{ item.createTime }}</span></span>
                    <span class="vItem flr" style='width: 120px'><span class="fs10">录入员：{{ item.createName }}</span></span>
                  </el-row>
                </div>
              </el-col>
            </el-row>
            <el-row v-if="active == item.id" style="margin-top: -10px;">
              <el-col :span='24'><el-button type='primary' size='mini' class="mini fr col save" @click="saveItem(item.id)"><span>保存</span></el-button></el-col>
            </el-row>
          </el-row>
        </div>

        <!-- 暂无数据 -->
        <div v-if="noMessage" style='text-align: center;margin: 100px 0;color: #666'>暂无数据 . . . </div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="list.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total='total'>
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable';
import Aplayer from 'vue-aplayer'
import 'APlayer/dist/APlayer.min.css';
export default {
  components: {vuedraggable, Aplayer},
  data () {
    return {
      interName: null,
      isShowNav: false,
      interviewId: null,
      projectId: null,
      editorId: null,
      voice: '',
      status: null,
      list: [],
      voiceList: [],
      voiceArr: [],
      voiceIndex: null,
      lastBtn: false,
      firstBtn: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      active: null,
      done: false,
      noMessage: false,
      musicObj: {
        title: '',
        author: '',
        src: 'https://i.ringdata.com/',
        pic: null,
      },
      saveObj: {
        speaker: '',
        voiceName: '',
        startTime: '',
        endTime: '',
        voiceDuration: '',
        speakText: '',
      },
    }
  },
  created () {
    this.loading = true
    this.interName = this.$route.query.ina
    this.projectId = this.$route.query.id
    this.interviewId = this.$route.query.inId
    this.status = +this.$route.query.sta
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/talk',
      interviewName: this.interName
    })
    this.getVoiceList()
  },
  methods: {
    // 获取录入文本列表
    getWriteList () {
      this.list = []
      var params;
        params = {
          interviewId: +this.interviewId,
          fileId: this.voice,
          projectId: +this.projectId,
          pageSize: this.pageSize,
          pageNum: this.currentPage,
        }
      this.httpPost('interview/list/paragraph', params).then(res => {
        if (res.code == 0) {
          this.list = res.data.data
          this.total = res.data.total
          if (this.total <= 0) {
            this.noMessage = true
          } else {
            this.noMessage = false
          }
          this.loading = false
        } else {
          this.loading = false
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.loading = false
        this.$message({type: 'error', message: error})
      })
    },

    // 获取录音列表
    getVoiceList () {
      this.voiceList = []
      let params = {
        interviewId: this.interviewId,
        type: 1,
        projectId: +this.projectId
      }
      this.httpPost('/interview/file', params).then(res => {
        if (res.code == 0) {
          this.$emit('getSamllChild', {
            interviewName: this.interName
          })
          res.data.data.forEach(item => {
            let obj = {}
            obj.label = item.name
            obj.value = item.id
            this.voiceList.push(obj)
            let vObj = {
              title: item.name,
              author: item.userName,
              src: this.baseUrl + item.filePath,
              //pic: this.baseUrl + item.backGround,
            }
            this.voiceArr.push(vObj)
          })
          this.voice = this.voiceList[0].value
          this.musicObj = this.voiceArr[0]
          this.voiceIndex = 0
          this.getWriteList()
        } else {
          this.loading = false
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.loading = false
        this.$message({type: 'error', message: "请先上传录音文件"})
      })
    },

    // 校对模式编辑文本
    editItem (id) {
      this.active = id
      this.editorId = id
      this.getDetail(id, this.saveObj)
    },

    // 获取详情
    getDetail (val, obj) {
      let params = {
        paragraphId: val,
        projectId: +this.projectId
      }
      this.httpPost('/interview/detail/paragraph/', params).then(res => {
        if (res.code == 0) {
          let resData = res.data
          this.editorId = resData.id
          obj.speakText = resData.paragraph
          obj.startTime = resData.beginTime
          obj.endTime = resData.endTime
          obj.voiceName = resData.name
          obj.voiceDuration = resData.duration
          obj.speaker = resData.speakId
          this.voice = resData.fileId
        }
      })
    },

    // 校对模式保存文本
    saveItem (id) {
      if (!this.voice) {
        this.$message({type: 'warning', message: '请选择录音'})
        return
      }
      if (!this.saveObj.speakText || this.saveObj.speakText.trim() == '') {
        this.$message({type: 'warning', message: '请输入对话文本'})
        return
      }
      let params = {
          id: this.editorId,
          projectId: this.projectId,
          fileId: this.voice,
          status: this.status,
          interviewId: this.interviewId,
          speakId: this.saveObj.speaker,
          beginTime: this.saveObj.startTime,
          endTime: this.saveObj.endTime,
          paragraph: this.saveObj.speakText,
          name: this.saveObj.voiceName,
          duration: this.saveObj.voiceDuration
        }
      this.writeSaveDialogue(params, this.saveObj)
    },

    // 录入模式保存对话文本
    writeSaveDialogue (params, obj) {
      this.httpPost('interview/save/paragraph', params).then(res => {
        if (res.code == 0) {
          obj.speakText = ''
          obj.startTime = ''
          obj.endTime = ''
          obj.voiceDuration = ''
          this.active = null
          this.getWriteList()
          this.$message({type: 'success', message: res.message})
        } else {
          obj.speakText = ''
          obj.startTime = ''
          obj.endTime = ''
          obj.voiceDuration = ''
          this.active = null
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },

    // 切换录音文件
    changeVoiceFile (val) {
      this.voiceList.forEach((item, index) => {
        if (item.value == val) {
          let aplayer = this.$refs.player
          aplayer.pause()
          this.musicObj = {
            title: this.voiceArr[index].title,
            author: this.voiceArr[index].author,
            src: this.voiceArr[index].src,
            pic: this.voiceArr[index].pic,
          }
          aplayer.play()
        }
      })
      this.getWriteList()
    },

    prevVoice () {
      this.lastBtn = false
      this.voiceIndex = this.voiceIndex - 1
      if (this.voiceIndex >= 0) {
        let aplayer = this.$refs.player
        aplayer.pause()
        this.musicObj = {
          title: this.voiceArr[this.voiceIndex].title,
          author: this.voiceArr[this.voiceIndex].author,
          src: this.voiceArr[this.voiceIndex].src,
          pic: this.voiceArr[this.voiceIndex].pic,
        }
        this.voice = this.voiceList[this.voiceIndex].value
        this.firstBtn = false
        aplayer.play()
        this.getWriteList()
      } else {
        this.$message({type: 'warning', message: '当前是第一段录音'})
        this.firstBtn = true
        this.voiceIndex = this.voiceIndex + 1
        return
      }
    },

    nextVoice () {
      this.firstBtn = false
      this.voiceIndex = this.voiceIndex + 1
      if (this.voiceIndex < this.voiceArr.length) {
        let aplayer = this.$refs.player
        aplayer.pause()
        this.musicObj = {
          title: this.voiceArr[this.voiceIndex].title,
          author: this.voiceArr[this.voiceIndex].author,
          src: this.voiceArr[this.voiceIndex].src,
          pic: this.voiceArr[this.voiceIndex].pic,
        }
        this.voice = this.voiceList[this.voiceIndex].value
        this.lastBtn = false
        aplayer.play()
        this.getWriteList()
      } else {
        this.$message({type: 'warning', message: '当前是最后一段录音'})
        this.lastBtn = true
        this.voiceIndex = this.voiceIndex - 1
        return
      }
    },

    // 格式化毫秒
    formatDuring(mss) {
      var minutes = Math.floor((mss/1000/60) << 0)
      var seconds = Math.floor((mss/1000) % 60);
      return minutes + " m " + seconds + " s ";
    },

    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val
      this.getWriteList()
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getWriteList()
    },
  }
}
</script>

<style scoped>
  #soundRecording>>>.aplayer .aplayer-info {
    margin-left: 0px;
    padding: 14px 7px 12px 10px;
    height: 66px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  #soundRecording>>>.aplayer {
    font-family: Arial,Helvetica,sans-serif;
    color: #000;
    background-color: #fff;
    margin: 0px 5px 5px 0;
    -webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,.07), 0 1px 5px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.07), 0 1px 5px 0 rgba(0,0,0,.1);
    border-radius: 2px;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    line-height: normal;
    position: relative;
  }
  #soundRecording>>>.el-input-number__decrease {
    width: 15px !important;
    font-size: 10px;
  }
  #soundRecording>>>.aplayer .aplayer-body .aplayer-info .aplayer-music {
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
  #soundRecording>>>.aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-loaded {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: #a7cdf0;
    height: 2px;
    -webkit-transition: all .5s ease;
    transition: all .5s ease;
  }
  #soundRecording>>>.el-input-number--mini .el-input__inner {
    padding-right: 15px;
    padding-left: 0px;
  }
  #soundRecording>>>.el-input-number--mini {
    width: 50px;
    margin-right: 3px;
    line-height: 26px;
  }
  #soundRecording>>>.aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb {
    position: absolute;
    top: 0;
    right: 5px;
    margin-top: -5px;
    margin-right: -10px;
    width: 10px;
    height: 10px;
    border: 0px solid;
    -webkit-transform: scale(.8);
    transform: scale(.8);
    will-change: transform;
    -webkit-transition: background-color .3s,border-color .3s,-webkit-transform .3s;
    transition: background-color .3s,border-color .3s,-webkit-transform .3s;
    transition: transform .3s,background-color .3s,border-color .3s;
    transition: transform .3s,background-color .3s,border-color .3s,-webkit-transform .3s;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    overflow: hidden;
  }
  #soundRecording>>>.aplayer-thumb{
    background-color: #2e83d3 !important;
  }
  #soundRecording>>>.aplayer-pic .aplayer-play .aplayer-icon-play {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 20px;
    width: 20px;
  }
  #soundRecording>>>.aplayer .aplayer-icon-back, .aplayer .aplayer-icon-forward, .aplayer .aplayer-icon-lrc, .aplayer .aplayer-icon-order, .aplayer .aplayer-icon-play {
    display: block !important;
  }
  #soundRecording>>>.aplayer-icon-play{
    display: block !important;
  }
  #soundRecording>>>.aplayer-pic .aplayer-pause .aplayer-icon-pause {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 12px;
    width: 12px;
  }
  #soundRecording>>>.aplayer .aplayer-pic {
    position: relative;
    float: left;
    height: 90px;
    width: 90px;
    background-size: cover;
    background-position: 50%;
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
    cursor: pointer;
    background-image: url("../../../assets/img/aplay.png") !important;
  }
  .drop>>>.el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
  }
  .drop>>>.el-input--mini .el-input__icon {
    line-height: 26px;
  }
</style>
<style lang='scss' scoped>
  #soundRecording{
    div{
      overflow: hidden;
    }
    .left{
      .fs12{
        display: inline-block;
      }
      span{
        display: inline-block;
        vertical-align: middle;
        height: 35px;
      }
    }
    .open{
      text-align: center;
      margin-top: 10px;
      position: absolute;
      left: 45%;
      bottom: 12px;
      button{
        border: 0px solid #fff !important;
      }
      span{
        font-size: 20px;
        color: #2e83d3;
        display: inline-block;
        margin: 0 13px;
        cursor: pointer;
      }
    }
    .w150{
      width: 130px !important;
    }
    .save{
      margin: 0px 0 10px;
    }
    .voice{
      overflow: hidden;
      .txt{
        margin: 20px 0;
        color: #2e83d3;
      }
    }
    .current{
      background-color: #eee;
      padding: 5px ;
    }
    .vItem{
      display: inline-block;
      margin-right: 10px;
      line-height: 28px;
      color: #444;
      width: 15%;
    }
    .flr{
      float: right;
      text-align: right;
    }
    .col{
      span{
        color: #fff !important;
      }
    }
    .search{
      margin: 0px 0 10px;
    }
    .item{
      line-height: 20px;
      .wrp{
        padding: 10px 10px 10px 0;
        border-bottom: 1px solid #eee;
        min-height: 78px;
        .vItem{
          color: #999;
          span{
            font-size: 10px;
          }
        }
      }
      .jiao{
        border-bottom: 1px solid #ccc;
        .vItem{
          color: #999;
          span{
            font-size: 10px;
          }
        }
        .bgc{
          margin: 10px 0;
          cursor: pointer;
          padding: 10px 0;
        }
        .current{
          background-color: #eee;
        }
      }
      .ico{
        overflow: hidden;
        margin: -4px 0 0;
        li{
          float: left;
          width: 100%;
          // margin-bottom: 5px;
          text-align: right;
          i{
            font-size: 16px;
            color: #666;
            cursor: pointer;
          }
        }
      }
      .name{
        font-size: 12px;
        padding-left: 15px;
        color: #444;
      }
      .txt{
        font-size: 12px;
        color: #444;
      }
    }
  }
</style>
