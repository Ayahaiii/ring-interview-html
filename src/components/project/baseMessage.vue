<template>
  <div id="baseMessage">
    <el-row style="margin-top:0px">
      <el-form :hide-required-asterisk='true' size='mini' label-position="left" :model="searchForm" :rules="rules" ref="searchForm" label-width="90px" class="demo-ruleForm">
        <el-col :span='24'>
          <el-form-item label="项目名称 :" prop="name">
            <el-input v-model="searchForm.name" style="width: 50%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="项目描述 :" prop="desc">
            <el-input v-model="searchForm.desc" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入项目描述" type='textarea' style="width: 50%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="项目标签 :" prop="startTime">
            <el-input v-model="searchForm.label" placeholder="请输入项目标签" style="width: 50%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="创建时间 :" prop="createTime">
            <el-date-picker v-model="searchForm.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="启动时间 :" prop="beginTime">
            <el-date-picker v-model="searchForm.beginTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="暂停时间 :" prop="stopTime">
            <el-date-picker v-model="searchForm.stopTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="结束时间 :" prop="endTime">
            <el-date-picker v-model="searchForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item>
            <el-button type="primary" style="width: 150px" @click="save('searchForm')">保存</el-button>
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
      breadcrumbList: [
        {
          name: '民营企业家应对新肺疫情深度访谈研究',
          path: '/index'
        }, {
          name: '项目详情',
          // path: ''
        }
      ],
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
        label: [{ required: true, message: '请输入项目标签', trigger: 'blur' }],
        beginTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        stopTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        endTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
      },
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      title: '项目详情',
      link: '/project/detail',
      backTitle: '项目详情'
    })
  },
  methods: {
    goProjectDetail () {
      this.$router.push('/project/detail')
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          return false;
        }
      });
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
      color: #5873b4;
      font-size: 17px;
      font-weight: bold;
      float: left;
    }
  }
}
</style>
