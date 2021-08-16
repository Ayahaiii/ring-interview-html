<template>
  <div id="addTeam">
    <!-- 表单 -->
    <div class="teamList">
      <el-form :model="teamForm" size='mini' :hide-required-asterisk='true' label-position="left" :rules="rules" ref="teamForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="团队成员 :" prop="name">
          <div>
            <el-input v-model="teamForm.name" style="width: 30%"></el-input>
            <el-button type='primary' class="mini" size='mini'><span>搜索</span></el-button>
          </div>
          <ul class="list">
            <li><span class="iconfont">&#xe6de;</span>宋雯<span></span><i class="el-icon-circle-close"></i></li>
            <li><span class="iconfont">&#xe6de;</span>董淑珍<span></span><i class="el-icon-circle-close"></i></li>
            <li><span class="iconfont">&#xe6de;</span>严总<span></span><i class="el-icon-circle-close"></i></li>
          </ul>
        </el-form-item>
        <el-form-item label="角色 :" prop="role">
          <el-checkbox-group v-model="teamForm.role">
            <el-checkbox label="访问员" name="1"></el-checkbox>
            <el-checkbox label="督导员" name="2"></el-checkbox>
            <el-checkbox label="分析员" name="3"></el-checkbox>
            <el-checkbox label="管理员" name="4"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分组 :">
          <div>
            <el-tree class="group" :data="groupData" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps"></el-tree>
          </div>
        </el-form-item>
        <el-form-item label="授权类型 :" prop="type">
          <el-select v-model="teamForm.type" clearable placeholder="请选择" style="width: 30%">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权日期 :">
            <el-form-item prop="date">
              <el-date-picker type="date" placeholder="选择日期" v-model="teamForm.date" style="width: 30%"></el-date-picker>
            </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addForm('teamForm')" style="width: 100px" class="mini"><span>添加</span></el-button>
        </el-form-item>
      </el-form>
    </div>
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
          name: '团队',
          // path: ''
        }
      ],
      options: [{value: '0',label: '永久'}, {value: '1',label: '指定有效期'}],
      teamForm: {
        name: '',
        role: '',
        type: '',
        date: '',
      },
      rules: {
        name: [{ required: true, message: '请输入团队成员', trigger: 'blur' }],
        type: [{ required: true, message: '请选择角色', trigger: 'change' }],
        role: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
        startTime: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
      },
      groupData: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      title: '团队',
      link: '/team',
      backTitle: '团队列表'
    })
  },
  methods: {
    // 返回团队列表
    goteamList () {
      this.$router.push('/team')
    },
    addForm(formName) {
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
  #addTeam>>>.el-button--mini {
    padding: 6px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 0px;
  }
  #addTeam>>>.el-form--label-left .el-form-item__label {
    text-align: left;
    font-size: 12px;
  }
  #addTeam>>>.el-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 12px;
  }
  #addTeam>>>.el-tree-node__label{
    font-size: 12px;
  }
</style>
<style lang="scss" scoped>
  #addTeam{
    .teamList{
      margin: 0px 0 20px 0px;
      .list{
        width: 100%;
        border: 1px solid #ccc;
        background-color: #dbeee6;
        min-height: 50px;
        overflow: hidden;
        margin: 20px 0;
        padding: 0 10px 10px;
        li{
          float: left;
          padding: 1px 10px;
          margin-right: 30px;
          margin-top: 10px;
          position: relative;
          line-height: 30px;
          font-size: 12px;
          box-sizing: border-box;
          .iconfont{
            color: #fff;
            display: inline-block;
            font-size: 14px;
            margin-right: 8px;
            vertical-align: middle;
          }
          i{
            position: absolute;
            right: -15px;
            top: 0;
            font-size: 14px;
            width: 15px;
            height: 15px;
            color: #333;
          }
        }
      }
      .group{
        width: 100%;
        padding: 10px;
        background-color: #f7f7f7;
        border: 1px solid #eee;
      }
    }
  }
</style>
