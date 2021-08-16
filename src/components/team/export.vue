<template>
  <div id="exportTeam">
    <div class="export">
      <div class="tit">导出数据范围</div>
      <div class="check">
        <el-radio-group v-model="radio">
          <div class="radio"><el-radio :label="1">导出全部32个团队成员</el-radio></div>
          <div class="radio"><el-radio :label="2">导出所有32个检索结果</el-radio></div>
          <div class="radio"><el-radio :label="3">导出全部选择的8个团队成员</el-radio></div>
        </el-radio-group>
      </div>
      <!-- 属性 -->
      <div class="tit">全部属性</div>
      <div>
        <el-transfer :titles="['全部属性', '导出属性']" v-model="value" :data="attributeList"></el-transfer>
      </div>
      <!-- 导出格式 -->
      <div>
        <el-row class="li">
          <el-col :span='2'><span class="fw">导出格式 :</span></el-col>
          <el-col :span='2'><span class="fs12">Excel格式</span></el-col>
          <el-col :span='2'><span class="fs12">CSV格式</span></el-col>
          <el-col :span='2'><span class="fs12">TXT格式</span></el-col>
        </el-row>

        <el-row class="li">
          <el-col :span='2'><span class="fw">导出备注 :</span></el-col>
          <el-col :span='22'>
            <el-input type='textarea' :autosize="{ minRows: 3, maxRows: 5}"></el-input>
          </el-col>
        </el-row>

        <el-row class="li">
          <el-col :span='3'><el-button type='primary' size='small' class="eBtn mini"><span>导出</span></el-button></el-col>
          <el-col :span='3'><el-button type='primary' size='small' class="eBtn mini"><span>取消</span></el-button></el-col>
        </el-row>

        <el-row class="li">
          <el-col :span='2'><span class="fw">导出历史 :</span></el-col>
          <el-col :span='24'>

          </el-col>
        </el-row>
      </div>

      <!-- 导出历史 -->
      <div class="history">
        <el-table ref="workerList"
        :data="workerList"
        class="workerForm"
        size='mini'
        v-loading='loading'
        style="width: 100%">
          <el-table-column label="导出时间" prop='time' align='center' width='180'></el-table-column>
          <el-table-column label="姓名" prop='name' align='center' width='100'></el-table-column>
          <el-table-column label="导出条数" prop='export' align='center' width='100'></el-table-column>
          <el-table-column label="备注" prop='remarks' align='center'></el-table-column>
          <el-table-column label="格式" prop='format' align='center' width='100'></el-table-column>
          <el-table-column label="类型" prop='type' align='center' width='100'></el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="workerList.length > 0">
          <el-pagination
            @size-change="handleSizeChange()"
            @current-change="handleCurrentChange()"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'>
          </el-pagination>
        </div>
      </div>
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
      radio: 1,
      attributeList: [{ key: 1, label: '团队成员ID', disabled: false },
                      { key: 2, label: '姓名', disabled: false },
                      { key: 3, label: '锐研账号-用户名', disabled: false },
                      { key: 4, label: '锐研账号-邮箱', disabled: false },
                      { key: 5, label: '锐研账号-手机', disabled: false },
                      { key: 6, label: '角色', disabled: false },
                      { key: 7, label: '分组', disabled: false },
                      { key: 8, label: '研究对象数量', disabled: false },
                      { key: 9, label: '访谈数量', disabled: false },
                      { key: 10, label: '授权类型', disabled: false },
                      { key: 11, label: '授权日期', disabled: false },
                      { key: 12, label: '加入日期', disabled: false },
                    ],
      value: '',
      workerList: [
        {time: '2020-02-01 12:00:09', name: 'admin', export: 4, remarks: '那是肯定是哪来的', format: 'Excel格式', type: '[下载]'},
        {time: '2020-02-01 12:00:09', name: 'admin', export: 4, remarks: '那是肯定是哪来的', format: 'CSV格式', type: '[下载]'},
        {time: '2020-02-01 12:00:09', name: 'admin', export: 4, remarks: '那是肯定是哪来的', format: 'TXT格式', type: '[下载]'},
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
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
    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  }
}
</script>

<style scoped>
  .history>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  #exportTeam>>>.el-pagination span{
    font-size: 12px;
  }
  #exportTeam>>>.el-table .cell {
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
  .export>>>.el-radio__label {
    font-size: 12px;
    padding-left: 10px;
  }
  #exportTeam>>>.el-transfer-panel__item.el-checkbox .el-checkbox__label span{
    font-size: 12px !important;
  }
  #exportTeam>>>.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 13px;
    color: #303133;
    font-weight: normal;
  }
  #exportTeam>>>.el-button--primary.is-disabled, .el-button--primary.is-disabled:hover, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:active {
    color: #fff;
    background-color: #acb9da;
    border-color: #acb9da;
    padding: 5px;
  }
</style>
<style lang="scss" scoped>
  #exportTeam{
    .export{
      .tit{
        margin: 0px 0 20px;
        font-size: 14px;
        color: #444;
      }
      .check{
        .radio{
          margin-bottom: 20px;
        }
      }
      .li{
        margin: 30px 0;
        font-size: 14px;
        color: #444;

        .eBtn{
          width: 70%;
        }
      }
    }
  }
</style>
