<!-- 分派给团队成员 -->
<template>
  <div id="sampleAssignAdmin">
    <el-form
      :model="form"
      :rules="formRules"
      ref="form"
      label-width="30px"
      label-position="left"
      size='mini'
    >
      <!-- 样本 -->
      <div>
        <p>样本</p>
        <el-form-item>
          <el-radio-group v-model="form.sample" class="mt20">
            <el-radio :disabled = "disabled1" :label="0">全部研究样本</el-radio>
            <el-radio :disabled = "disabled1" :label="1">检索结果样本</el-radio>
            <el-radio :disabled = "disabled2" :label="2">选中结果样本</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <!-- 分派 -->
      <div>
        <p>分派给：</p>
        <el-form-item class="mt20">
          <el-col :span="2" class="txt">负责人：</el-col>
          <el-col :span="20">
            <el-select
              v-model="form.admmin"
              filterable
              allow-create
              default-first-option
              clearable
              placeholder="请选择负责人"
              style="width: 350px;"
              >
              <el-option
                v-for="item in adminList"
                :key="item.id"
                :label="item.memberName"
                :value="item.id"
                :disabled="form.admminWorker.indexOf(item.id) > -1">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="2" class="txt">协作者：</el-col>
          <el-col :span="20">
            <el-select
              v-model="form.admminWorker"
              multiple
              filterable
              allow-create
              default-first-option
              clearable
              placeholder="请选择协作者"
              style="width: 350px;"
              >
              <el-option
                v-for="item in admminWorkerList"
                :key="item.id"
                :label="item.memberName"
                :value="item.id"
                :disabled="item.id === form.admmin">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </div>

      <!-- 保存按钮 -->
      <div>
        <el-col :span='24' v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_ASSIGN_ADMIN}">
          <el-form-item>
            <el-button type="primary" style="width: 150px"  class="mini" @click="saveAssignAdmin" :disabled='isSample'><span>保存</span></el-button>
          </el-form-item>
        </el-col>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      projectId: null,
      isSample: false,
      breadcrumbList: [
        {
          name: '样本',
          path: '/sample'
        }, {
          name: '分派给团队成员',
        }
      ],
      form: {
        sample: '',
        admmin: '',
        admminWorker: ''
      },
      formRules: {},
      adminList: [],
      admminWorkerList: [],
      disabled1: false,
      disabled2: false
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/sample',
      backTitle: '访谈列表'
    })
    this.projectId = this.$route.query.id
    this.httpPost('/project/get/visit/' + this.projectId).then(res => {
      console.log(res.data)
      if (res.data == 1) {
        this.isSample = true
      }
    })
    this.getSampleMember()
    this.getRadioStatus()
  },
  methods: {
    getSampleMember() {
      let param = {
        projectId: this.$route.query.id
      }
      this.httpPost('/sample/member', param).then(res => {
        if (res.code == 0) {
          let tempList = res.data;
          for(let i in tempList) {
            if (tempList[i].roleId.indexOf('5') != -1) {
              this.adminList.push(tempList[i])
            }
          }
          this.admminWorkerList = res.data
        } else {
          this.$message({
            type: 'info',
            $message: `${res.message}`
          })
        }
      })
    },
    getRadioStatus () {
      let opt = this.$route.query.opt
      if (opt == 'C') {
        this.disabled1 = true
        this.form.sample = 2
      } else {
        this.disabled2 = true
        this.form.sample = 0
      }
    },
    //保存
    saveAssignAdmin () {
      if (!this.form.admmin) {
        this.$message('请选择负责人')
        return
      }
      let str = ''
      if (this.$route.query.opt == 'A') {
        str = 'ALL'
      }
      let params = {
        "opt": str,
        "assistantId": this.form.admminWorker,
        "managerId": this.form.admmin,
        "projectId": this.$route.query.id,
        "sampleIds": JSON.parse(this.$route.query.sIds),
      }
      this.httpPost('/sample/assign', params).then(res => {
        if (res.code == 0) {
          this.$message({
            type:'success',
            message: '保存成功'
          })
          this.$router.push(`/sample?id=${this.projectId}`)
        } else {
          this.$message({
            type:'error',
            message: `${res.message}`
          })
        }
      })
    }
  }
}
</script>

<style scoped>
#sampleAssignAdmin >>> .el-radio__label {
  font-size: 12px !important;
}
</style>

<style lang='scss' scoped>
#sampleAssignAdmin {
  div{
      overflow: hidden;
    }
  p {
    font-size: 14px;
    font-weight: bold;
  }
  .mt20 {
    margin-top: 20px;
  }
  .ipt-wid {
    width: 60%;
  }
  .txt {
    font-size: 12px;
  }
}
</style>
