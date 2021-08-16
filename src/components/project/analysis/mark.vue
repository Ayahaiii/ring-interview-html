<template>
  <div id="aysLabel">

    <!-- 搜索框 -->
    <div class="search">
      <el-row :gutter="10">
        <el-col :span='2'>
          <span class="fs12 fl">样本信息 :</span>
        </el-col>
        <el-col :span='4'>
          <div class="fs12 fl" style="width: 100%"><el-input size='mini' placeholder="输入样本信息" v-model="sampleName" clearable></el-input></div>
        </el-col>
        <el-col :span='2'>
          <span class="fs12 fl">编码信息 :</span>
        </el-col>
        <el-col :span='4'>
          <div class="fs12 fl" style="width: 100%"><el-input size='mini' placeholder="输入编码信息" v-model="keyword" clearable></el-input></div>
        </el-col>
        <el-col :span='2'>
          <span class="fs12 fl">标注备注 :</span>
        </el-col>
        <el-col :span='6'>
          <div class="fs12 fl" style="width: 100%"><el-input size='mini' placeholder="输入标注备注" v-model="note" clearable></el-input></div>
        </el-col>
        <el-col :span='1' style="line-height: 32px;">
          <el-button type='primary' size='mini' class="mini" @click="getList"><span>搜索</span></el-button>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span='24'>
        <!-- 创建框 -->
        <div>
          <el-row>
            <div class="add" @click="exportTeam && !isSample"><span class="iconfont fw">&#xe629;</span><span>批量导出</span></div>
            <div class="add" @click="deleteMore && !isSample"><span class="iconfont fw">&#xe606;</span><span>批量删除</span></div>
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
            <el-table-column label="编码" prop='codeName' align='center' width='100'></el-table-column>
            <el-table-column label="备注" prop='note' align='center'>
              <template slot-scope="scope">
                <span v-if="scope.row.note.length <= 8" class="fs12">{{ scope.row.note ? scope.row.note : '--' }}</span>
                <el-tooltip v-if="scope.row.note.length > 8" :content="scope.row.note" placement="top" effect="light">
                  <span class="fs12">{{ scope.row.note ? scope.row.note.substring(0, 8) + '...' : '--' }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="引文" prop='text' align='center'>
              <template slot-scope="scope">
                <span v-if="scope.row.text.length <= 8" class="fs12">{{ scope.row.text ? scope.row.text : '--' }}</span>
                <el-tooltip v-if="scope.row.text.length > 8" :content="scope.row.text" placement="top" effect="light">
                  <span class="fs12">{{ scope.row.text ? scope.row.text.substring(0, 8) + '...' : '--' }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="样本姓名" prop='sampleName' align='center' width='100'></el-table-column>
            <el-table-column label="样本编号" prop='sampleCode' align='center' width='100'></el-table-column>
            <el-table-column label="创建人" prop='userName' align='center' width='100'></el-table-column>
            <el-table-column label="修改时间" prop='createTime' align='center' width='150'></el-table-column>
            <el-table-column label="操作" align='center' fixed="right">
              <template slot-scope="scope">
                <el-button type='primary' plain size='mini' class="mini"><span @click="edit(scope.row)">编辑</span></el-button>
                <el-button type='danger' plain size='mini' class="mini"><span @click="deleteMark(scope.row.id)">删除</span></el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination" v-if="workerList.length > 0">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total='total'>
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 显示弹框 -->
    <el-dialog
      title="编辑标注"
      :visible.sync="dialogOption"
      width="40%">
      <div>
        <div style='background-color: #f1f1f1;padding: 0px 10px;'>
          <div class="fs12" style="padding: 10px 0 20px;">引文：</div>
          <div class="fs12 txt">
            <span class="fs12" style="color: #fff; background-color: #2e83d3;" v-text="form.text"></span>
          </div>
          <div style='text-align: right;padding: 10px 0;color: #2e83d3;cursor:pointer' class="fs12" @click="goCheck(form.sampleId, form.sampleName)">查看访谈全部文本</div>
        </div>
        <div>
          <el-row style='margin: 20px 0;'>
            <el-col :span='2' class="fs12">编码：</el-col>
            <!-- <el-col :span='22'><el-input v-model="form.codeName" size='mini'></el-input></el-col> -->
            <el-select size='mini' v-model="codeArr" multiple filterable allow-create default-first-option placeholder="请选择编码" @change='selectOption'>
              <el-option
                v-for="item in labelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-row>
          <el-row style='margin: 20px 0 170px;'>
            <el-col :span='2' class="fs12">备注：</el-col>
            <el-col :span='22'><el-input v-model="form.note" :autosize="{ minRows: 4, maxRows: 8}" size='mini' type='textarea' ></el-input></el-col>
          </el-row>
        </div>
        <div style="text-align: center">
          <el-button type='primary' plain size='mini' class="mini"><span @click="saveMark">保存</span></el-button>
          <el-button type='primary' plain size='mini' class="mini"><span @click="cancelMark">取消</span></el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .txt button{
    font-size: 12px;
    background-color: #2e83d3;
    border: 1px solid #2e83d3;
    color: #fff;
  }
</style>

<script>
import {export2Excel} from '../../../utils/excel'
  export default {
    props: ['userId'],
    data () {
      return {
        projectId: null,
        isSample: false,
        breadcrumbList: [
          {
            name: '质性分析',
            path: '/analysis/index'
          },
          {
            name: '标注管理',
          }
        ],
        interviewArr:"",
        codeArr: [],
        labelOptions: [],
        sampleName: '',
        keyword: '',
        note: '',
        dialogOption: false,
        form: {
          id: '',
          codeId: '',
          note: '',
          text: '',
          sampleId: ''
        },
        name: '',
        workerList: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        interviewIdArr: [],
      }
    },

    created () {
      this.$emit('getSamllChild', {
        breadcrumbList: this.breadcrumbList,
        link: null
      })
      this.projectId = this.$route.query.id
      this.httpPost('/project/get/visit/' + this.projectId).then(res => {
        console.log(res.data)
        if (res.data == 1) {
          this.isSample = true
        }
      })
      this.getList()
      this.getCodeOption()   // 获取编码列表
    },

    methods: {
      // 获取编码的列表
      getCodeOption () {
        var params;
          if (this.codeArr) {
            params = {
              projectId: this.projectId,
              name: this.codeArr[0]
            }
          } else {
            params = {
              projectId: this.projectId,
              name: null
            }
          }
        this.httpPost('/analyze/code/list/page', params).then(res => {
          if (res.code == 0) {
            this.labelOptions = []
            // this.total = res.data.tota
            res.data.data.forEach(item => {
              let obj = {
                value: item.id,
                label: item.name
              }
              this.labelOptions.push(obj)
            })
          }
        })
      },
      // 创建编码
      addCode () {
        if (this.codeArr[0].length > 5) {
          this.$message({type: 'warning', message: '编码长度不超过5个字符'})
          return
        }
        let params = {
          name: this.codeArr[0],
          type: 1,
          projectId: +this.projectId
        }
        this.httpPost('/analyze/code/save', params).then(res => {
          if (res.code == 0) {
            this.codeArr = []
            this.getCodeOption()
          }
        })
      },
      // 选择编码
      selectOption (val) {
        var nameList = this.codeArr
        if (nameList.length > 1) {
          let arr = []
          arr.push(nameList[nameList.length-1])
          this.codeArr = arr
        }
        if (typeof(this.codeArr[0]) == 'string') {
          this.addCode()
        }
      },
      getList () {
       let _this = this
        this.httpPost('/analyze/mark/list/page', {
          "sampleName": this.sampleName,
          "userId": this.userId,
          "keyword": this.keyword,
          "note": this.note,
          "projectId": this.projectId,
          "pageNum": this.currentPage,
          "pageSize": this.currentSize,
        }).then(res => {
          if (res.code == 0) {
            this.workerList = res.data.data
            this.currentPage = res.data.pageNum
            this.currentSize = res.data.pageSize
            this.total = res.data.total
          }
        })
      },
      // 导出数据
      exportTeam () {
      const tHeader = ['编码', '备注','引文','样本姓名','样本编号','创建人','修改时间']
      const filterVal = ['codeName', 'note','text','sampleName','sampleCode','userName','createTime']
      const list = this.interviewArr
      const fileName = '样本标注表格'
      export2Excel(tHeader, filterVal, list, fileName);
      },

      deleteMore () {
        let ids = []
        if (this.interviewIdArr.length == 0) {
          // 弹出错误信息
          this.$message({type: 'warning', message: '请选择需要删除的标注'})
          return;
        }
        for(let i = 0; i < this.interviewIdArr.length; i++) {
          ids = this.interviewIdArr
        }
        this.$confirm('确定移除标注吗？, 是否移除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            ids: ids,
            projectId: this.projectId
          }
          this.httpPost('/analyze/mark/delete', params).then(res => {
            if (res.code === 0) {
              this.getList()
              this.$message({
                type: 'success',
                message: '移除成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      edit (row) {
        this.dialogOption = true
        this.form = row
        this.codeArr = [this.form.codeId]
      },

      saveMark() {
        this.labelOptions.forEach(item => {
          if (item.value == this.codeArr[0]) {
            this.name = item.label
          }
        })
        let params = {
          id: this.form.id,
          codeId: this.form.codeId,
          codeName: this.name,
          note: this.form.note,
          text: this.form.text,
          sampleId: this.form.sampleId
        }
        params.projectId = this.projectId
        this.httpPost('/analyze/mark/update', params).then(res => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.form = {
              id: '',
              codeId: '',
              note: '',
              text: '',
              sampleId: ''
            }
            this.codeArr = []
            this.name = ''
            this.getList()
            this.dialogOption = false
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
      },

      cancelMark() {
        this.dialogOption = false
        this.form = {
          id: '',
          codeId: '',
          codeName: '',
          note: '',
          text: '',
          sampleId: ''
        }
        this.name = ''
        this.codeArr = []
      },

      deleteMark (id) {
        let ids = []
        ids.push(id)
        this.$confirm('确定移除标注吗？, 是否移除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            ids: ids,
            projectId: this.projectId
          }
          this.httpPost('/analyze/mark/delete', params).then(res => {
            if (res.code === 0) {
              this.getList()
              this.$message({
                type: 'success',
                message: '移除成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      goCheck (id, name) {
        this.$router.push({path: '/analysis/text', query: {id: this.projectId, sId: id, name: name}})
      },

      // 列表选择状态改变
      handleSelectionChange(val) {
          this.interviewArr =val
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
    }
  }
</script>

<style scoped>
  #aysLabel>>>.el-select__tags-text{
    font-size: 12px !important;
  }
  #aysLabel>>>.el-button--mini {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 3px;
  }
  #aysLabel>>>.el-table td div {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 12px;
  }
  #aysLabel>>>.el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 12px;
  }
</style>
<style lang="scss" scoped>
  .code{
    font-size: 12px;
  }
  .search{
    margin: 20px 0 20px 0;
    .fl{
      float: left;
      line-height: 32px;
      font-size: 12px;
      color: #555;
      span{
        font-size: 12px;
      }
    }
    .fr{
      float: right;
      line-height: 32px;
    }
    .w9{
      width: 85%;
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
  .list{
    overflow: hidden;
    .all{
      font-size: 12px;
      float: left;
      display: inline-block;
      padding: 2px 5px;
      margin-right: 10px;
    }
    .bgc{
      color: #fff;
      border-radius: 3px;
      background-color: #2e83d3;
    }
    .item {
      font-size: 12px;
      float: left;
      display: inline-block;
      padding: 2px 5px;
      margin-right: 10px;
    }
  }
</style>
