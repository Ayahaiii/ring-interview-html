<template>
  <div id="interview">
    <!-- 侧边栏 -->
    <div @click="show=false">
      <div class="brand">
        <span class="fl" style="margin:15px 0px 14px;cursor:pointer" v-if="showAside" @click="hideAside"><i class="el-icon-s-fold"></i></span>
        <span class="fl" style="margin:15px 0px 14px;;cursor:pointer" v-if="!showAside" @click="showAsideBox"><i class="el-icon-s-unfold"></i></span>
        <div class="fl" style="margin: 20px 0;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/project' }">我的访谈</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index"><span @click='goRouter(item.path)' style="cursor:pointer">{{ item.name }}</span></el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div style="">
        <div style="width: 80px; float: left;margin-right: 20px;">
          <transition name="el-zoom-in-right">
            <div v-show="showAside" class="transition-box">
              <div class="aside">
                <ul>
                  <router-link v-permission="{projectId: $route.query.id, permissionId: Constant.RP_PROJECT_VIEW}" :to="`/project/info?id=${$route.query.id}`"><li class="child" v-bind:class="{current: active == 1}" @click="changeAsideItem(1)"><span class="icon"><i class="iconfont">&#xe727;</i></span><span class="tit">详情</span></li></router-link>
                  <router-link v-permission="{projectId: $route.query.id, permissionId: Constant.RT_MEMBER_LIST}" :to="`/team?id=${$route.query.id}`"><li class="child" v-bind:class="{current: active == 3}" @click="changeAsideItem(3)"><span class="icon"><i class="iconfont">&#xe68c;</i></span><span class="tit">团队</span></li></router-link>
                  <router-link v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_LIST}" :to="`/sample?id=${$route.query.id}`"><li class="child" v-bind:class="{current: active == 2}" @click="changeAsideItem(2)"><span class="icon"><i class="iconfont">&#xe631;</i></span><span class="tit">样本</span></li></router-link>
                  <router-link v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_LIST}" :to="`/talk?id=${$route.query.id}`"><li class="child" v-bind:class="{current: active == 4}" @click="changeAsideItem(4)"><span class="icon"><i class="iconfont" style="font-size: 38px">&#xe60f;</i></span><span class="tit">访谈</span></li></router-link>
                  <router-link v-permission="{projectId: $route.query.id, permissionId: Constant.RA_STAT_LIST}" :to="`/analysis/index?id=${$route.query.id}`"><li class="child" v-bind:class="{current: active == 5}" @click="changeAsideItem(5)"><span class="icon"><i class="iconfont" style="font-size: 28px">&#xe614;</i></span><span class="tit">分析</span></li></router-link>
                  <router-link v-permission="{projectId: $route.query.id, permissionId: Constant.RM_MONITOR_LIST}" :to="`/report?id=${$route.query.id}`"><li class="child" v-bind:class="{current: active == 6}" @click="changeAsideItem(6)"><span class="icon"><i class="iconfont">&#xe834;</i></span><span class="tit">报表</span></li></router-link>
                </ul>
              </div>
            </div>
          </transition>
        </div>
        <div class="main-right" v-bind:style="{marginLeft: showAside ? '120px' : 0}">
          <div class="projectDetail" v-if="!isAnalysis">
            <!-- 标题及访谈标题 -->
            <span style="float:left;margin-right: 40px;"><span class="tit">{{title}} </span><span class="interName" v-if="interviewName"> > {{ interviewName }}</span></span>
            <!-- 返回键 -->
            <span v-if="link" class="back" @click="goteamList()"><i class="backBtn el-icon-back"></i>返回</span>
            <!-- 访谈部分菜单切换栏 -->
            <span v-if="isInterviewRouter" class="drop">
              <el-select size='mini' v-model="selectValue" @change="changeSearchValue">
                <el-option label="详情" value="1"></el-option>
                <el-option :disabled='project_status == 0' label="对话文本" value="2"></el-option>
                <el-option :disabled='project_status == 0' label="录音" value="3"></el-option>
                <el-option :disabled='project_status == 0' label="附件" value="4"></el-option>
              </el-select>
            </span>
            <!-- 访谈内容详情 -->
            <div class="flri" v-if="interStatus == 1 && isInterviewInfo"><div class="status status1">计划中</div></div>
            <div class="flri" v-if="interStatus == 2 && isInterviewInfo"><div class="status status2">执行中</div></div>
            <div class="flri" v-if="interStatus == 3 && isInterviewInfo"><div class="status status3">整理中</div></div>
            <div class="flri" v-if="interStatus == 4 && isInterviewInfo"><div class="status status4">审核中</div></div>
            <div class="flri" v-if="interStatus == 5 && isInterviewInfo"><div class="status status5">已完成</div></div>
            <div class="flri" v-if="interStatus == 1 && isInterviewInfo"><div class="check"><el-button @click="openStart" size='mini' class="btn"><span class="iconfont color">&#xe62f;</span><span class="txt"> 开始访谈</span></el-button></div></div>
            <div class="flri" v-if="interStatus == 2 && isInterviewInfo"><div class="check"><el-button @click="openEnd" size='mini' class="btn"><span class="iconfont color">&#xe607;</span><span class="txt"> 结束访谈</span></el-button></div></div>
            <div class="flri" v-if="interStatus == 3 && isInterviewInfo"><div class="check"><el-button @click="openArrange" size='mini' class="btn"><span class="iconfont color">&#xe601;</span><span class="txt"> 提交审核</span></el-button></div></div>
            <div class="flri" v-if="interStatus == 4 && isInterviewInfo"><div class="check"><el-button @click="openExamine" size='mini' class="btn"><span class="iconfont color">&#xe665;</span><span class="txt"> 审核</span></el-button></div></div>

            <!-- 审核弹框 -->
            <el-dialog
              title="提交审核"
              :before-close="handleClose"
              :visible.sync="dialog"
              width="36%">
              <div>
                <el-row style="margin-bottom: 20px">
                  <el-col :span='4'><span class="fs12">审核结果 :</span></el-col>
                  <el-col :span='20'>
                    <el-select v-model="examineValue" size='mini' placeholder="请选择审核结果">
                      <el-option
                        v-for="item in examineOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span='4'><span class="fs12">备注 :</span></el-col>
                  <el-col :span='20'>
                    <el-input size='mini' type='textarea' v-model="examineRemarks" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入备注"></el-input>
                  </el-col>
                </el-row>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button size='mini' class="mini" @click="handleClose"><span>取 消</span></el-button>
                <el-button size='mini' class="mini" type="primary" @click="submitExamine"><span>确 定</span></el-button>
              </span>
            </el-dialog>

            <!-- 访谈对话文本 -->
            <div class="flri" style="width: 150px" v-if="isInterviewText">
              <el-select size='mini' v-model="type" @change="changeType">
                <el-option label="阅读模式" value="1"></el-option>
                <el-option v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_TEXT_ADD}" label="录入模式" value="2"></el-option>
                <el-option label="校对模式" value="3"></el-option>
              </el-select>
            </div>

            <!-- 邀请码 -->
            <div v-if="!link && showYao" class='yao' @click.stop="show=!show">
              <span class="iconfont img">&#xe6bd;</span>
              <span class="tet">邀请码</span>
            </div>
          </div>
          <!-- 邀请码 -->
          <transition name="el-zoom-in-top">
            <div @click.stop="show=true">
              <div class='showBox' v-show="show">
                <p>用户通过扫码或输入邀请码可申请加入研究项目</p>
                <el-row>
                  <el-col :span='10'>
                    <div class="ewm">
                      <!--<img src="../../../assets/img/ewm.png" alt="">-->
                      <div id="qrcode" ref="qrcode"></div>
                      <span class="ling fs12">另存为</span>
                      <span class="copy fs12" @click="toClipboard">复制邀请码</span>
                    </div>
                  </el-col>
                  <el-col :span='14'>
                    <p>邀请码：<span id="copy">{{value}}</span></p>
                    <p>过期时间：</p>
                    <div class="mb" v-if="role == 2">
                      <el-date-picker
                        size='mini'
                        style="width: 100%"
                        v-model="dateValue"
                        type="datetime"
                        placeholder="请选择过期时间"
                        @change="updateInfo"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      ></el-date-picker>
                    </div>
                    <div class="mb" v-else>
                      <span>{{dateValue}}</span>
                    </div>
                    <div v-if="role == 2">
                      <div class="mb"><el-checkbox v-model="checked" @change="updateInfo"><span class="fs12">是否需要审核同意</span></el-checkbox></div>
                      <div><el-button size='mini' class="mini" @click="updateCode"><span>更新</span></el-button></div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>

          </transition>
          <div class="nav">
            <router-view @getChild="getChild" :showAside='showAside' :detailForm='detailForm' :project_status='project_status' :timeArr='timeArr' :type='type' ref="routerView" :roleId="role"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      project_status: null,
      isAnalysis: false,
      show: false,
      showAside: true,
      showYao: false,
      value: '',
      dateValue: '',
      checked: '',
      projectId: null,
      active: 1,
      breadcrumbList: [],
      title: null,
      link: null,
      status: null,
      backTitle: '',
      roleOptions: [],
      role: '',
      interviewId: null,
      interviewName: null,
      selectValue: '1',
      interStatus: null,
      dialog: false,
      examineOptions: [{value: 1, label: '审核通过'}, {value: 2, label: '退回到整理阶段'}, {value: 3, label: '退回到访谈阶段'}, {value: 4, label: '拒访'},],
      examineValue: null,
      examineRemarks: '',
      isInterviewRouter: false, // 是否是访谈部分
      isInterviewInfo: false,   // 是否是访谈详情
      isInterviewText: false,   // 是否是访谈对话文本
      isInterviewVoice: false,  // 是否是访谈录音
      isInterviewAnnex: false,  // 是否是访谈附件
      detailForm: {
        address: "",
        assistantName: "",
        auditTime: null,
        beginTime: null,
        createTime: "",
        description: "",
        docBeginTime: null,
        docEndTime: null,
        endTime: null,
        id: null,
        managerName: "",
        planDuration: null,
        planEndTime: "",
        planStartTime: "",
        planText: "",
        sampleName: "",
        status: 1,
      },           // 访谈详情数据对象
      timeArr: {},
      type: '1',   // 访谈对话文本类型
    }
  },

  created () {
    if (this.$route.query.sta) {
      this.interStatus = +this.$route.query.sta
    }
    if (this.$route.query.inId) {
      this.interviewId = +this.$route.query.inId
    }
    this.projectId = this.$route.query.id
    if (this.$route.path.indexOf('/project') != -1) {
      this.active = 1
      this.showYao = false
      this.isAnalysis = false
      this.isInterviewRouter = false
      this.isInterviewInfo = false
      this.isInterviewText = false
    } else if (this.$route.path.indexOf('/sample') != -1) {
      this.active = 2
      this.showYao = false
      this.isAnalysis = false
      this.isInterviewRouter = false
      this.isInterviewInfo = false
      this.isInterviewText = false
    } else if (this.$route.path.indexOf('/team') != -1) {
      this.active = 3
      this.showYao = true
      this.link = false
      this.isAnalysis = false
      this.isInterviewRouter = false
      this.isInterviewInfo = false
      this.isInterviewText = false
    } else if (this.$route.path.indexOf('/talk') != -1 && this.$route.path != '/talk') {
      this.active = 4
      this.showYao = false
      this.isAnalysis = false
      this.isInterviewRouter = false
      this.isInterviewInfo = false
      this.isInterviewText = false
    } else if (this.$route.path.indexOf('/analysis') != -1) {
      this.active = 5
      this.showYao = false
      this.isAnalysis = true
      this.isInterviewRouter = false
      this.isInterviewInfo = false
      this.isInterviewText = false
    } else if (this.$route.path.indexOf('/report') != -1) {
      this.active = 6
      this.showYao = false
      this.isAnalysis = false
      this.isInterviewRouter = false
      this.isInterviewInfo = false
      this.isInterviewText = false
    }
    // 访谈列表
    if (this.$route.path == '/talk') {
      this.active = 4
      this.showYao = false
      this.isAnalysis = false
      this.isInterviewRouter = false
      this.isInterviewInfo = false
      this.isInterviewText = false
    }
    // 访谈详情
    if (this.$route.path.indexOf('/talk/info') != -1) {
      this.active = 4
      this.selectValue = '1'
      this.showYao = false
      this.isAnalysis = false
      this.isInterviewRouter = true
      this.isInterviewInfo = true
      this.isInterviewText = false
      this.getDetail()
    }
    // 访谈对话文本
    if (this.$route.path.indexOf('/talk/text/info') != -1 || this.$route.path.indexOf('/talk/text/edit') != -1 || this.$route.path.indexOf('/talk/text/audit') != -1) {
      this.active = 4
      this.selectValue = '2'
      this.showYao = false
      this.isAnalysis = false
      this.isInterviewRouter = true
      this.isInterviewInfo = false
      this.isInterviewText = true
      this.getDetail()
    }
    // 访谈录音
    if (this.$route.path.indexOf('/talk/voice') != -1) {
      this.selectValue = '3'
      this.active = 4
      this.showYao = false
      this.isAnalysis = false
      this.isInterviewRouter = true
      this.isInterviewInfo = false
      this.isInterviewText = false
    }
    // 访谈附件
    if (this.$route.path.indexOf('/talk/annex') != -1) {
      this.selectValue = '4'
      this.active = 4
      this.showYao = false
      this.isAnalysis = false
      this.isInterviewRouter = true
      this.isInterviewInfo = false
      this.isInterviewText = false
    }
    this.getMessage()
    this.getSampleProList()
  },

  watch: {
    $route: {
      handler: function(val, oldVal){
        this.show = false
        if (this.$route.query.inId) {
          this.interviewId = +this.$route.query.inId
        }
        if (this.$route.query.sta) {
          this.interStatus = +this.$route.query.sta
        }
        this.projectId = this.$route.query.id
        if (val.path.indexOf('/project') != -1) {
          this.active = 1
          this.showYao = false
          this.isAnalysis = false
          this.isInterviewRouter = false
          this.isInterviewInfo = false
          this.isInterviewText = false
        } else if (val.path.indexOf('/sample') != -1) {
          this.active = 2
          this.showYao = false
          this.isAnalysis = false
          this.isInterviewRouter = false
          this.isInterviewInfo = false
          this.isInterviewText = false
        } else if (val.path.indexOf('/team') != -1) {
          this.active = 3
          this.showYao = true
          this.link = false
          this.isAnalysis = false
          this.isInterviewRouter = false
          this.isInterviewInfo = false
          this.isInterviewText = false
        } else if (val.path.indexOf('/talk') != -1 && val.path != '/talk') {
          this.active = 4
          this.showYao = false
          this.isAnalysis = false
          this.isInterviewRouter = false
          this.isInterviewInfo = false
          this.isInterviewText = false
        } else if (val.path.indexOf('/analysis') != -1) {
          this.active = 5
          this.showYao = false
          this.isAnalysis = true
          this.isInterviewRouter = false
          this.isInterviewInfo = false
          this.isInterviewText = false
        } else if (val.path.indexOf('/report') != -1) {
          this.active = 6
          this.showYao = false
          this.isAnalysis = false
          this.isInterviewRouter = false
          this.isInterviewInfo = false
        }
        if (val.path == '/talk') {
          this.active = 4
          this.showYao = false
          this.isAnalysis = false
          this.isInterviewRouter = false
          this.isInterviewInfo = false
          this.isInterviewText = false
        }
        if (val.path == '/talk/info') {
          this.active = 4
          this.selectValue = '1'
          this.showYao = false
          this.isAnalysis = false
          this.isInterviewRouter = true
          this.isInterviewInfo = true
          this.isInterviewText = false
          this.getDetail()
        }
        if (val.path.indexOf('/talk/text/info') != -1 || val.path.indexOf('/talk/text/edit') != -1 || val.path.indexOf('/talk/text/audit') != -1) {
          this.active = 4
          this.selectValue = '2'
          this.showYao = false
          this.isAnalysis = false
          this.isInterviewRouter = true
          this.isInterviewInfo = false
          this.isInterviewText = true
          if (val.path.indexOf('/talk/text/info') != -1) {
            this.type = '1'
          }
        }
        if (val.path.indexOf('/talk/voice') != -1) {
          this.selectValue = '3'
          this.isInterviewRouter = true
        }
        if (val.path.indexOf('/talk/annex') != -1) {
          this.selectValue = '4'
          this.isInterviewRouter = true
        }
      },
      // 深度观察监听
      deep: true
    }
  },

  methods: {
    ...mapMutations(['setPermission','setAllProperty']),
    // 访谈详情------------------------------------------------------------------
    // 切换访谈路由
    changeSearchValue (val) {
      this.type = '1'
      if (val == '1') {
        this.$router.push({path: '/talk/info', query: {id: this.projectId, sta: this.interStatus, inId: this.interviewId, ina: this.interviewName}})
      } else if (val == '2') {
        this.$router.push({path: '/talk/text', query: {id: this.projectId, sta: this.interStatus, inId: this.interviewId, ina: this.interviewName}})
      } else if (val == '3') {
        this.$router.push({path: '/talk/voice', query: {id: this.projectId, sta: this.interStatus, inId: this.interviewId, ina: this.interviewName}})
      } else if (val == '4') {
        this.$router.push({path: '/talk/annex', query: {id: this.projectId, sta: this.interStatus, inId: this.interviewId, ina: this.interviewName}})
      }
    },
    // 切换访谈状态
    checkStatus (status) {
      // 2:开始访谈 3:结束访谈 4;提交审核 5:审核通过
      let params = {
        "interviewId": this.interviewId,
        "projectId": this.projectId,
        "status": status
      }
      var path;
      if (status != 5) {
        path = '/interview/detail/status'
      } else {
        path = '/interview/audit'
      }
      this.httpPost(path, params).then(res => {
        if (res.code == 0) {

          this.interStatus = +status
          this.getDetail()
          this.$message({type: 'success', message: res.message})
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    // 获取详情信息
    getDetail () {
      let params = {
        "interviewId": this.interviewId,
        "projectId": this.projectId,
        "status": this.interStatus
      }
      this.httpPost('/interview/detail', params).then(res => {
        if (res.code == 0) {
          var detail = {}
          var time = {}
          detail.address = res.data.address
          let arr = []
          res.data.assistantList.forEach(item => {
            arr.push(item.name)
          })
          detail.assistantName =  arr.join(",")
          detail.auditTime = res.data.auditTime
          detail.auditEndTime = res.data.auditEndTime
          detail.auditDuration = res.data.auditDuration
          time.examineTime = res.data.auditEndTime
          detail.beginTime = res.data.beginTime
          time.startTime = res.data.beginTime
          detail.createTime = res.data.createTime
          detail.description = res.data.description
          detail.docBeginTime = res.data.docBeginTime
          detail.docEndTime = res.data.docEndTime
          detail.docDuration = res.data.docDuration
          time.arrangeTime = res.data.docEndTime
          detail.endTime = res.data.endTime
          detail.interviewDuration = res.data.interviewDuration
          time.endTime = res.data.endTime
          detail.managerName = res.data.manager.name
          detail.planDuration = res.data.planDuration
          detail.planEndTime = res.data.planEndTime
          detail.planStartTime = res.data.planStartTime
          time.planTime = res.data.planStartTime
          detail.planText = res.data.planText
          detail.sampleList = res.data.sampleList
          this.interStatus = +res.data.status
          detail.status = +res.data.status
          this.detailForm = JSON.parse(JSON.stringify(detail))
          this.timeArr = JSON.parse(JSON.stringify(time))
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    openStart () {
      if (this.project_status == 0) {
        this.$message({type: 'warning', message: '准备中的项目无法开始访谈，请前往详情页启动项目'})
        return
      } else {
        this.$confirm('您还可以在云访谈APP上点击开始访谈，数据将会自动进行同步。是否仍然继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.checkStatus(2)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    openEnd () {
      this.$confirm('您还可以在云访谈APP上结束访谈，数据将会自动进行同步。是否仍然继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkStatus(3)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    openArrange () {
      this.$confirm('提交审核后，访问员将无法编辑访谈对话文本、上传录音和附件！是否仍然继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkStatus(4)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 打开审核弹框
    openExamine () {
      this.dialog = true
    },
    // 关闭审核弹框
    handleClose() {
      this.dialog = false
      this.examineValue = null
      this.examineRemarks = null
    },
    // 提交审核
    submitExamine () {
      if (!this.examineValue) {
        this.$message({type: 'warning', message: '请选择审核结果'})
        return
      }
      let params = {
        interviewId: +this.interviewId,
        valid: this.examineValue,
        projectId: +this.projectId,
        auditNote: this.examineRemarks
      }
      this.httpPost('/interview/audit', params).then(res => {
        if (res.code == 0) {
          this.dialog = false
          this.examineValue = null
          this.examineRemarks = null
          this.getDetail()
          this.$message({type: 'success', message: res.message})
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },

    // 访谈对话文本----------------------------------------------------------------------------------------
    // 切换模式
    changeType (val) {
      if (val == 1) {
        this.$router.push({path: '/talk/text/info', query: {id: this.projectId, sta: this.interStatus, inId: this.interviewId, ina: this.interName}})
      } else if (val == 2) {
        this.$router.push({path: '/talk/text/edit', query: {id: this.projectId, sta: this.interStatus, inId: this.interviewId, ina: this.interName}})
      } else if (val == 3) {
        this.$router.push({path: '/talk/text/audit', query: {id: this.projectId, sta: this.interStatus, inId: this.interviewId, ina: this.interName}})
      }
    },

    // ------------------------------------------------------------------------------------------------------
    //获取属性
    getSampleProList () {
      let _this = this
      this.httpPost(`/sample/property/get/${this.projectId}`).then(res => {
        if (res.code == 0) {
          if (res.data != null) {
            let allProperty = JSON.parse(res.data.allProperty)
            let proArr = Object.keys(allProperty)
            var proList = []
            proArr.forEach(item => {
              let allObj = {}
              allObj.key = item
              allObj.label = allProperty[item]
              if (item == 'name' || item == 'code') {
                allObj.disabled = true
                allObj.checked = true
              } else {
                allObj.disabled = false
                allObj.checked = false
              }
              proList.push(allObj)
            })
            let filterName = proList.filter(item => {
              return item.key == 'name'
            })
            let filterCode = proList.filter(item => {
              return item.key == 'code'
            })
            for (let index = 0; index < proList.length; index++) {
              const element = proList[index];
              if (element.key == 'name') {
                proList.splice(index, 1)
              } else if (element.key == 'code') {
                proList.splice(index, 1)
              }
            }
            proList.unshift(filterCode[0], filterName[0])
            this.$store.commit('setAllProperty', {
              allProperty: proList
            })
          }
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    changeAsideItem (cur) {
      this.active = cur
    },
    goRouter (item) {
      if (item) {
        this.$router.push(item + '?id=' + this.projectId + '&inId=' + this.interviewId)
      }
    },
    // 获取用户信息
    getMessage () {
      this.httpPost('/project/get/head/'+ this.projectId).then(res => {
        if (res.code == 0) {
          this.title = res.data.name
          this.role = res.data.roleId
          this.value = res.data.inviteCode
          this.project_status = res.data.status
          this.dateValue = res.data.expireTime.substring(0,10)
          this.checked = res.data.autoAudit == 1 ? true : false
          let qrcode = new QRCode('qrcode', {
            width: 132,
            height: 132,
            text: 'https://www.ringdata.com', // 二维码地址
            colorDark : "#000",
            colorLight : "#fff",
          })
        }
      })
    },
    //更新二维码
    updateCode () {
      this.httpPost(`/project/update/code/${this.projectId}`).then(res => {
        if (res.code == 0) {
          this.$refs.qrcode.lastChild.remove()
          this.getMessage()
        }
      })
    },

    //修改邀请码信息
    updateInfo () {
      let params = {
        "codeAutoAudit": this.checked ? 1 : 0,
        "codeExpireTime": this.dateValue,
        "id": this.projectId
      }
      this.httpPost(`/project/update/code/info`, params).then(res => {
        if (res.code == 0) {
          // this.$message({ type: 'success', message: res.message })
        }
      })
    },
    // 隐藏侧边栏
    hideAside () {
      this.showAside = false
    },
    // 显示侧边栏
    showAsideBox () {
      this.showAside = true
    },

    goteamList () {
      var path;
      if (this.interviewId) {
        path = this.link + '?id=' + this.projectId + '&inId=' + this.interviewId + '&ina=' + this.interviewName
      } else {
        path = this.link + '?id=' + this.projectId
      }
      this.$router.push(path)
    },
    getChild (params) {
      this.breadcrumbList  = params.breadcrumbList
      if (params.link) {
        this.link = params.link
        this.interviewId = params.interviewId
        this.status = params.status
        if (params.interviewName) {
          this.interviewName = params.interviewName
        }
      } else {
        this.link = null
        this.interviewId = null
        this.status = null
        this.interviewName = null
      }
    },
    // 复制二维码
		toClipboard (){
			const copySpan = document.getElementById('copy')
			const range = document.createRange()

			range.selectNodeContents(copySpan)
			const selection = window.getSelection()
			selection.removeAllRanges()
			selection.addRange(range)

			const copyContent = document.execCommand('copy',false,null)
			selection.removeRange(range)
			if (copyContent) {
				this.$message.success('复制成功')
			}
    }
  }
}
</script>

<style scoped>
  .check>>>.el-button--mini {
    font-size: 12px;
    border-radius: 3px;
    height: 22px;
    line-height: 20px;
    padding: 0;
    width: 100px;
  }
</style>
<style lang="scss" scoped>
// 项目详情外部框架
  #interview{
    width: 1200px;
    margin: 0 auto;
    position: relative;
    .drop{
      width: 130px;
      float: right;
      margin-right: 10px;
      display: inline-block;
    }
    .flri{
      float: left;
      // margin-left: 20px;
      width: 70px;
    }
    .status{
      font-size: 12px;
      text-align: center;
      border-radius: 3px;
      width: 100%;
      height: 20px;
      line-height: 20px;
      margin-top: 5px;
      color: #fff;
    }
    .status1{
      @extend .status;
      background-color: #4b8ac5;
    }
    .status2{
      @extend .status;
      background-color: #1db0cf;
    }
    .status3{
      @extend .status;
      background-color: #ea913a;
    }
    .status4{
      @extend .status;
      background-color: #f488b3;
    }
    .status5{
      margin-left: 18px;
      @extend .status;
      background-color: #77b936;
    }
    .check{
      margin-left: 18px;
      .btn{
        height: 28px;
        line-height: 27px;
      }
      .color{
        color: #2e83d3;
        vertical-align: bottom;
      }
      .txt{
        font-size: 12px !important;
      }
    }
    .interName{
      color: #555;
      font-size: 14px !important;
    }
    .brand{
      overflow: hidden;
      margin: 0 0 !important;
      .fl{
        float: left;
      }
      i{
        display: inline-block;
        margin-right: 6px;
        font-size: 24px;
        color: #2e83d3;
      }
    }
    .aside{
      width: 100%;
      padding: 14px 0 20px;
      background-color: #eee;
      box-sizing: border-box;
      overflow: hidden;
      min-height: 618px;
      .child{
        cursor: pointer;
        float: left;
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
        span{
          display: inline-block;
          text-align: center;
        }
        .icon{
          width: 55px;
          height: 55px;
          border-radius: 3px;
          line-height: 55px;
          margin-bottom: 3px;
          i{
            font-size: 35px;
            color: #666;
          }
        }
        .tit{
          width: 55px;
          color: #555;
          font-size: 13px;
          text-align: center;
        }
      }
    }
    .current{
      .icon{
        background-color: #2e83d3 !important;
        i{
          color: #fff !important;
        }
      }
      .tit{
        color: #2e83d3 !important;
      }
    }
    .nav{
      padding: 20px 0;
    }
    .main-right {
      min-height: 100vh;
      position: relative;
    }
    .projectDetail{
      width: 100%;
      border-bottom: 1px solid #ccc;
      overflow: hidden;
      .tit{
        display: inline-block;
        color: #2e83d3;
        padding: 6px 0 10px;
        font-size: 16px;
        font-weight: 600;
      }
      .sel{
        padding: 2px 15px 3px;
        background-color: #ff9800;
        border-radius: 5px;
        font-size: 12px;
        color: #fff;
        display: inline-block;
        margin-left: 10px;
      }
      .tag{
        display: inline-block;
        width: 120px;
        margin-left: 10px;
      }
      .back{
        float: right;
        border: 1px solid #ccc;
        padding: 4px 15px 6px;
        display: inline-block;
        border-radius: 4px;
        font-size: 12px;
        color: #444;
        cursor: pointer;
        .backBtn{
          vertical-align: bottom;
          color: #444;
        }
      }
    }
    .yao{
      position: absolute;
      top: -22px;
      right: 0;
      width: 80px;
      float: right;
      text-align: right;
      padding-bottom: 10px;
      span{
        display: inline-block;
        cursor: pointer;
        color: #2e83d3;
      }
      .img{
        font-size: 26px;
        padding-right: 8px;
      }
      .tet{
        width: 100%;
        padding-top: 3px;
      }
    }
    .showBox{
      padding: 13px;
      box-sizing: border-box;
      z-index: 100;
      width: 420px;
      background-color: #f7f7f7;
      position: absolute;
      top: 5%;
      right: 0;
      border: 1px solid #d8d9da;
      cursor: pointer;
      .mini{
        float: right;
        width: 80px;
      }
      p{
        margin-bottom: 9px;
        font-size: 12px;
      }
      .mb{
        margin-bottom: 8px;
      }
      .ewm{
        width: 140px;
        text-align: left;
        overflow: hidden;
        img{
          width: 140px;
        }
        .ling{
          float: left;
          margin-top: 13px;
          color: #2e83d3;
        }
        .copy{
          float: right;
          margin-top: 13px;
          color: #2e83d3;
        }
      }
    }
  }
</style>
