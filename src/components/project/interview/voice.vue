<template>
  <div id='soundRecording'>
    <div>
      <!-- 创建框 -->
      <div v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_VOICE_ADMIN}">
        <el-row style="overflow: hidden">
          <div class="add">
            <span style="float: left"><i class="el-icon-folder-add fw"></i></span>
            <div style="float: left">
              <el-upload
                action="#"
                :multiple='true'
                :file-list="fileList"
                :on-change="handleChange"
                :http-request="handleRequest">
                <span style='color: #2e83d3;font-weight: 500;cursor: pointer'>上传录音</span>
              </el-upload>
              <el-progress v-if="progressPercent && progressPercent != 100" :stroke-width="16" :percentage="progressPercent"></el-progress>
            </div>
          </div>
          <div class="add" @click="deleteMore"><span class="iconfont fw">&#xe606;</span><span>批量删除</span></div>
        </el-row>
      </div>

      <!-- 列表 -->
      <div class="nav">
        <el-table ref="workerList"
        :data="workerList"
        size='small'
        :row-key="getRowKeys"
        class="workerForm"
        v-loading='loading'
        @selection-change="handleSelectionChange"
        style="width: 100%">
          <el-table-column type="selection" width="45" :reserve-selection="true" align='center'></el-table-column>
          <el-table-column label="#" type="index" width="45" align='center'></el-table-column>
          <el-table-column label="录音名称" prop='name' align='center'></el-table-column>
          <el-table-column label="创建时间" prop='createTime' align='center' width='170'></el-table-column>
          <el-table-column label="时长" prop='duration' align='center' width='100'></el-table-column>
          <el-table-column label="大小" prop='fileSize' align='center' width='100'></el-table-column>
          <el-table-column label="上传人" prop='userName' align='center' width='90'></el-table-column>
          <el-table-column label="上传时间" prop='uploadTime' align='center' width='170'></el-table-column>
          <el-table-column label="操作" align='center'  width='200'>
            <template slot-scope="scope">
              <div class="cao">
                <span><el-button size='mini' class="mini" plain type='primary' @click="open(scope.row)"><span>播放</span></el-button></span>
                <span><el-button size='mini' class="mini" type='warning' plain @click="edit(scope.row)"><span>编辑</span></el-button></span>
                <span><el-button size='mini' class="mini" plain type='success'><span @click="downVoice(scope.row.id)">下载</span></el-button></span>
                <span v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_VOICE_ADMIN}">
                  <el-button size='mini' class="mini" plain type='danger' @click="detail(scope.row.id)"><span>删除</span></el-button>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="workerList.length > 0">
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

      <!-- 修改录音名称 -->
      <el-dialog
        title="修改录音名称"
        :visible.sync="dialogVisibleVoice"
        width="30%"
        :before-close="handleCloseVoice">
        <el-row>
          <el-col :span='4'>
            <span style="line-height: 28px;" class="fs12">录音名称：</span>
          </el-col>
          <el-col :span='20'>
            <el-input size='mini' v-model="voiceName" style="width: 100%"></el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size='mini' class="mini" @click="handleCloseVoice"><span>取 消</span></el-button>
          <el-button size='mini' class="mini" type="primary" @click="editVoiceName"><span>确 定</span></el-button>
        </span>
      </el-dialog>
      <!-- 上传录音 -->
      <el-dialog :before-close="closeVoice" title="录音文件播放" :visible.sync="dialogVoice" width="40%" top='20vh' class="dia">
        <div>
          <aplayer ref='player' style="width: 100%" :autoplay='false' id="aplayer" theme='#2e83d3' :music='musicObj' :list="voiceList"/>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Aplayer from 'vue-aplayer'
