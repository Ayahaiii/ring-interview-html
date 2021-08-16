<template>
  <div id="baseMessage">
    <el-row style="margin-top:0px">
      <el-form :hide-required-asterisk='true' size='mini' label-position="left" :model="searchForm" :rules="rules" ref="searchForm" label-width="90px" class="demo-ruleForm">
        <el-col :span='24'>
          <el-form-item label="项目名称 :" prop="name">
            <el-input v-model="searchForm.name" style="width: 50%;" placeholder="请输入项目名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="项目描述 :" prop="desc">
            <el-input v-model="searchForm.desc" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入项目描述" type='textarea' style="width: 50%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="项目标签 :">
            <el-input v-model="labelStr" @keyup.space.native="createProjectLabel" placeholder="请输入字段长度不超过5的项目标签" style="width: 50%;"></el-input>
            <div v-if="labelArr.length > 0" style="margin-top: 10px">
              <span class="labelBtn" v-for="(item, index) in labelArr" :key="'lab'+index">
                <el-tooltip class="item" effect="dark" :content="item" placement="top-end" v-if="item.length > 5">
                  <span>{{ item.length > 5 ? item.substring(0,4) + '...' : item }} </span>
                </el-tooltip>
                <span v-else>{{ item.length > 5 ? item.substring(0,4) + '...' : item }} </span>
                <i class="el-icon-circle-close del" @click="deleteLabel(index)"></i>
              </span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item>
            <el-button type="primary" style="width: 150px" @click="save('searchForm')" :disabled='isSample' size='small' class="mini" v-permission="{projectId: $route.query.id, permissionId: Constant.RP_PROJECT_EDIT}"><span>保存</span></el-button>
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
      isSample: false,
      breadcrumbList: [
        {
          name: '项目详情',
          path: '/project/info'
        }, {
          name: '基本信息',
        }
      ],
      labelStr: '',
      labelArr: [],
      searchForm: {
        name: null,
        type: null,
        desc: null,
        label: null,
        createTime: '2020-01-25  15:23',
        beginTime: '2020-01-26  09:10',
        stopTime: '（没暂停就整体不显示，包括暂停时间四个字）',
        endTime: '（没暂停就整体不显示，包括暂停时间四个字）'
      },
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入项目描述', trigger: 'blur' }],
        type: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
        // label: [{ required: true, message: '请输入项目标签', trigger: 'blur' }],
        beginTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        stopTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        endTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
      },
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
    this.getMessage()
  },
  methods: {
    // 保存项目基本信息
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.httpPost('/project/update', {
            id: this.projectId,
            name: this.searchForm.name,
            labelText: this.searchForm.label,
            description: this.searchForm.desc
          }).then(res => {
            if (res.code == 0) {
              this.$message({type: 'success', message: res.message})
              this.$router.push({path: '/project/info', query: {id: this.projectId}})
            } else {
              this.$message({type: 'error', message: res.message})
            }
          }).catch(error => {
            this.$message({type: 'error', message: error})
          })
        } else {
          return false;
        }
      });
    },
    // 项目基本信息回显
    getMessage () {
      this.httpPost('/project/get/'+ this.projectId).then(res => {
        if (res.code == 0) {
          this.searchForm.name = res.data.name
          this.searchForm.desc = res.data.description
          let str = res.data.labelText
          this.labelArr = str.split(',')
          // this.searchForm.label = res.data.labelText
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    // 创建项目标签
    createProjectLabel () {
      if (!this.labelStr.trim()) {
        this.$message({type: 'warning', message: '项目标签不能为空（输入空格即创建标签）'})
        this.labelStr = ''
      } else if (this.labelStr.length > 5) {
        this.$message({type: 'warning', message: '请输入字节长度不超5的项目标签'})
        this.labelStr = ''
      } else if (this.labelArr.length > 4) {
        this.$message({type: 'warning', message: '最多添加5个项目标签'})
        this.labelStr = ''
        return
      } else {
        this.labelArr.push(this.labelStr)
        this.labelStr = ''
      }
    },

    // 删除标签
    deleteLabel (index) {
      this.labelArr.splice(index, 1);
    },
  }
}
</script>

<style scoped>
  #baseMessage>>>.el-form--label-left .el-form-item__label {
      text-align: left;
      font-size: 12px;
  }
</style>
<style lang="scss" scoped>
#baseMessage{
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
  .labelBtn{
    width: 91px;
    padding-left: 5px;
    text-align: left;
    background-color: #f4f4f4;
    display: inline-block;
    border: 1px solid #DCDFE6;
    margin-right: 10px;
    height: 27px;
    line-height: 23px;
    border-radius: 3px;
    position: relative;
    span{
      font-size: 12px;
      color: #444;
    }
    .del{
      position: absolute;
      top: 6px;
      right: 5px;
      font-size: 14px;
      color: #444;
      cursor: pointer;
      &:hover{
        color: #F56C6C;
      }
    }
  }
}
</style>
