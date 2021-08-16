<template>
  <div id="interviewDetail">
    <div class="detailForm">
      <el-form ref="form" size='mini' :model="detail" label-width="155px">
        <el-row>
          <el-form-item label="访谈详情">
            <div class="step">
              <el-steps :active="detail.status">
                <el-step title="计划中" :description="time.planTime" icon="iconfont icondian"></el-step>
                <el-step title="访谈开始" :description="time.startTime" icon="iconfont icondian"></el-step>
                <el-step title="访谈结束" :description="time.endTime" icon="iconfont icondian"></el-step>
                <el-step title="整理完成" :description="time.arrangeTime" icon="iconfont icondian"></el-step>
                <el-step title="审核完成" :description="time.examineTime" icon="iconfont icondian"></el-step>
              </el-steps>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="负责人：">
            <span class="fs12">{{ detail.managerName }}</span>
          </el-form-item>
        </el-row>
        <el-form-item label="协作者：">
          <span class="fs12">{{ detail.assistantName }} </span>
        </el-form-item>
        <el-form-item label="访谈对象：">
          <span class="fs12" v-for="(item, index) in detail.sampleList" :key="'sam'+index">{{ item.name }}, </span>
        </el-form-item>
        <el-form-item label="计划开始时间：">
          <span class="fs12">{{ detail.planStartTime }}</span>
        </el-form-item>
        <el-form-item label="计划结束时间：">
          <span class="fs12">{{ detail.planEndTime }}</span>
        </el-form-item>
        <el-form-item label="计划时长：">
          <span class="fs12">{{ detail.planDuration }}</span>
        </el-form-item>
        <el-form-item label="访谈地点：">
          <span class="fs12">{{ detail.address }}</span>
        </el-form-item>
        <el-form-item label="访谈计划：">
          <div class="fs12" v-html="detail.planText"></div>
        </el-form-item>
        <el-form-item label="备注：">
          <span class="fs12">{{ detail.description }}</span>
        </el-form-item>
        <el-form-item label="创建时间：">
          <span class="fs12">{{ detail.createTime }}</span>
        </el-form-item>
        <el-form-item label="访谈开始时间：" v-if="detail.status == 2 || detail.status == 3 || detail.status == 4 || detail.status == 5">
          <span class="fs12">{{ detail.beginTime }}</span>
        </el-form-item>
        <el-form-item label="访谈结束时间：" v-if="detail.status == 3 || detail.status == 4 || detail.status == 5">
          <span class="fs12">{{ detail.endTime }}</span>
        </el-form-item>
        <el-form-item label="访谈耗时：" v-if="detail.status == 3 || detail.status == 4 || detail.status == 5">
          <span class="fs12">{{ detail.interviewDuration }}</span>
        </el-form-item>
        <el-form-item label="访谈整理开始时间：" v-if="detail.status == 3 || detail.status == 4 || detail.status == 5">
          <span class="fs12">{{ detail.docBeginTime }}</span>
        </el-form-item>
        <el-form-item label="访谈整理结束时间：" v-if="detail.status == 4 || detail.status == 5">
          <span class="fs12">{{ detail.docEndTime }}</span>
        </el-form-item>
        <el-form-item label="整理耗时：" v-if="detail.status == 4 || detail.status == 5">
          <span class="fs12">{{ detail.docDuration }}</span>
        </el-form-item>
        <el-form-item label="审核开始时间：" v-if="detail.status == 5">
          <span class="fs12">{{ detail.auditTime }}</span>
        </el-form-item>
        <el-form-item label="审核结束时间：" v-if="detail.status == 5">
          <span class="fs12">{{ detail.auditEndTime }}</span>
        </el-form-item>
        <el-form-item label="审核耗时：" v-if="detail.status == 5">
          <span class="fs12">{{ detail.auditDuration }}</span>
        </el-form-item>
        <el-form-item><el-button @click="hi()"></el-button></el-form-item>
      </el-form>
    </div>

      <!-- 审核弹框 -->
      <!-- <el-dialog
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
      </el-dialog> -->
  </div>
</template>

