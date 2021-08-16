<template>
  <div id='annex'>
    <div>
      <!-- 创建框 -->
      <div>
        <el-row style="overflow: hidden" v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_FILE_ADMIN}">
          <div class="add">
            <span style="float: left" class="iconfont fw">&#xe632;</span>
            <div style="float: left">
              <el-upload
                action="#"
                :multiple='true'
                :file-list="fileList"
                :on-change="handleChange"
                :http-request="handleRequest">
                <span style='color: #2e83d3;font-weight: 500;cursor: pointer'>上传附件</span>
              </el-upload>
              <el-progress v-if="progressPercent && progressPercent != 100" :stroke-width="16" :percentage="progressPercent"></el-progress>
            </div>
          </div>
          <div class="add"  @click="deleteMore"><span class="iconfont fw">&#xe606;</span><span>批量删除</span></div>
        </el-row>
      </div>

      <!-- 列表 -->
      <div class="nav">
        <el-table ref="workerList"
        :data="workerList"
        size='small'
        class="workerForm"
        v-loading='loading'
        @selection-change="handleSelectionChange"
        style="width: 100%">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column label="#" type="index" width="45"></el-table-column>
          <el-table-column label="附件" align='center' prop='type' width='200'>
            <template slot-scope="scope">
              <div class="file">
                <div v-if="scope.row.type == 1" class="img">
                  <img :src="scope.row.filePath" alt="">
                  <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="srcList" />
                </div>

                <div class="name" v-if="scope.row.type == 2">{{ scope.row.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="附件名称" prop='name' align='center'></el-table-column>
          <el-table-column label="大小" prop='fileSize' align='center' width='100'></el-table-column>
          <el-table-column label="上传人" prop='userName' align='center' width='90'></el-table-column>
          <el-table-column label="上传时间" prop='uploadTime' align='center' width='170'></el-table-column>
          <el-table-column label="操作" align='center'  width='220'>
            <template slot-scope="scope">
              <div class="cao">
                <el-button v-if="scope.row.type == 1" size='mini' class="mini" @click="onPreview" plain type='primary'><span>预览</span></el-button>
                <span><el-button size='mini' class="mini" type='warning' plain @click="edit(scope.row)"><span>编辑</span></el-button></span>
                <el-button v-if="scope.row.type == 2" size='mini' class="mini" plain type='primary'><span @click="openVideo(scope.row.name,scope.row.userName,scope.row.filePath, scope.row.id, scope.row.backGround)">播放</span></el-button>
                <el-button size='mini' class="mini" plain type='success'><span @click="downVoice(scope.row.id)">下载</span></el-button>
                <span v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_FILE_ADMIN}">
                  <el-button size='mini' class="mini"  plain type='danger'  @click="detail(scope.row.id)"><span>删除</span></el-button>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="workerList.length > 0">
          <el-pagination
            @size-change="handleSizeChange()"
            @current-change="handleCurrentChange()"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'>
          </el-pagination>
        </div>
      </div>

      <!-- 修改附件名称 -->
      <el-dialog
        title="修改附件名称"
        :visible.sync="dialogVisibleAnnex"
        width="30%"
        :before-close="handleCloseAnnex">
        <el-row>
          <el-col :span='4'>
            <span style="line-height: 28px;" class="fs12">附件名称：</span>
          </el-col>
          <el-col :span='20'>
            <el-input size='mini' v-model="AnnexName" style="width: 100%"></el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size='mini' class="mini" @click="handleCloseAnnex"><span>取 消</span></el-button>
          <el-button size='mini' class="mini" type="primary" @click="editAnnexName"><span>确 定</span></el-button>
        </span>
      </el-dialog>
      <!-- 上传录音 -->
      <el-dialog title="录音文件播放" :visible.sync="dialogVoice" :before-close="closeVoice" width="40%" top='20vh' class="dia">
        <div>
          <aplayer ref='player' style="width: 100%" :autoplay='false' id="aplayer" theme='#2e83d3' :music='musicObj' :list="voiceList"/>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import Aplayer from 'vue-aplayer'
import 'APlayer/dist/APlayer.min.css';
export default {
  components:{
    ElImageViewer, Aplayer
  },
  data () {
    return {
      interName: null,
      dialogVisibleAnnex: false,
      AnnexId: null,
      AnnexName: null,
      dialogVoice: false,
      musicObj: { 
        src: 'https://i.ringdata.com/'
      },
      status: null,
      progressPercent: null,
      interviewId: '',
      projectId: null,
      uploadAttachmentUrl: this.baseUrl + '/interview/upload/file?access_token=', //上传实验附件路径
      fileList: [],
      attachPath: '',
      fileName: '',
      breadcrumbList: [
        {
          name: '访谈',
          path: '/talk'
        }, {
          name: '附件',
        }
      ],
      workerList: [],
      showViewer: false,
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [],
      voiceList: [],
      voiceIndex: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      multipleSelection: [],
      interviewIdArr: [],
      file: null,
      voices: [],
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
    // 打开编辑附件名称
    edit (row) {
      this.AnnexId = row.id
      this.AnnexName = row.name
      this.dialogVisibleAnnex = true
    },
    // 关闭编辑附件名称对话框
    handleCloseAnnex () {
      this.AnnexName = null
      this.dialogVisibleAnnex = false
    },
    // 修改附件名称
    editAnnexName (row) {
      let params = {
        "fileId": this.AnnexId,
        "name": this.AnnexName,
        "projectId": +this.projectId
      }
      this.httpPost('/interview/update/filename', params).then(res => {
        if (res.code == 0) {
          this.getList()
          this.dialogVisibleAnnex = false
          this.AnnexName = null
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
      let isLt100M = this.beforeAvatarUpload(this.file)
      if (!isLt100M) {
        return
      }
    },
    // 限制录音大小
    beforeAvatarUpload(file) {
      const isLt100M = file.size / 1024 / 1024 < 400;
      if (!isLt100M) {
        this.$message.error('上传附件大小不能超过 400MB!');
      }
      return isLt100M;
    },
    handleRequest (data) {
      var formData = new FormData();
      formData.append("interviewId", +this.interviewId);
      formData.append("fileType", 2);
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

    // 打开播放录音弹框
    openVideo (name, uploadName, path, id, backGround) {
      this.dialogVoice = true
      this.musicObj = {
        title: name,
        author: uploadName,
        src: path,
        pic: this.baseUrl+backGround,
      }
      this.voiceList.forEach((item, index) => {
        if (item.id == id) {
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
    // 下载
    downVoice (id) {
      window.location.href = this.baseUrl + "/interview/file/download?fileId=" + id;
    },
    // 获取附件列表
    getList () {
      this.voiceList = []
      let params = {
        interviewId: +this.interviewId,
        type: 2,
        projectId: +this.projectId,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.httpPost('/interview/file', params).then(res => {
        if (res.code == 0) {
          this.srcList = []
          this.workerList = res.data.data
          this.total = res.data.total
          this.workerList.forEach(item => {
            if (this.imgReg(item.filePath)) {
              item.type = 1 // 图片
              item.filePath = this.baseUrl + item.filePath
              this.srcList.push(item.filePath)
            } else if (this.videoReg(item.filePath)) {
              item.type = 2
              item.filePath = this.baseUrl + item.filePath
              let obj = {
                title: item.name,
                author: item.userName,
                url: item.filePath,
                pic: null,
              }
              this.voiceList.push(obj)
            }
          })
        } else {
          this.$message({type: 'error', message: error})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    onPreview() {
     this.showViewer = true
    },
    closeViewer() {
     this.showViewer = false
    },
    // 删除方法
    deleteItem (item) {
      let params = {
        fileIds: item,
        projectId: +this.projectId
      }
      this.httpPost('interview/delete/file', params).then(res => {
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
        this.$message({type: 'warning', message: '请选择要删除的附件'})
        return
      }
      this.$confirm('此操作将永久删除该附件, 是否继续?', '提示', {
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
      this.$confirm('此操作将永久删除该附件, 是否继续?', '提示', {
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
      this.interviewIdArr = []
      val.forEach(item => {
        this.interviewIdArr.push(item.id)
      })
    },
    // 获取文件后缀名
    getFileType (filePath) {
      var startIndex = filePath.lastIndexOf(".");
      if(startIndex != -1)
        return filePath.substring(startIndex+1, filePath.length).toLowerCase();
      else return ""
    },
    // 匹配文件类型为图片
    imgReg (val) {
      if (!/\.(jpg|gif|jpeg|png|JPG|PNG|GIF)+$/.test(val)) {
        return false
      } else {
        return true
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
    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  }
}
</script>

<style scoped>
  #annex>>>.el-progress-bar__outer {
    height: 3px !important;
    border-radius: 100px;
    background-color: #EBEEF5;
    overflow: hidden;
    position: relative;
    vertical-align: middle;
  }
  #annex>>>.el-progress__text {
    font-size: 12px !important;
    color: #606266;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    line-height: 1;
  }
  #annex>>>.el-upload-list__item-name {
    font-size: 12px;
  }
  .nav>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  #annex>>>.el-button {
    margin-left: 0px;
  }
  #annex>>>.aplayer-bar-wrap .aplayer-bar .aplayer-played .aplayer-thumb {
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
  #annex>>>.aplayer-pic .aplayer-play .aplayer-icon-play {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 20px;
    width: 20px;
  }
  #soundRecording>>>.aplayer .aplayer-icon-back, .aplayer .aplayer-icon-forward, .aplayer .aplayer-icon-lrc, .aplayer .aplayer-icon-order, .aplayer .aplayer-icon-play {
    display: block !important;
  }
  #annex>>>.aplayer-icon-play{
    display: block !important;
  }
  #annex>>>.aplayer-pic .aplayer-pause .aplayer-icon-pause {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 12px;
    width: 12px;
  }
  #annex>>>.el-pagination span{
    font-size: 12px;
  }
  #annex>>>.el-button--mini {
    padding: 3px 7px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 3px;
  }
  .annex>>>.el-table th, .el-table td {
    padding: 7px 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: center;
}
  .workerForm>>>.el-table__header {
    table-layout: fixed;
    border-collapse: separate;
    background-color: #3e4b6b33;
  }
  .nav>>>.el-table th>.cell {
    color: #888;
  }
</style>
<style lang='scss' scoped>
  #annex{
    .add{
      margin: 0px 40px 20px 0;
      float: left;
      .fw{
        font-size: 15px;
        font-weight: bold;
      }
      span{
        color: #2e83d3;
        padding-right: 3px;
        font-weight: 500;
        cursor: pointer;
      }
    }
    .cao{
    }
    .file{
      .img{
        width: 100%;
        text-align: center;
        img{
          width: 100px;
          max-height: 60px !important;
        }
      }
      .name{
        font-size: 12px;
      }
    }
    .drop{
      width: 122px;
      margin-bottom: 15px;
    }
  }
</style>
