<template>
  <div id="aysChart">
    <el-row :gutter="20">
      <el-col :span='12'>
        <div class="li"><span class="name">样本</span><el-button @click="opeanSamDia" size='mini' type='primary' plain class="mini">选择</el-button></div>
        <div class="box">
          <ul>
          <li class="item" v-for="(item, index) in sampleList" :key="'sam'+index"><span class="sam-name">{{ item.name }}</span><span class="sam-code">{{ item.code }}</span></li>
          </ul>
        </div>
      </el-col>
      <el-col :span='12'>
        <div class="li"><span class="name">编码</span><el-button @click="opeanCodeDia" size='mini' type='primary' plain class="mini">选择</el-button>
          <!-- <span class="te fs12">编码词频前20</span><span class="te fs12">编码样本数前20</span> -->
        </div>
        <div class="box box1">
          <ul>
            <li class="item2" v-for="(item, index) in codeList" :key="'cod'+index"><span class="sam-name">{{ item.name }}</span></li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <div>
          <el-row style="margin: 20px 0;">
            <el-col :span='2'><span class="code">词云图</span></el-col>
            <el-col :span='3'><span v-bind:class="{col: type=='tab'}" class="iconfont iconfont1" @click="changeType('tab')">&#xe667;</span><span @click="changeType('img')" v-bind:class="{col: type=='img'}" class="iconfont iconfont1">&#xe652;</span></el-col>
            <!-- <el-col :span='3' class="fr tr color fs12"><span class="iconfont color">&#xe629;</span>导出结果</el-col> -->
            <!-- <el-col :span='3' class="fr tr color fs12"><span class="iconfont color">&#xe6fe;</span>另存为图片</el-col> -->
          </el-row>

          <el-row>
            <el-col :span='24'>
              <div class="chart" v-show="type=='img'">
                <svg width="1080" height="600"></svg>
              </div>
              <div class="table" v-show="type=='tab'">
                <el-table ref="workerList"
                  :data="workerList"
                  size='small'
                  class="workerForm"
                  style="width: 100%">
                  <el-table-column prop="sampleName" label="样本" min-width="180" align='center'></el-table-column>
                  <el-table-column v-for="(item, index) in tbHeadList" :key="'list'+index" :label='item.name' align='center'>
                    <template slot-scope="scope">
                      <span>{{scope.row[item.id] ? scope.row[item.id] : '--'}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 样本选择 -->
    <dialogCom
      :title="title1"
      :sampleDialog="sampleDialog"
      :listAll="sampleListAll"
      :listChoose="sampleListChoose"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :total="total"
      @arrowRight="arrowRight"
      @arrowLeft="arrowLeft"
      @toHasWords="toHasWords"
      @toWaitWords="toWaitWords"
      @saveSample="saveSample"
      @cancelDia="cancelDia"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></dialogCom>
    <!-- 编码选择 -->
    <dialogCom
      :title="title2"
      :sampleDialog="codeDialog"
      :listAll="codeListAll"
      :listChoose="codeListChoose"
      :currentPage="currentPageCode"
      :pageSize="pageSizeCode"
      :total="totalCode"
      :ifCode="true"
      @arrowRight="arrowCodeRight"
      @arrowLeft="arrowCodeLeft"
      @toHasWords="toHasWordsCode"
      @toWaitWords="toWaitWordsCode"
      @saveSample="saveCode"
      @cancelDia="cancelDiaCode"
      @handleSizeChange="handleSizeChangeCode"
      @handleCurrentChange="handleCurrentChangeCode"
    ></dialogCom>
  </div>
</template>
<script>
  import * as d3 from 'd3'
  import screenfull from 'screenfull'
  import dialogCom from './dialogCom'
  let simulation = ''
  export default {
    components: {
      dialogCom
    },
    props: ['userId'],
    data () {
      return {
        type: 'img',
        projectId: null,
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
          {id: 12, value:"h",label:"前缀",isActive:false},
          {id: 13, value:"k",label:"后缀",isActive:false},
          {id: 14, value:"w",label:"标点",isActive:false},
          {id: 15, value:"nr",label:"人名",isActive:false},
          {id: 16, value:"ns",label:"地名",isActive:false},
          {id: 17, value:"nt",label:"机构名",isActive:false},
          {id: 18, value:"udl",label:"自定义",isActive:false},
          {id: 19, value:"a",label:"形容词",isActive:false},
          {id: 20, value:"b",label:"区间词",isActive:false},
          {id: 21, value:"z",label:"状态词",isActive:false},
          {id: 22, value:"t",label:"时间词",isActive:false},
          {id: 23, value:"s",label:"处所词",isActive:false},
          {id: 24, value:"f",label:"方位词",isActive:false},
          {id: 25, value:"y",label:"语气词",isActive:false},
          {id: 26, value:"o",label:"拟声词",isActive:false},
          {id: 27, value:"x",label:"字符串",isActive:false}
        ],
        breadcrumbList: [
          {
            name: '质性分析',
            path: '/analysis/index'
          },
          {
            name: '编码图谱',
          }
        ],
        title1: '选择样本',
        title2: '选择编码',
        sampleList: [],
        sampleListAll: [],
        all: null,
        sampleListChoose: [],
        currentPage: 1,
        pageSize: 20,
        total: 30,
        codeList: [],
        codeDialog: false,
        codeListAll: [],
        codeAll: null,
        codeListChoose: [],
        currentPageCode: 1,
        pageSizeCode: 24,
        totalCode: 24,
        tbHeadList: [
        ],
        workerList: [
        ],
        sampleDialog: false,
        nodesData: [],
        linksData: []
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
      this.drawChart()
    },

    methods: {
      // 图谱
      drawChart () {
        let svg = d3.select('svg')
        svg.html("")
        let width = +svg.attr('width')
        let height = +svg.attr('height')

        let nodesData = this.nodesData

        let linksData = this.linksData

        simulation = d3.forceSimulation()
          .nodes(nodesData)

        simulation
          .force('charge_force', d3.forceManyBody().strength(-1500).distanceMax(300))
          .force('center_force', d3.forceCenter(width / 2, height / 2))

        let node = svg
          .attr('class', 'nodes')
          .selectAll('circleText')
          .data(nodesData)
          .enter()
          .append('g')
          .call(d3.drag().on('start', this.dragStart).on('drag', this.drag).on('end', this.dragEnd))

          node.append('circle')
          .attr('r', 5)
          .attr('fill', this.circleColor)

        //文字
        node
          .append('text')
          .attr('x', -10)
          .attr('y', -20)
          .attr('dy', 10)
          .text(function(d) {
              return d.name
          })
          .style("font-size", function(d) {
            let val = d.value
            if (d.value == 0) {
              val = 1
            }
            return val > 1 ? val*6 : val*10
          })//设置文字大小

        simulation.on('tick', tickAction)

        function tickAction () {
          node
            .attr('cx', (d) => { return d.x })
            .attr('cy', (d) => { return d.y })
            .attr('transform', d => {
              return 'translate(' + d.x + ',' + d.y + ')'
            })

          link
            .attr('x1', (d) => { return d.source.x })
            .attr('y1', (d) => { return d.source.y })
            .attr('x2', (d) => { return d.target.x })
            .attr('y2', (d) => { return d.target.y })
        }

        let linkForce = d3.forceLink(linksData)
          .id((d) => { return d.name })

        simulation.force('links', linkForce)

        let link = svg.append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(linksData)
          .enter()
          .append('line')
          .attr('stroke-width', 1)
          // .style('stroke', this.linkColor)
      },
      //样本弹框
      opeanSamDia () {
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
      //编码弹框
      opeanCodeDia () {
        this.codeAll = null
        this.httpPost('/analyze/code/list/page', {
          "pageNum": this.currentPageCode,
          "pageSize": this.pageSizeCode,
          "projectId": this.projectId,
          "userId": null
        }).then(res => {
          if (res.code == 0) {
            for (let i of res.data.data) {
              i.isActive = false
            }
          }
          this.codeListAll = res.data.data
          this.codeAll = res.data.data
          this.filterAct(this.codeListAll, this.codeListChoose)
          this.pageSizeCode = res.data.pageSize
          this.currentPageCode = res.data.pageNum
          this.totalCode = res.data.total
          this.codeDialog = true
        })
      },
      //获取图谱数据
      codeView () {
        this.workerList = []
        this.tbHeadList = []
        this.nodesData = []
        this.linksData = []
        let codeIds = []
        let sampleIds = []
        this.sampleListChoose.forEach(item => {
          sampleIds.push(item.id)
        })
        this.codeListChoose.forEach(item => {
          codeIds.push(item.id)
        })
        this.httpPost('/analyze/code/view', {
          "codeIds": codeIds.length == 0 ? null : codeIds,
          "sampleIds": sampleIds,
          "projectId": this.projectId,
        }).then(res => {
          if (res.code == 0) {
            this.nodesData = res.data.nodes
            this.linksData = res.data.edges
            var sampleArr = []
            var headerArr = []
            this.linksData.forEach(item => {
              if (sampleArr.indexOf(item.source) == -1) {
                sampleArr.push(item.source)
              }
              if (headerArr.indexOf(item.target) == -1) {
                headerArr.push(item.target)
                let obj = {}
                obj.id = item.codeId + ''
                obj.name = item.target
                this.tbHeadList.push(obj)
              }
            })
            sampleArr.forEach(sam => {
              var sampleObj = {}
              sampleObj.sampleName = sam
              this.linksData.forEach(item => {
                if (sam == item.source) {
                  sampleObj[item.codeId] = item.value
                }
              })
              this.workerList.push(sampleObj)
            })
            this.drawChart()
          }
        })
      },
      circleColor (d) {
        if (d.type == 1) {
          return 'red'
        } else {
          return 'green'
        }
      },
      dragStart(d) {
        if (!d3.event.active) {
            //设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
            simulation.alphaTarget(0.8).restart()
        }
        d.fx = d.x
        d.fy = d.y
      },
      dragEnd(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      },
      drag(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0)
        }
        d.fx = null
        d.fy = null
      },
      // 切换显示图表
      changeType (val) {
        this.type = val
      },
      //关闭dialog
      cancelDia (boolean) {
        this.sampleDialog = boolean
      },
      //选择样本弹框保存事件
      saveSample () {
        if (this.sampleListChoose.length != 0) {
          this.codeView()
          this.sampleList = this.sampleListChoose
          this.sampleDialog = false
        } else {
          this.$message.info('请先选择样本')
        }
      },
      // 改变当前页码
      handleSizeChange(val) {
        this.pageSize = val
      },
      // 改变当前每页条数 样本编码
      handleCurrentChange(val) {
        this.currentPage = val
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
      //样本选择词语
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
      //编码选择词语
      toHasWordsCode (word) {
        for(let i = 0;i < this.codeListChoose.length; i++){
          if(word.id == this.codeListChoose[i].id){
            this.$message.info("该词语已存在，请重新添加！");
            return;
          }
        }
        word.isActive=true;
        this.codeListChoose.push(word)
        this.filterAct(this.codeListAll, this.codeListChoose)
      },
      //样本取消选择词语
      toWaitWords:function(word,id){
        word.isActive=false
        this.sampleListChoose=this.sampleListChoose.filter(item=>item.id!=word.id)
        this.filterNAct(this.sampleListAll, word.id)
      },
      //编码取消选择词语
      toWaitWordsCode:function(word,id){
        word.isActive=false
        this.codeListChoose=this.codeListChoose.filter(item=>item.id!=word.id)
        this.filterNAct(this.codeListAll, word.id)
      },
      //编码保存按钮
      saveCode () {
        if (this.sampleListChoose.length != 0) {
          let codeIds = []
          for (let i = 0; i < this.codeListChoose.length; i++) {
            codeIds.push(this.codeListChoose[i].id)
          }
          this.codeList = this.codeListChoose
          this.codeView()
          this.codeDialog = false
        } else {
          this.$message.info('请先选择样本')
        }
      },
      cancelDiaCode () {
        this.codeDialog = false
      },
      handleSizeChangeCode (val) {
        this.pageSizeCode = val
      },
      handleCurrentChangeCode (val) {
        this.currentPageCode = val
      },
      arrowCodeRight () {
        this.codeListChoose = this.codeAll
        this.codeListAll = []
      },
      arrowCodeLeft () {
        this.codeListChoose = []
        this.codeListAll = this.codeAll
      },
      // 全选左
      arrowRight () {
        this.sampleListChoose = this.all
        this.sampleListAll = []
      },
      // 全选右
      arrowLeft () {
        this.sampleListChoose = []
        this.sampleListAll = this.all
      },

    }
  }
</script>

<style>
  .links line {
    stroke: #999;
    stroke-opacity: 0.6;
  }
  .nodes circle {
    stroke: #fff;
    stroke-width: 1.5px;
  }
</style>

<style scoped>
  svg {
    border: 1px solid #ccc;
  }
  #aysChart>>>.el-transfer-panel__item.el-checkbox .el-checkbox__label span{
    font-size: 12px !important;
  }
  .exportBox>>>.el-button {
    padding: 8px 8px;
    margin: 0;
    width: 60%;
  }
  #aysChart>>>.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 13px;
    color: #303133;
    font-weight: normal;
  }
  #aysChart>>>.el-transfer-panel__item {
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
    float: left;
    display: block;
  }
  #aysChart>>>.el-transfer-panel {
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    display: inline-block;
    vertical-align: middle;
    width: 45%;
    max-height: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
  }
  #aysChart>>>.el-transfer__buttons {
    display: inline-block;
    vertical-align: middle;
    padding: 0 0px;
    text-align: center;
  }
  #aysChart>>>.el-button--primary.is-disabled, .el-button--primary.is-disabled:hover, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:active {
    color: #fff;
    width: 60%;
    background-color: #acb9da;
    border-color: #acb9da;
    padding: 5px;
    margin: 3px;
  }
</style>
<style lang="scss" scoped>
  .fr{
    float: right;
  }
  .table{

  }
  .tr{
    text-align: right;
  }
  .color{
    color: #2e83d3 !important;
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
  .box1 {
    overflow: auto;
    padding: 20px 8px 10px 35px !important;
  }
  .box{
    background-color: #F3F8F9;
    border: 1px solid #9eceee;
    padding: 20px 8px 10px 20px;
    height: 245px;
    ul{
      overflow: hidden;
      li{
        float: left;
        background-color: #F3F8F9;
        border-radius: 4px;
        margin: 0 14px 15px 0;
        border: 1px solid #accdec;
        span{
          display: inline-block;
          width: 100%;
          text-align: center;
          font-size: 12px;
          color: #5974b2;
        }
      }
      .item {
        width: 85px;
      }
      .item2{
        padding: 3px;
        width: 80px;
      }
    }
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
  .col{
    border: 1px solid #2e83d3;
    color: #2e83d3;
  }
  .code{
    line-height: 35px;
  }
  // .chart{
  //   width: 100%;
  //   height: 500px;
  //   border: 1px solid #c1c1c1;
  // }
</style>