import 'APlayer/dist/APlayer.min.css';
export default {
  components: {Aplayer},
  data () {
    return {
      // 获取row的key值
      getRowKeys(row) {
        return row.id;
      },
      interName: null,
      interviewId: '',
      musicObj: { 
        src: 'https://i.ringdata.com/'
      },
      voiceList: [],
      voiceName: null,
      voiceId: null,
      dialogVisibleVoice: false,
      progressPercent: null,
      voiceIndex: null,
      uploadAttachmentUrl: this.baseUrl + '/interview/upload/file?access_token=', //上传录音路径
      fileList: [],
      attachPath: '',
      projectId: null,
      breadcrumbList: [
        {
          name: '访谈',
          path: '/talk'
        }, {
          name: '录音',
        }
      ],
      workerList: [],
      dialogVoice: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      interviewIdArr: [], // 选择的id集合
      file: null,
      flag: false,
      multipleSelection: [],  // 选择的数据集合
    }
  },
  created () {
    this.interName = this.$route.query.ina
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/talk',
      interviewName: this.interName,
      interviewId: this.$route.query.inId
    })
    this.projectId = this.$route.query.id
    this.interviewId = this.$route.query.inId
    this.getList()
  },
  methods: {
    // 打开编辑录音名称
    edit (row) {
      this.voiceId = row.id
      this.voiceName = row.name
      this.dialogVisibleVoice = true
    },
    // 关闭编辑录音名称对话框
    handleCloseVoice () {
      this.voiceName = null
      this.dialogVisibleVoice = false
    },
    // 修改录音名称
    editVoiceName (row) {
      let params = {
        "fileId": this.voiceId,
        "name": this.voiceName,
        "projectId": +this.projectId
      }
      this.httpPost('/interview/update/filename', params).then(res => {
        if (res.code == 0) {
          this.getList()
          this.dialogVisibleVoice = false
          this.voiceName = null
          this.$message({type: 'success', message: res.message})
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch (error => {
          this.$message({type: 'error', message: error})
      })
    },
    // 上传列表状态变化时触发
    handleChange(file, fileList) {
      this.file = file
      if (!this.videoReg(file.name)) {
        this.$message({type: 'warning', message: '仅支持mp3格式的录音文件'})
        this.flag = false
        this.fileList = []
        return;
      } else {
        this.flag = true
      }
      let isLt100M = this.beforeAvatarUpload(this.file)
      if (!isLt100M) {
        this.flag = false
        this.fileList = []
        return
      } else {
        this.flag = true
      }
    },
    // 匹配文件类型为音频
    videoReg (val) {
      if (!/\.(mp3)+$/.test(val)) {
        return false
      } else {
        return true
      }
    },
    handleRequest (data) {
      if (!this.flag) {
        this.fileList = []
        return
      }
      var formData = new FormData();
      formData.append("interviewId", +this.interviewId);
      formData.append("fileType", 1);
      formData.append("file", this.file.raw);
      const config = {
        headers: {
          'Accept': 'application/json;charset=UTF-8',
          'Content-Type': 'multipart/form-data',
          'Authorization': this.$cookies.get("tokenWeb") ? 'Bearer ' + this.$cookies.get("tokenWeb") : ""
        },
        withCredentials: false,
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(2))
        }
      }
      axios.post(this.baseUrl + '/interview/upload/file/' + this.projectId, formData, config).then(res => {
        if (res.data.code == 0) {
          this.$message({type: 'success', message: res.data.message})
          this.fileList = []
          this.getList()
        } else {
          this.$message({type: 'error', message: res.data.message})
          this.fileList = []
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
        this.fileList = []
      })
    },
    // 获取录音列表
    getList () {
      this.loading = true
      let params = {
        interviewId: +this.interviewId,
        projectId: +this.projectId,
        type: 1,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.voiceList = []
      this.httpPost('/interview/voice', params).then(res => {
        if (res.code == 0) {
          this.workerList = res.data.data
          this.workerList.forEach(item => {
            let obj = {
              title: item.name,
              author: item.userName,
              url: this.baseUrl + item.filePath,
              pic: null,
            }
            this.voiceList.push(obj)
          })
          this.total = res.data.total
          this.loading = false
          this.interviewIdArr = []
          this.multipleSelection = []
        } else {
          this.$message({type: 'error', message: res.message})
          this.loading = false
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
        this.loading = false
      })
    },
    // 打开播放器
    open (row) {
      this.dialogVoice = true
      this.musicObj = {
        title: row.name,
        author: row.userName,
        src: this.baseUrl + row.filePath,
        pic: this.baseUrl + row.backGround,
      }
      this.voiceList.forEach((item, index) => {
        if (item.id == row.id) {
          this.voiceIndex = index
        }
      })
    },
    // 关闭录音弹框
    closeVoice () {
      let aplayer = this.$refs.player;
      aplayer.pause();
      this.dialogVoice = false
    },
    // 限制录音大小
    beforeAvatarUpload(file) {
      const isLt100M = file.size / 1024 / 1024 < 400;
      if (!isLt100M) {
        this.$message.error('上传录音文件大小不能超过 400MB!');
      }
      return isLt100M;
    },
    // 下载
    downVoice (id) {
      window.location.href = this.baseUrl + "/interview/file/download?fileId=" + id;
    },
    // 删除方法
    deleteItem (item) {
      let params = {
        fileIds: item,
        projectId: +this.projectId
      }
      this.httpPost('/interview/delete/voice', params).then(res => {
        if (res.code == 0) {
          this.getList()
          this.$message({type: 'success', message: res.message})
          this.interviewIdArr = []
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    // 批量删除
    deleteMore () {
      if (this.interviewIdArr.length <= 0) {
        this.$message({type: 'warning', message: '请选择要删除的录音'})
        return
      }
      this.$confirm('此操作将永久删除该录音, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteItem(this.interviewIdArr)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 单次删除
    detail (id) {
      this.$confirm('此操作将永久删除该录音, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.interviewIdArr = []
        this.interviewIdArr[0] = id
        this.deleteItem(this.interviewIdArr)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 列表选择状态改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.interviewIdArr = [];
      if (val) {
        val.forEach(row => {
          if (row) {
            this.interviewIdArr.push(row.id);
          }
        });
      }
    },
    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList()
    },
  }
}
</script>

<style scoped>
  #soundRecording>>>.el-progress-bar__outer {
    height: 3px !important;
    border-radius: 100px;
    background-color: #EBEEF5;
    overflow: hidden;
    position: relative;
    vertical-align: middle;
  }
  #soundRecording>>>.el-upload-list__item-name {
    font-size: 12px;
  }
  #soundRecording>>>.el-progress__text {
    font-size: 12px !important;
    color: #606266;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    line-height: 1;
  }
  #soundRecording>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  #soundRecording>>>.aplayer .aplayer-info {
    margin-left: 0px;
    padding: 14px 7px 0 10px;
    height: 66px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
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
  #soundRecording>>>.el-pagination span{
    font-size: 12px;
  }
  #soundRecording>>>.el-button--mini {
    padding: 3px 7px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 3px;
  }
  #soundRecording>>>.el-table th, .el-table td {
    padding: 7px 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: center;
  }
  #soundRecording>>>.el-table__header {
    table-layout: fixed;
    border-collapse: separate;
    background-color: #3e4b6b33;
  }
  #soundRecording>>>.el-table th>.cell {
    color: #888;
  }
</style>
<style lang='scss' scoped>
  #soundRecording{
    .add{
      overflow: hidden;
      margin: 0px 40px 20px 0;
      float: left;
      .fw{
        font-size: 15px;
        font-weight: bold;
      }
      span{
        color: #2e83d3;
        padding-right: 5px;
        font-weight: 500;
        cursor: pointer;
      }
    }
    .cao{
      overflow: hidden;
    }
    .drop{
      width: 122px;
      margin-bottom: 15px;
    }
  }
</style>
