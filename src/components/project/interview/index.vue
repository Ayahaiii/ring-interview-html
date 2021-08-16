<template>
  <div id="inter">
    <!-- 搜索框 -->
    <div class="search">
      <el-row :gutter="15">
        <el-col :span='11'>
          <div class="fl"><span>关键词 :</span></div>
          <div class="fr w9"><el-input size='mini' placeholder="输入关键字进行智能搜索" v-model="keyword" clearable></el-input></div>
        </el-col>
        <el-col :span='2' v-if="!checked">
          <el-button type='primary' size='mini' class="mini" @click="getList" style="width: 100%"><span>搜索</span></el-button>
        </el-col>
        <el-col :span='2'>
          <div><el-checkbox v-model="checked">样本筛选</el-checkbox></div>
        </el-col>
      </el-row>
      <!-- 样本筛选 -->
      <div v-if="checked">
        <el-row>
          <el-form :hide-required-asterisk='true' label-position="left" size='mini' :model="searchForm" ref="searchForm" label-width="80px" class="demo-ruleForm">
            <el-col :span='24'>
              <el-form-item label="样本筛选 :">
                <div v-for="(cond,index) in sampleConditions" :key="index">
                  <el-row :gutter="15">
                    <el-col :span="10">
                      <el-select v-model="cond.type" clearable placeholder="请选择样本属性" size="mini" style="width: 100%;">
                        <el-option v-for="(item, index) in sampleList" :key="index" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="5">
                      <el-select v-model="cond.option" placeholder="请选择关系" size="mini" clearable>
                        <el-option v-for="item in relativeList" :key="'re'+item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-input :maxlength="20" v-model="cond.content" placeholder="请输入" size="mini" clearable></el-input>
                    </el-col>
                    <el-col :span="3">
                      <el-select @change="selectAndOr(cond, index, 'sample')" v-model="cond.andOr" placeholder="请选择" size="mini" clearable v-if="cond.show">
                        <el-option
                          v-for="item in andOrs"
                          :key="'and'+item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span='2' style="margin-left: 80px">
            <el-button type='primary' size='mini' class="mini" @click="getList" style="width: 100%"><span>搜索</span></el-button>
          </el-col>
          <el-col :span='2' style="margin: 0px 0 0 20px">
            <el-button type='primary' plain size='mini' class="mini" @click="clearText" style="width: 100%"><span>清空</span></el-button>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 创建框 -->
    <div>
      <el-row>
        <div class="add" @click="addInterview" v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_ADD}">
          <span class="iconfont fw">&#xe612;</span><span>创建访谈</span>
        </div>
        <div class="add" @click="exportTeam" v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_EXPORT}">
          <span class="iconfont fw">&#xe629;</span><span>批量导出</span>
        </div>
        <div class="add" @click="deleteMore && !isSample" v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_DELETE}">
          <span class="iconfont fw">&#xe606;</span><span>批量删除</span>
        </div>
      </el-row>
    </div>

    <!-- 列表 -->
    <div class="nav">
      <el-table ref="workerList"
      :data="workerList"
      size='small'
      class="workerForm"
      v-loading='loading'
      @selection-change="handleSelectionChange"
      style="width: 100%">
        <el-table-column type="selection" width="45" align='center'></el-table-column>
        <el-table-column label="#" type="index" width="45" align='center'></el-table-column>
        <el-table-column label="访谈名称" prop='name' align='center'></el-table-column>
        <el-table-column label="访谈对象" prop='sampleName' align='center'></el-table-column>
        <el-table-column label="负责人" prop='managerName' align='center' width='90'></el-table-column>
        <el-table-column label="协作者" prop='assistantName' align='center'></el-table-column>
        <el-table-column label="状态" prop='status' width='75' align='center' fixed="right"
        :filters="fliterList"
        :filter-method="filterHandler"
        filter-placement="bottom-end">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" class="tag1">计划中</span>
            <span v-if="scope.row.status == 2" class="tag2">执行中</span>
            <span v-if="scope.row.status == 3" class="tag3">整理中</span>
            <span v-if="scope.row.status == 4" class="tag4">审核中</span>
            <span v-if="scope.row.status == 5" class="tag5">已完成</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align='center' fixed="right" width='200'>
          <template slot-scope="scope">
            <span class="cao" v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_VIEW}" @click="goDetail(scope.row.id, scope.row.status, scope.row.name)">详情</span>
            <span class="cao" v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_EDIT}"  @click="editor(scope.row.id, scope.row.status, scope.row.name)">编辑</span>
            <el-dropdown trigger="click"  placement="bottom">
              <span class="el-dropdown-link cao">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <span v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_TEXT_VIEW}">
                  <el-dropdown-item :disabled='project_status == 0'><div class="del" @click="goSpeaker(scope.row.id, scope.row.status, scope.row.name)">对话文本</div></el-dropdown-item>
                </span>
                <span v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_VOICE_VIEW}">
                  <el-dropdown-item :disabled='project_status == 0'><div class="del" @click="goVoice(scope.row.id, scope.row.status, scope.row.name)">录音</div></el-dropdown-item>
                </span>
                <span v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_FILE_VIEW}">
                  <el-dropdown-item :disabled='project_status == 0'><div class="del" @click="goAnnex(scope.row.id, scope.row.status, scope.row.name)">附件</div></el-dropdown-item>
                </span>
                <span v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_DELETE}">
                  <el-dropdown-item ><div class="del" @click="detail(scope.row.id)" v-if="!isSample">删除</div></el-dropdown-item>
                </span>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination" v-if="workerList.length > 0">
      <el-pagination
        @size-change="handleSizeChange()"
        @current-change="handleCurrentChange()"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total='total'
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['project_status'],
  data () {
    return {
      projectId: null,
      isSample: false,
      sampleId: null,
      breadcrumbList: [
        {
          name: '访谈',
        }
      ],
      checked: false,
      searchForm: {},
      // 样本筛选
      sampleConditions: [
        {                                               //筛选条件值集合
          type: '',                                     //字段值
          option: '',                                   //操作值
          andOr: '',                                    //逻辑值
          content:'',
          show: true
        }
      ],
      andOrs: [                                        //筛选条件逻辑属性
        {value:'and', label:'并且'},
        {value:'or', label:'或者'}
      ],
      sampleList: [],
      relativeList: [
        {value: '=', label: '等于'},
        {value: '>', label: '大于'},
        {value: '<', label: '小于'},
        {value: '!=', label: '不等于'},
        {value: 'like', label: '包含'},
        {value: 'not like', label: '不包含'}
      ],
      option: 1,
      fliterList: [],
      group: 1,
      role: 1,
      status: 1,
      keyword: '',
      selWord: '',
      groupList: [{value: 1,label: '全部'}, {value: 2,label: '访问员'}, {value: 3,label: '质检员'}, {value: 4,label: '分析员'}, {value: 5,label: '管理员'}],
      roleList:[{value: 1,label: '全部'}, {value: 2,label: '访问员'}, {value: 3,label: '质检员'}, {value: 4,label: '分析员'}, {value: 5,label: '管理员'}],
      workerList: [],
      interviewIdArr: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      multipleSelection: [],
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: null,
      interviewName: null,
    })
    if (this.$route.query.sId) {
      this.sampleId = this.$route.query.sId
    } else {
      this.sampleId = null
    }
    this.projectId = this.$route.query.id
    this.httpPost('/project/get/visit/' + this.projectId).then(res => {
      console.log(res.data)
      if (res.data == 1) {
        this.isSample = true
      }
    })
    this.getMark()
    this.getList()
  },
  computed:{
    ...mapState(['allProperty'])
  },
  methods: {
    /*初始化筛选条件*/
    initCondition () {
      let cond = {
        type: '',
        option: '',
        andOr: '',
        content:'',
        show: true
      }
      return cond;
    },
    /*筛选条件动态增减*/
    selectAndOr (cond, index, item) {
      var tempList;
      tempList = this.sampleConditions
      if (cond.andOr != '') {
        for (let i = 0; i < tempList.length; i++){
            if (tempList[i].type == '' || tempList[i].option == '' || tempList[i].content == '') {
              if (index + 1 == tempList.length) {
                cond.andOr = '';
                this.$message.info('请完整填写第'+ (i+1) +'条筛选条件后可继续添加筛选条件！');
              }
              return;
            }
        }
        if (index < 3 && index != 1) {
          if (index + 1 == tempList.length) {
            this.sampleConditions.push(this.initCondition())
          }
        } else if (index == 1) {
          var condItem = {
            type: '',
            option: '',
            andOr: '',
            content:'',
            show: false
          }
          if (index + 1 == tempList.length) {
            this.sampleConditions.push(condItem)
          }
        }
      } else {
        for (let i = index + 1; i < tempList.length; i++){
          tempList.splice(i, 1);
          i--;
        }
      }
    },
    /*转换信息及筛选条件*/
    exchangeCondition (tempList){
      let condition = ''
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i].content == '') {
          if (i != 0 && i + 1 == tempList.length){
            condition = condition.substring(0, condition.lastIndexOf(tempList[i-1].andOr));
          }
          continue;
        }
        if (tempList[i].type == '' || tempList[i].option == '') continue;
          condition += 's.'+tempList[i].type + " " + tempList[i].option;
        if (tempList[i].option == 'like' || tempList[i].option == 'not like') {
          condition += " '%" + tempList[i].content + "%' " + tempList[i].andOr + " ";
        } else {
          condition += " '" + tempList[i].content + "' " + tempList[i].andOr + " ";
        }
      }
      return condition
    },
    //获取样本属性
    getMark () {
      this.sampleList = []
      let _this = this
      this.httpPost(`/sample/property/get/${this.projectId}`).then(res => {
        if (res.code == 0) {
          if (res.data != null) {
            var mark = JSON.parse(res.data.markProperty)
            this.allProperty.forEach(item => {
              mark.forEach(ma => {
                if (item.key == ma && item.key != 'managerName') {
                  let obj = {}
                  obj.id = item.key
                  obj.name = item.label
                  this.sampleList.push(obj)
                }
              })
            })
          }
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    // 清空
    clearText () {
      this.keyword = null
      this.sampleConditions = [
        {                                               //筛选条件值集合
          type: '',                                     //字段值
          option: '',                                   //操作值
          andOr: '',                                    //逻辑值
          content:'',
          show: true
        }
      ]
    },
    // 查询列表
    getList () {
      var sCon = null
      if (this.sampleConditions.length > 0) {
        sCon = this.exchangeCondition(this.sampleConditions)
      }
      this.selWord = this.keyword
      this.loading = true
      this.fliterList = []
      let params = {
        "sampleCondition": sCon,
        "keyword": this.keyword,
        "pageNum": this.currentPage,
        "pageSize": this.pageSize,
        "projectId": +this.projectId,
        "sampleId": +this.sampleId
      }
      this.httpPost('/interview/list', params).then(res => {
        if (res.code == 0) {
          this.workerList = res.data.data
          this.total = res.data.total
          var valList = []
          this.workerList.forEach(item => {
            if (valList.indexOf(item.status) == -1) {
              valList.push(item.status)
            }
          })
          valList.forEach(item => {
            if (item == 1) {
              this.fliterList.push({ text: '计划中', value: 1 })
            } else if (item == 2) {
              this.fliterList.push({ text: '执行中', value: 2 })
            } else if (item == 3) {
              this.fliterList.push({ text: '整理中', value: 3 })
            } else if (item == 4) {
              this.fliterList.push({ text: '审核中', value: 4 })
            } else if (item == 5) {
              this.fliterList.push({ text: '已完成', value: 5 })
            }
          })
          this.loading = false
        } else {
          this.loading = false
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.loading = false
        this.$message({type: 'error', message: error})
      })
    },
    // 创建访谈
    addInterview () {
      if (this.project_status == 3) {
        this.$message({type: 'warning', message: '项目已结束，无法创建新的访谈项目'})
        return
      } else {
        this.$router.push({path: '/talk/create', query: {id: this.projectId}})
      }
    },
    // 编辑
    editor (id, status, name) {
      this.$router.push({path: '/talk/create', query: {id: this.projectId, status: status, ina: name, inId: id, edit: 'edit'}})
    },
    // 导出
    exportTeam () {
      if (this.interviewIdArr.length > 0) {
        this.option = 'C'
        this.$router.push({
          path: '/talk/export',
          query: {
            id: this.projectId,
            sIds: JSON.stringify(this.interviewIdArr),
            opt: this.option
          },
          // TODO
          params: {
          }
        })
      } else {
        this.option = 'A'
        this.$router.push({
          path: '/talk/export',
          query: {
            id: this.projectId,
            sIds: null,
            opt: this.option
          },
          // TODO
          params: {
            keyword: this.selWord
          }
        })
      }
    },
    // 删除方法
    deleteItem (item) {
      let params = {
        interviewIds: item,
        projectId: +this.projectId
      }
      this.httpPost('/interview/delete', params).then(res => {
        if (res.code == 0) {
          this.getList()
          this.$message({type: 'success', message: res.message})
          this.interviewIdArr = []
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    // 批量删除
    deleteMore () {
      if (this.interviewIdArr.length <= 0) {
        this.$message({type: 'warning', message: '请选择要删除的访谈'})
        return
      }
      this.$confirm('此操作将永久删除该访谈, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteItem(this.interviewIdArr)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 单次删除
    detail (id) {
      this.$confirm('此操作将永久删除该访谈, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.interviewIdArr = []
        this.interviewIdArr[0] = id
        this.deleteItem(this.interviewIdArr)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 前往详情页
    goDetail (id, status, name) {
      this.$router.push({path: '/talk/info', query: {id: this.projectId, sta: status, inId: id, ina: name}})
    },
    // 前往对话文本
    goSpeaker (id, status, name) {
      this.$router.push({path: '/talk/text', query: {id: this.projectId, sta: status, inId: id, ina: name}})
    },
    // 前往录音页面
    goVoice (id, status, name) {
      this.$router.push({path: '/talk/voice', query: {id: this.projectId, sta: status, inId: id, ina: name}})
    },
    // 前往附件页面
    goAnnex (id, status, name) {
      this.$router.push({path: '/talk/annex', query: {id: this.projectId, sta: status, inId: id, ina: name}})
    },
    // 列表选择状态改变
    handleSelectionChange(val) {
      this.interviewIdArr = []
      val.forEach(item => {
        this.interviewIdArr.push(item.id)
      })
    },
    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList()
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  }
}
</script>

<style scoped>
  .nav>>>.el-table th, .el-table tr {
    background-color: #eee;
  }
  #inter>>>.el-table td div {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 12px;
  }
  #inter>>>.el-table--small td {
    padding: 3px 0;
  }
  #inter>>>.el-checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 32px;
    font-size: 12px;
  }
  #inter>>>.el-form-item--mini.el-form-item {
    margin-bottom: 0px;
  }
  #inter>>>.el-form-item--mini .el-form-item__label {
    line-height: 28px;
    font-size: 12px;
  }
  #inter>>>.el-pagination span{
    font-size: 12px;
  }
  #inter>>>.el-button--mini {
    padding: 6.5px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-top: 3px;
  }
  #inter>>>.el-select .el-input .el-select__caret {
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
  .nav>>>.el-table th, .el-table td {
    padding: 3px 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: center;
  }
  .workerForm>>>.el-table__header {
    table-layout: fixed;
    border-collapse: separate;
    background-color: #eee;
  }
  .nav>>>.el-table th>.cell {
    color: #888;
  }
</style>
<style lang="scss" scoped>
  #inter{
    div{
      overflow: hidden;
    }
    .fl{
      float: left;
      width: 80px;
      line-height: 32px;
      font-size: 12px;
      color: #555;
      span{
        font-size: 12px;
      }
    }
    .fr{
      float: left;
      line-height: 32px;
    }
    .w5{
      width: 73%;
    }
    .w9{
      width: 406px;
    }
    .search{
      margin: 0px 0 20px 0;
    }
    .searchHeight{
      line-height: 30px;
      .text{
        cursor: pointer;
        font-size: 12px;
      }
      span{
        color: #1486c6;
      }
    }
    .add{
      margin: 0px 40px 20px 0;
      float: left;
      .fw{
        font-size: 15px;
        font-weight: bold;
      }
      span{
        color: #2e83d3;
        padding-right: 5px;
        font-weight: 500;
        cursor: pointer;
      }
    }
    .tag{
        display: inline-block;
        padding: 0px 8px;
        color: #fff;
        font-size: 11px;
        width: 54px;
        border-radius: 2px;
      }
    .tag1{
      @extend .tag;
      background-color: #4b8ac5;
    }
    .tag2{
      @extend .tag;
      background-color: #1db0cf;
    }
    .tag3{
      @extend .tag;
      background-color: #ea913a;
    }
    .tag4{
      @extend .tag;
      background-color: #f488b3;
    }
    .tag5{
      @extend .tag;
      background-color: #77b936;
    }
    .cao{
      display: inline-block;
      margin-left: 8px;
      font-size: 12px;
      cursor: pointer;
      vertical-align: top;
      margin-top: 5px;
    }
  }
</style>
