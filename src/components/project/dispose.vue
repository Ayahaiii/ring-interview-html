<template>
  <div id="dispose">
    <!-- 项目列表 -->
    <el-row style="margin-top:0px">
      <el-form :hide-required-asterisk='true' size='mini' label-position="left" :model="searchForm" ref="searchForm" label-width="290px" class="demo-ruleForm">
        <el-col :span='24'>
          <el-form-item label="客户端现场定位：" prop="localhost">
            <el-select size='mini' v-model="searchForm.localhost" placeholder="请选择" style="width: 80px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="客户端轨迹监控：" prop="monitor">
            <el-select size='mini' v-model="searchForm.monitor" placeholder="请选择" style="width: 80px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="追踪访谈（一个研究对象多个访谈）：" prop="interview">
            <el-select size='mini' v-model="searchForm.interview" placeholder="请选择" style="width: 80px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="焦点小组（一个访谈多个研究对象）：" prop="focus">
            <el-select size='mini' v-model="searchForm.focus" placeholder="请选择" style="width: 80px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="项目生效时间到期后自动暂停：" prop="beginTime">
            <el-select size='mini' v-model="searchForm.beginTime" placeholder="请选择" style="width: 80px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
            <el-button type="primary" class="mini" size='mini' style="width: 100px; margin-top: 30px" @click="save('searchForm')"><span class="mini">保存</span></el-button>
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
      options: [{value: 1,label: '启动'}, {value: 0,label: '暂停'}],
      searchForm: {
        localhost: 1,
        monitor: 0,
        interview: 1,
        focus: 1,
        beginTime: 0,
      }
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
      color: #5873b4;
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
