<template>
  <div id="aysStatistics">
    <el-row>
      <el-col class="mt20" :span="24">
        <span>样本</span>
        <el-button size='mini' type='primary' plain class="mini" @click="analyzeListPage">选择</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" >
        <div class="box1">
          <div class="item" v-for="(item, index) in sampleList" :key="'sam'+index">
            <div>{{ item.name }}</div>
            <div>{{ item.code }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span='12'>
        <div class="li"><span class="name">词性选择</span></div>
        <div class="box">
          <div class="item pointer" v-for="(word, index) in words" :key="index" :class="{active: word.isActive}" @click="changeActive(word, word.id)">
            <div> {{word.label}}</div>
          </div>
        </div>
      </el-col>
      <el-col :span='12'>
        <div class="li"><span class="name">自定义词典</span></div>
        <div class="box pointer" @click="dialogOption = true">
          <div class="item item1" v-for="(word, index) in customWords" :key="index">
            <div @click.stop>{{word}}<i class="el-icon-circle-close" @click.stop="deletedDefinedWord(word, index)"></i></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <div>
          <el-row style="margin: 20px 0;">
            <el-col :span='2'><span class="code">词云图</span></el-col>
            <el-col :span='3'><span v-bind:class="{col: type=='tab'}" class="iconfont iconfont1" @click="changeType('tab')">&#xe667;</span><span @click="changeType('img')" v-bind:class="{col: type=='img'}" class="iconfont iconfont1">&#xe652;</span></el-col>
            <el-col :span='3' class="fr tr color fs12"> <span @click="exportTab"><span class="iconfont color" >&#xe629;</span>导出结果</span> </el-col>
            <!-- <el-col :span='3' class="fr tr color fs12"><span class="iconfont color">&#xe6fe;</span>另存为图片</el-col> -->
          </el-row>
        </div>
        <div class="cy" v-show="type == 'img'">
          <div :ref="'chart1'" style="width:100%; height:400px"></div>
        </div>
        <div v-show="type == 'tab'">
          <el-table ref="wordList"
            :data="wordListPage"
            size='small'
            style="width: 100%"
          >
            <el-table-column label="词名" prop='word' align='center'></el-table-column>
            <el-table-column label="词频" prop='frequency' align='center'></el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChangeWord"
              @current-change="handleCurrentChangeWord"
              :current-page="wordCurrentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="wordPageSize"
              layout="total, prev, pager, next"
              :total='wordList.length'
              hide-on-single-page
            >
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 显示选项弹框 -->
    <el-dialog
      v-if = "dialogOption"
      title=""
      :visible.sync="dialogOption"
      width="35%"
      >
      <div>
        <el-form :model="form" ref="ruleForm" :rules="rules">
          <el-form-item  prop="name">
            <el-input v-model="form.name" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入词典名称" size="mini"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='mini' class="mini" @click="dialogOption = false"><span>取消</span></el-button>
        <el-button size='mini' class="mini" type="primary" @click="submitForm('ruleForm')"><span>确定</span></el-button>
      </span>
    </el-dialog>
    <!-- 样本选择弹框 -->
    <dialogCom
      :title="title"
      :sampleDialog="sampleDialog"
      :listAll="sampleListAll"
      :listChoose="sampleListChoose"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :total="total"
      @toHasWords="toHasWords"
      @toWaitWords="toWaitWords"
      @arrowRight="arrowRight"
      @arrowLeft="arrowLeft"
      @saveSample="saveSample"
      @cancelDia="cancelDia"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></dialogCom>
  </div>
</template>

<script>
import echarts from 'echarts'
import {export2Excel} from '../../../utils/excel'
import dialogCom from './dialogCom'
export default {
  components: {
    dialogCom
  },
  props: ['userId'],
  data () {
    return {
      projectId: null,
      breadcrumbList: [
        {
          name: '质性分析',
          path: '/analysis/index'
        },
        {
          name: '词频统计',
        }
      ],
      title: '选择样本',
      type: 'img',
      sampleList: [],
      sampleListAll: [],
      all: null,
      sampleListChoose: [],
      words:[                                               //分词词性
        {id: 1, value:"all",label:"全部",isActive:false},
        {id: 2, value:"n",label:"名词",isActive:false},
        {id: 3, value:"v",label:"动词",isActive:false},
        {id: 4, value:"r",label:"代词",isActive:false},
        {id: 5, value:"m",label:"数词",isActive:false},
        {id: 6, value:"q",label:"量词",isActive:false},
        {id: 7, value:"d",label:"副词",isActive:false},
        {id: 8, value:"p",label:"介词",isActive:false},
        {id: 9, value:"c",label:"连词",isActive:false},
        {id: 10, value:"u",label:"助词",isActive:false},
        {id: 11, value:"e",label:"叹词",isActive:false},
        // {id: 12, value:"h",label:"前缀",isActive:false},
        // {id: 13, value:"k",label:"后缀",isActive:false},
        // {id: 14, value:"w",label:"标点",isActive:false},
        {id: 15, value:"nr",label:"人名",isActive:false},
        {id: 16, value:"ns",label:"地名",isActive:false},
        {id: 17, value:"nt",label:"机构名",isActive:false},
        {id: 19, value:"a",label:"形容词",isActive:false},
        {id: 20, value:"b",label:"区间词",isActive:false},
        {id: 21, value:"z",label:"状态词",isActive:false},
        {id: 22, value:"t",label:"时间词",isActive:false},
        {id: 23, value:"s",label:"处所词",isActive:false},
        {id: 24, value:"f",label:"方位词",isActive:false},
        {id: 25, value:"y",label:"语气词",isActive:false},
        {id: 26, value:"o",label:"拟声词",isActive:false},
        // {id: 27, value:"x",label:"字符串",isActive:false},
        {id: 18, value:"udl",label:"自定义",isActive:false},
      ],
      customWords: [],
      dialogOption: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入字典名称', trigger: 'blur'}
        ]
      },
      markCloud: [],
      sampleDialog: false,
      currentPage: 1,
      pageSize: 20,
      total: 30,
      wordCurrentPage: 1,
      wordPageSize: 10,
      wordList: [],
      wordListPage: []
    }
  },

  created () {
    this.$emit('getSamllChild', {
      breadcrumbList: this.breadcrumbList,
      link: null
    })
    this.projectId = this.$route.query.id
  },
  mounted () {
    this.drawWordChart()
  },
  methods: {
    // 删除自定义词典
    deletedDefinedWord (val, index) {
      this.customWords.splice(index, 1)
    },
    // 切换显示图表
    changeType (val) {
      this.type = val
      if (val == 'img') {
        this.drawWordChart()
      }
    },
    /*切换词性颜色*/
    changeActive (word, id) {
      if (this.sampleListChoose.length != 0) {
        let words = this.words;
        if (word.value == 'all'){
          if (word.isActive){
            for (let i = 0; i < words.length; i++){
              words[i].isActive = false;
            }
          } else {
            for (let i = 0; i < words.length; i++){
              words[i].isActive = true;
            }
          }
        } else {
          words[0].isActive = false;
          if (word.isActive) {
            word.isActive = false;
          } else {
            word.isActive = true;
          }
        }
        this.saveSample()
      } else {
        this.$message.info('请先选择样本')
      }
    },
    // active
    filterAct (listAll, listChooose) {
      for(let k = 0; k < listChooose.length; k++){
        for(let i = 0; i < listAll.length; i++){
          if(listChooose[k].id == listAll[i].id){
            listAll[i].isActive = true
          }
        }
      }
    },
    //noneActive
    filterNAct(listAll, id) {
      for (let i = 0; i < listAll.length; i++) {
        if (listAll[i].id == id) {
          listAll[i].isActive = false
        }
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let name = this.form.name
          this.customWords.push(name)
          this.dialogOption = false
          this.form.name = ''
        } else {
          return false;
        }
      })
    },
    /*创建词云图*/
    drawWordChart(){
      var worldCloudcharts = echarts.init(this.$refs['chart1'])
      var worldCloudoption = {
        title: {
          x: 'center',
          textStyle: {
            fontSize: 23,
            color:'#FFFFFF'
          }
        },
        tooltip: {
          show: true
        },
        toolbox: {
      　　show: true,
      　　feature: {
      　　　　saveAsImage: {
        　　　　show:true,
        　　　　excludeComponents :['toolbox'],
        　　　　pixelRatio: 2
      　　　　}
      　　}
        },
        series: [{
          name: '',
          type: 'wordCloud',
          size: ['100%', '100%'],
          sizeRange: [12, 70],
          rotationRange: [-45, 90],
          textPadding: 10,
          drawOutOfBound:true,
          autoSize: {
            enable: true,
            minSize:12
          },
          textStyle: {
            normal: {
              color: function() {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')';
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: []
        }]
      };
      worldCloudoption.series[0].data = this.markCloud;
      worldCloudcharts.setOption(worldCloudoption);
    },
    //打开样本弹框
    analyzeListPage () {
      this.all = null
      this.httpPost('/analyze/list/page', {
        "pageNum": this.currentPage,
        "pageSize": this.pageSize,
        "projectId": this.projectId,
        "userId": null
      }).then(res => {
        if (res.code == 0) {
          for (let i of res.data.data) {
            i.isActive = false
          }
        }
        this.sampleListAll = res.data.data
        this.all = res.data.data
        this.filterAct(this.sampleListAll, this.sampleListChoose)
        this.pageSize = res.data.pageSize
        this.currentPage = res.data.pageNum
        this.total = res.data.total
        this.sampleDialog = true
      })
    },
    //关闭dialog
    cancelDia (boolean) {
      this.sampleDialog = boolean
    },
    //选择样本弹框保存事件
    saveSample () {
      if (this.sampleListChoose.length != 0) {
        let naturesList = []
        for (let i = 0; i < this.words.length; i++) {
          if (!this.words[0].isActive) {
            if (this.words[i].isActive) {
              naturesList.push(this.words[i].value)
            }
          }
        }
        let sIds = []
        for (let i = 0; i < this.sampleListChoose.length; i++) {
          if (this.sampleListChoose[i].isActive) {
            sIds.push(this.sampleListChoose[i].id)
          }
        }
        this.httpPost('/analyze/text/word', {
          "customWords": this.customWords,
          "natures": naturesList.length == 0 || naturesList.length == 27 ? null : naturesList,
          "projectId": this.projectId,
          "sampleIds": sIds,
        }).then(res => {
            if (res.code == 0) {
              this.sampleDialog = false
              this.markCloud = []
              this.wordList = []
              for(let key in res.data) {
                let obj = {}
                obj.name = key
                obj.value = res.data[key]
                this.markCloud.push(obj)
                let wordObj = {}
                wordObj.word = key
                wordObj.frequency = res.data[key]
                this.wordList.push(wordObj)
              }
              this.wordListPage = this.wordList.slice(0, 10)

              this.drawWordChart()
              this.sampleList = this.sampleListChoose

            }
          })
      } else {
        this.$message.info('请先选择样本')
      }
    },
    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val
      this.analyzeListPage()
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val
      this.analyzeListPage()
    },
    // 改变当前页码 样本编码
    handleSizeChangeWord(val) {
      this.wordListPage = this.wordList.slice(0, val)
      this.wordPageSize = val
    },
    // 改变当前每页条数 样本编码
    handleCurrentChangeWord(val) {
      this.wordListPage = this.wordList.slice(val*10-10, val*10)
      this.wordCurrentPage = val
    },
    //加入已选词语
    toHasWords:function(word){
      //判断是否已经存在待选词语
      for(let i = 0;i < this.sampleListChoose.length; i++){
        if(word.id == this.sampleListChoose[i].id){
          this.$message.info("该词语已存在，请重新添加！");
          return;
        }
      }
      word.isActive=true;
      this.sampleListChoose.push(word)
      this.filterAct(this.sampleListAll, this.sampleListChoose)
    },
    //加入待选词语
    toWaitWords:function(word,id){
      word.isActive=false
      this.sampleListChoose=this.sampleListChoose.filter(item=>item.id!=word.id);
      this.filterNAct(this.sampleListAll, word.id)
    },
    // 全选左
    arrowRight () {
      this.sampleListChoose = this.all
      this.sampleListChoose.forEach(item => {
        item.isActive = true
      })
      this.sampleListAll = []
    },
    // 全选右
    arrowLeft () {
      this.sampleListChoose = []
      this.sampleListAll = this.all
    },
    // 导出表格
    exportTab () {
      const tHeader = ['词名', '词频']
      const filterVal = ['word', 'frequency']
      const list = this.wordList
      const fileName = '样本编码表格'
      export2Excel(tHeader, filterVal, list, fileName);
    }
  }
}
</script>