<script>
export default {
  props: ['detailForm', 'timeArr'],
  data () {
    return {
      interName: null,
      projectId: null,
      interviewId: null,
      breadcrumbList: [
        {
          name: '访谈',
          path: '/talk'
        }, {
          name: '详情',
        }
      ],
      time: {
        planTime: '03-10 00:00',
        startTime: '03-10 00:00',
        endTime: '03-10 00:00',
        arrangeTime: '03-10 00:00',
        examineTime: '03-10 00:00',
      },
      detail: {},

    }
  },
  watch: {
    detailForm: function (val) {
      this.detail = val
    },
    timeArr: function(val) {
      this.time = val
    }
  },
  created () {
    this.interName = this.$route.query.ina
    this.projectId = this.$route.query.id
    this.interviewId = this.$route.query.inId
    this.detail.status = +this.$route.query.sta
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/talk',
      interviewName: this.interName,
      interviewId: this.interviewId
    })
  },

  methods: {
    hi(){
      console.log("detail: " + JSON.stringify(this.detail))
    },
    // // 获取详情信息
    // getDetail () {
    //   let params = {
    //     "interviewId": this.interviewId,
    //     "projectId": this.projectId,
    //     "status": this.active
    //   }
    //   this.httpPost('/interview/detail', params).then(res => {
    //     if (res.code == 0) {
    //       this.detail.address = res.data.address
    //       let arr = []
    //       res.data.assistantList.forEach(item => {
    //         arr.push(item.name)
    //       })
    //       this.detail.assistantName =  arr.join(",")
    //       this.detail.auditTime = res.data.auditTime
    //       this.detail.auditEndTime = res.data.auditEndTime
    //       this.detail.auditDuration = res.data.auditDuration
    //       this.examineTime = res.data.auditEndTime
    //       this.detail.beginTime = res.data.beginTime
    //       this.startTime = res.data.beginTime
    //       this.detail.createTime = res.data.createTime
    //       this.detail.description = res.data.description
    //       this.detail.docBeginTime = res.data.docBeginTime
    //       this.detail.docEndTime = res.data.docEndTime
    //       this.detail.docDuration = res.data.docDuration
    //       this.arrangeTime = res.data.docEndTime
    //       this.detail.endTime = res.data.endTime
    //       this.detail.interviewDuration = res.data.interviewDuration
    //       this.endTime = res.data.endTime
    //       this.detail.managerName = res.data.manager.name
    //       this.detail.planDuration = res.data.planDuration
    //       this.detail.planEndTime = res.data.planEndTime
    //       this.detail.planStartTime = res.data.planStartTime
    //       this.planTime = res.data.planStartTime
    //       this.detail.planText = res.data.planText
    //       this.detail.sampleList = res.data.sampleList
    //       this.detail.status = +res.data.status
    //     } else {
    //       this.$message({type: 'error', message: res.message})
    //     }
    //   }).catch(error => {
    //     this.$message({type: 'error', message: error})
    //   })
    // },
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
          this.detail.status = status
          this.getDetail()
          this.$message({type: 'success', message: res.message})
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    openStart () {
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
    // 格式化毫秒
    formatDuring(mss) {
      var days = parseInt(mss / (1000 * 60 * 60 * 24));
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = (mss % (1000 * 60)) / 1000;
      return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
    },
  }
}
</script>

<style scoped>
  .detailForm>>>.el-form-item--mini .el-form-item__label {
    line-height: 28px;
    font-size: 12px;
    text-align: left;
  }
  .detailForm>>> p{
    font-size: 12px;
  }
  .detailForm>>>.el-step__description.is-finish {
    color: #2e83d3;
  }
  .detailForm>>>.el-step__title.is-process {
    font-weight: normal;
    color: #444;
    font-size: 12px;
  }
  .detailForm>>>.el-step__title.is-wait {
    color: #C0C4CC;
    font-size: 12px;
  }
  .detailForm>>>.el-step__title.is-finish {
    color: #2e83d3;
    font-size: 12px;
  }
  .detailForm>>>.el-step__head.is-finish {
    color: #2e83d3;
    border-color: #2e83d3;
  }
  .detailForm>>>.is-finish .el-step__line {
    position: absolute;
    border-color: inherit;
    background-color: #2e83d3;
  }
  .detailForm>>>.el-step__icon.is-icon {
    width: 20px;
  }
  #interviewDetail>>>.el-step__head.is-process {
    color: #999;
    border-color: #303133;
  }
  #interviewDetail>>>.iconfont {
    font-family: "iconfont" !important;
    font-size: 13px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .check>>>.el-button--mini {
    font-size: 12px;
    border-radius: 3px;
    height: 22px;
    line-height: 20px;
    padding: 0;
    width: 100px;
  }
  .detailForm>>>.el-step.is-horizontal .el-step__line {
    height: 1.5px;
    top: 14px;
    left: 0;
    right: 0;
  }
  .detailForm>>>.el-step__line-inner {
    display: block;
    border-width: 0px !important;
    border-style: solid;
    border-color: inherit;
    -webkit-transition: .15s ease-out;
    transition: .15s ease-out;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 0;
    height: 0;
  }
</style>
<style lang="scss" scoped>
  #interviewDetail{
    div{
      overflow: hidden;
    }
    .status{
      font-size: 12px;
      text-align: center;
      border-radius: 3px;
      width: 70%;
      height: 28px;
      line-height: 28px;
      color: #fff;
    }
    .p12{
      font-size: 12px !important;
    }
    .fs12{
      color: #444;
    }
    .status1{
      @extend .status;
      background-color: #99D1F0;
    }
    .status2{
      @extend .status;
      background-color: #F93232;
    }
    .status3{
      @extend .status;
      background-color: #CC6565;
    }
    .status4{
      @extend .status;
      background-color: #3D738C;
    }
    .status5{
      margin-left: 18px;
      @extend .status;
      background-color: #7DA450;
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
    .detailForm{
      margin-top: 20px;
      .step{
        width: 80%;
        margin-bottom: 20px;
      }
    }
    .cao{
      // height: 35px;
    }
  }
</style>
