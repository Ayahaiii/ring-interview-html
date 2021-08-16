<template>
  <div id='createProject'>
    <!-- 面包屑 -->
    <div class="brand">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/project' }"><span class="iconfont">&#xe605;</span>我的访谈</el-breadcrumb-item>
        <el-breadcrumb-item>创建访谈项目</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 创建访谈项目 -->
    <div class="createProject"><span>创建访谈项目</span></div>
    <!-- 项目列表 -->
    <el-row style="margin-top:20px">
      <el-form  size='mini' label-position="left" :model="searchForm" :rules="rules" ref="searchForm" label-width="90px" class="demo-ruleForm">
        <el-col :span='24'>
          <el-form-item label="项目类型 :" prop="type">
            <el-select v-model="searchForm.type" placeholder="请选择项目类型">
              <el-option label="个案访谈" value="1"></el-option>
              <el-option label="焦点小组" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="项目名称 :" prop="name">
            <el-input v-model="searchForm.name" style="width: 50%;" placeholder="请输入项目名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="项目标签 :">
            <el-input v-model="labelStr" @change="createProjectLabel" style="width: 50%;" placeholder="请输入长度不超过5个字符的项目标签，以空格键分隔"></el-input>
            <div v-if="labelArr.length > 0" style="margin-top: 10px"><span class="labelBtn" v-for="(item, index) in labelArr" :key="'lab'+index"><span>{{ item }} </span><i class="el-icon-circle-close del" @click="deleteLabel(index)"></i></span></div>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="项目描述 :">
            <el-input v-model="searchForm.desc" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入项目描述" type='textarea' style="width: 50%;"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='24'>
          <el-form-item>
            <el-button type="primary" size='mini' style="width: 150px" class="mini" @click="save('searchForm')"><span>保存</span></el-button>
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
        labelStr: '',
        labelArr: [],
        searchForm: {
          name: null,
          description: null,
          type: null,
          labelText: null,
        },
        rules: {
          name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
          type: [{ required: true, message: '请选择项目类型', trigger: 'change' }]
        },
      }
    },
    methods: {
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.searchForm.labelText = this.labelArr.join(',')
            let params = {
              "description": this.searchForm.desc,
              "labelText": this.searchForm.labelText,
              "name": this.searchForm.name,
              "typeId": this.searchForm.type
            }
            this.httpPost('/project/create', params).then(res => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: res.data
                })
                this.searchForm = {
                  name: null,
                  desc: null,
                  labelText: null,
                }
                this.$router.push('/project')
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }
            }).catch(error => {
              this.$message({
                  type: 'error',
                  message: error
                })
            })
          } else {
            return false;
          }
        });
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
  #createProject>>>.el-form-item--mini .el-form-item__label {
    line-height: 28px;
    font-size: 12px;
  }
</style>
<style lang="scss" scoped>
  #createProject{
    width: 1200px;
    margin: 0 auto;
    .iconfont{
      font-size: 15px;
      font-weight: bold;
    }
    .labelBtn{
      width: 103px;
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
    .createProject{
      width: 100%;
      padding: 10px 0 10px;
      border-bottom: 1.5px solid #ccc;
      span{
        color: #2e83d3;
        font-size: 17px;
        font-weight: bold;
      }
    }
  }
</style>