<style scoped>

</style>
<style lang="scss" scoped>
#aysStatistics {
  .mt20 {
    margin: 20px 0;
    span {
      margin-right: 20px;
    }
  }
  .box1 {
    background-color: #F3F8F9;
    border: 1px solid #9eceee;
    padding: 20px 30px 10px 35px;
    height: 142px;
    overflow: hidden;
    .item {
      float: left;
      background-color: #F3F8F9;
      border-radius: 4px;
      margin: 0 15px 15px 0;
      padding: 2px 0px 3px;
      width: 80px;
      border: 1px solid #accdec;
      div {
        color: #5974b2;
        text-align: center;
        font-size: 12px;
      }
    }
  }
  .box{
    @extend .box1;
    padding: 20px 20px 20px 40px;
    height: 190px;
    display: block;
    overflow: hidden;
    .item {
      width: 50px;
      white-space: nowrap;
    }
    .item1 {
      padding: 2px 5px 3px;
      width: auto;
      i{
        margin-left: 5px;
        vertical-align: middle;
        &:hover{
          color: #f72121
        }
      }
    }
  }
  .pointer {
    cursor: pointer;
    overflow-y: auto;
  }
  /*滚动条样式*/
  .pointer::-webkit-scrollbar {
    width: 5px;
  }
  .pointer::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px #9eceee;
    background: #ccc;
  }
  .pointer::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: #eee;
  }
  .li{
    margin: 20px 0;
    .name{
      display: inline-block;
      margin-right: 20px;
    }
    .te{
      color: #2e83d3;
      display: inline-block;
      padding: 0px 20px;
      cursor: pointer;
    }
  }
  .col{
    border: 1px solid #2e83d3 !important;
    color: #2e83d3 !important;
  }
  .fr{
    float: right;
  }
  .tr{
    text-align: right;
  }
  .color{
    color: #2e83d3 !important;
    cursor: pointer;
  }
  .iconfont{
    display: inline-block;
    font-size: 20px;
    cursor: pointer;
    text-align: center;
    vertical-align: text-bottom;
    margin-right: 5px;
    color: #666;
  }
  .iconfont1{
    width: 35px;
    height: 35px;
    line-height: 35px;
    border: 1px solid #ccc;
  }
  .code{
    line-height: 35px;
  }
  .cy{
    margin-top: 16px;
    width: 100%;
    border: 1px solid #ccc;
    height: 400px;
  }
  .active {
    background-color: #2e83d3 !important;
    div {
      color: #ffffff !important;
    }
  }
}
</style>
