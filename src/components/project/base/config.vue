<template>
  <div id="dispose">
    <!-- 项目列表 -->
    <el-row style="margin-top:0px">
      <el-form :hide-required-asterisk='true' size='mini' label-position="left" :model="projectDispose" ref="searchForm" label-width="290px" class="demo-ruleForm">
        <el-col :span='24'>
          <el-form-item label="客户端现场定位：">
            <el-select size='mini' v-model="projectDispose.clientPosition" placeholder="请选择" style="width: 80px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="客户端轨迹监控：">
            <el-select size='mini' v-model="projectDispose.clientTrack" placeholder="请选择" style="width: 80px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="追踪访谈（一个研究对象多个访谈）：">
            <el-select size='mini' v-model="projectDispose.trackInterview" placeholder="请选择" style="width: 80px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="允许访问员新增样本：">
            <el-select size='mini' v-model="projectDispose.allowAddSample" placeholder="请选择" style="width: 80px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
            <el-button type="primary" class="mini" size='small' style="width: 100px; margin-top: 30px" @click="save('projectDispose')" :disabled='isSample' v-permission="{projectId: $route.query.id, permissionId: Constant.RP_PROJECT_CONFIG_ADMIN}"><span class="mini">保存</span></el-button>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      projectId: null,
      isSample: false,
      breadcrumbList: [
        {
          name: '项目详情',
          path: '/project/info'
        }, {
          name: '项目配置',
        }
      ],
      options: [{value: 1,label: '启动'}, {value: 0,label: '关闭'}],
      projectDispose: {}
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/project/info',
    })
    this.projectId = this.$route.query.id
    this.httpPost('/project/get/visit/' + this.projectId).then(res => {
      console.log(res.data)
      if (res.data == 1) {
        this.isSample = true
      }
    })
    this.getDisposeMessage()
  },
  methods: {
    // 获取项目配置信息
    getDisposeMessage () {
      this.httpPost('/project/get/config/'+ this.projectId).then(res => {
        if (res.code == 0) {
          this.projectDispose = res.data
        }
      })
    },
    save(formName) {
      let params = {
        "clientPosition": this.projectDispose.clientPosition,
        "clientTrack": this.projectDispose.clientTrack,
        "id": this.projectId,
        "trackInterview": this.projectDispose.trackInterview,
        "allowAddSample": this.projectDispose.allowAddSample
      }
      this.httpPost('/project/update/config', params).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.$router.push({path: '/project/info', query: {id: this.projectId}})
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
  }
}
</script>

<style scoped>
  #dispose>>>.el-select .el-input .el-select__caret {
    color: #C0C4CC;
    font-size: 14px;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    -webkit-transform: rotateZ(180deg);
    transform: rotateZ(180deg);
    cursor: pointer;
    height: 29px;
  }
  #dispose>>>.el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
  }
  #dispose>>>.el-form--label-left .el-form-item__label {
    text-align: left;
    font-size: 12px;
  }
</style>
<style lang="scss" scoped>
#dispose{
  .baseMessage{
    width: 100%;
    padding: 10px 0 10px;
    border-bottom: 1.5px solid #ccc;
    overflow: hidden;
    .base{
      color: #2e83d3;
      font-size: 17px;
      font-weight: bold;
      float: left;
    }
  }
  .mini{
    span{
      font-size: 12px !important;
    }
  }
}
</style>
