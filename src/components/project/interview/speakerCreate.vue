<template>
  <div id='interviewAdd'>
    <!-- 项目列表 -->
    <el-row>
      <el-form :hide-required-asterisk='true' size='mini' label-position="left" :model="searchForm" :rules="rules" ref="searchForm" label-width="90px" class="demo-ruleForm">
        <el-col :span='24'>
          <el-form-item label="姓名 :" prop="name">
            <el-input v-model="searchForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="昵称 :">
            <el-input v-model="searchForm.userName" placeholder="请输入昵称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="身份 :" prop="identity">
            <el-select v-model="searchForm.identity" placeholder="请选择身份"><el-option  v-for="(item, index) in identityList"  :key="'id'+index"  :label="item.label"  :value="item.value"></el-option></el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="归属样本 :" prop="symbol">
            <el-select v-model="searchForm.symbol" placeholder="请选择归属样本"><el-option  v-for="(item, index) in symbolList"  :key="'symp'+index"  :label="item.label"  :value="item.value"></el-option></el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="备注 :">
            <el-input v-model="searchForm.remarks" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" type='textarea'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24' v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_TEXT_ADD}">
          <el-form-item>
            <el-button type="primary" style="width: 150px" @click="save('searchForm')" class="mini"><span>保存</span></el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      interName: null,
      projectId: null,
      breadcrumbList: [
        {
          name: '访谈',
          path: '/talk'
        },{
          name: '对话文本',
          path: '/talk/text/edit'
        },{
          name: '讲话者管理',
          path: '/talk/speaker'
        },
         {
          name: '添加参与者',
        },
      ],
      editorId: null,
      status: null,
      interviewId: null,
      identityList: [{ value: 1, label: '主持人'}, { value: 2, label: '助理'}, { value: 3, label: '受访者'}, { value: 4, label: '关系人'}, ],
      symbolList: [],
      searchForm: {
        name: '',
        userName: '',
        sex: 1,
        identity: '',
        symbol: '',
        remarks: '',
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        identity: [{ required: true, message: '请选择身份', trigger: 'change' }],
        symbol: [{ required: true, message: '请选择归属样本', trigger: 'change' }],
      },
    }
  },
  created () {
    this.interName = this.$route.query.ina
    this.projectId = this.$route.query.id
    this.interviewId = this.$route.query.inId
    this.editorId = this.$route.query.editorId
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/talk/speaker',
      interviewId: this.interviewId,
      interviewName: this.interName
    })
    if (this.editorId) {
      this.getDetail()
    }
    this.getSamply()
  },
  methods: {
    // 获取归属样本
    getSamply () {
      this.symbolList = []
      let params = {
        projectId: +this.projectId,
        interviewId: +this.interviewId
      }
      this.httpPost('interview/sample/owner', params).then(res => {
        if (res.code == 0) {
          res.data.forEach(item => {
            let obj = {}
            obj.value = item.id
            obj.label = item.code
            this.symbolList.push(obj)
          })

        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },

    // 获取详情
    getDetail () {
      let params = {
        id: this.editorId,
        projectId: this.projectId
      }
      this.httpPost('interview/detail/speaker/', params).then(res => {
        if (res.code == 0) {
          this.searchForm.identity = res.data.type
          this.searchForm.name = res.data.name
          this.searchForm.userName = res.data.petName
          this.searchForm.symbol = res.data.sampleOwner
          this.searchForm.remarks = res.data.description
        } else {
          this.$message({type: 'error', message: error})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    // 保存
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params;
          if (this.editorId) {
            params = {
              id: this.editorId,
              interviewId: this.interviewId,
              type: +this.searchForm.identity,
              name: this.searchForm.name,
              projectId: this.projectId,
              petName: this.searchForm.userName,
              sampleOwner: this.searchForm.symbol,
              description: this.searchForm.remarks
            }
          } else {
            params = {
              interviewId: this.interviewId,
              type: +this.searchForm.identity,
              name: this.searchForm.name,
              projectId: this.projectId,
              petName: this.searchForm.userName,
              sampleOwner: this.searchForm.symbol,
              description: this.searchForm.remarks
            }
          }
          this.httpPost('/interview/save/speaker', params).then(res => {
          if (res.code == 0) {
            this.$message({type: 'success', message: res.message})
            this.searchForm.identity = ''
            this.searchForm.name = ''
            this.searchForm.userName = ''
            this.searchForm.symbol = ''
            this.searchForm.remarks = ''
            this.$router.push({path: '/talk/speaker', query: {id: this.projectId, inId: this.interviewId, sta: this.status,}})
          } else {
            this.$message({type: 'error', message: error})
          }
          }).catch(error => {
            this.$message({type: 'error', message: error})
          })
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
   #interviewAdd>>>.el-form-item--mini .el-form-item__label {
    line-height: 28px;
    font-size: 12px;
  }
  #interviewAdd>>>.el-radio__label {
    font-size: 12px !important;
    padding-left: 10px;
  }
</style>
<style lang="scss" scoped>
  #interviewAdd{
    div{
      overflow: hidden;
    }
    .demo-ruleForm{
      width: 50%;
    }
  }
</style>
