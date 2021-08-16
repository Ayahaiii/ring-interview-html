<template>
  <div id="proDetail">
    <el-row>
      <el-col :span='8'>
        <!-- 基本信息 -->
        <div class="baseMessage">
          <div class="bHeader">
            <el-row>
              <el-col :span='8'><div>基本信息</div></el-col>
              <el-col :span='16'>
                <el-row v-permission="{projectId: $route.query.id, permissionId: Constant.RP_PROJECT_EDIT}">
                  <el-col :span='17'>
                    <div class="status">
                      <el-dropdown size="mini" split-button placement="bottom-end" type="primary">
                      {{ projectStatus }}
                      <el-dropdown-menu slot="dropdown" v-if="projectBaseMessage.status != 3 && !isSample">
                        <span v-if="projectBaseMessage.status == 0 || projectBaseMessage.status == 2"><el-dropdown-item><span @click="changeStatus(1)">启动</span></el-dropdown-item></span>
                        <span v-if="projectBaseMessage.status == 1"><el-dropdown-item><span @click="changeStatus(2)">暂停</span></el-dropdown-item></span>
                        <span v-if="projectBaseMessage.status == 1"><el-dropdown-item><span @click="changeStatus(3)">结束</span></el-dropdown-item></span>
                      </el-dropdown-menu>
                    </el-dropdown>
                    </div>
                  </el-col>
                  <el-col :span='7'>
                    <div class="edit" @click="goBaseMessage">
                      <span class="iconfont">&#xe63b;</span>
                      <span>编辑</span>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="bNav">
            <div class="item"><el-row><el-col :span='6'><div class="tit">项目名称:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.name }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">项目描述:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.description ? projectBaseMessage.description : '--' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">项目标签:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.labelText ? projectBaseMessage.labelText : '--' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">项目角色:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.role }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">创建时间:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.createTime }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">启动时间:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.beginDate ? projectBaseMessage.beginDate : '--' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">暂停时间:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.pauseTime ? projectBaseMessage.pauseTime : '--' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">结束时间:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.endDate ? projectBaseMessage.endDate : '--' }}</div></el-col></el-row></div>
          </div>
        </div>
        <!-- 项目配置 -->
        <div class="baseMessage projectSet">
          <div class="bHeader">
            <el-row>
              <el-col :span='8'><div>项目配置</div></el-col>
              <el-col :span='16' v-permission="{projectId: $route.query.id, permissionId: Constant.RP_PROJECT_CONFIG_ADMIN}">
                <div class="edit" @click="goDispose">
                  <span class="iconfont">&#xe63b;</span>
                  <span>编辑</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="bNav">
            <div class="item"><el-row><el-col :span='20'><div class="tit">客户端现场定位：</div></el-col><el-col :span='4'><div class="bTxt" v-bind:style="{ color: projectDispose.clientPosition == 1 ? '#18bd68' : '#444' }">{{ projectDispose.clientPosition == 1 ? '开启' : '关闭' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='20'><div class="tit">客户端轨迹监控：</div></el-col><el-col :span='4'><div class="bTxt" v-bind:style="{ color: projectDispose.clientTrack == 1 ? '#18bd68' : '#444' }"> {{ projectDispose.clientTrack == 1 ? '开启' : '关闭' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='20'><div class="tit">追踪访谈：</div></el-col><el-col :span='4'><div class="bTxt" v-bind:style="{ color: projectDispose.trackInterview == 1 ? '#18bd68' : '#444' }"> {{ projectDispose.trackInterview == 1 ? '开启' : '关闭' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='20'><div class="tit">允许访问员新增样本：</div></el-col><el-col :span='4'><div class="bTxt" v-bind:style="{ color: projectDispose.allowAddSample == 1 ? '#18bd68' : '#444' }"> {{ projectDispose.allowAddSample == 1 ? '开启' : '关闭' }}</div></el-col></el-row></div>
          </div>
        </div>
      </el-col>
      <el-col :span='16'>
        <!-- 数据展示框 -->
        <div class="showBox">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num" style="color:#ED6C11">{{ projectSum.numOfTeam }}</span><span class="txt">团队</span></div></div></el-col>
            <el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num" style="color:#1486C6">{{ projectSum.numOfSample }}</span><span class="txt">样本</span></div></div></el-col>
            <el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num" style="color:#18BD6B">{{ projectSum.numOfInterview }}</span><span class="txt">访谈</span></div></div></el-col>
            <el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num smallNum" style="color:#EA7272">{{ projectSum.interviewTimeLen }}</span><span class="txt">访谈总时长</span></div></div></el-col>
            <el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num smallNum" style="color:#ED6C11">{{ projectSum.fileSizeStr }}</span><span class="txt">信息总量</span></div></div></el-col>
          </el-row>
        </div>
        <!-- 进度监控 -->
        <div class="monitorBox">
          <div class="mHeader">
            <el-row>
              <el-col :span='4'><span class="txt">访谈统计</span></el-col>
              <el-col :span='20'>
                <div>
                  <el-row>
                    <el-col :span='6'><span class="txt flr">时间范围</span></el-col>
                    <el-col :span='18'>
                      <div class="mTime flr">
                        <el-date-picker
                          size='small'
                          v-model="monitorTimeFrame"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          @change="get_echarts"
                        >
                        </el-date-picker>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="mNav">
            <div class="monitor_echarts"  id="monitor"></div>
          </div>
        </div>
        <!-- 访谈地图 -->
        <div class="mapBox">
          <div class="tit">访谈地图</div>
          <div class="map" id="map">

          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  props: ['showAside'],
  data () {
    return {
      projectId: null,
      isSample: false,
      breadcrumbList: [
        {
          name: '项目详情',
        }
      ],
      projectStatus: '准备中', // 项目状态
      projectBaseMessage: {},  // 基本信息
      projectDispose: {}, // 项目配置
      addressList: [],
      projectSum: {
        numOfTeam: null,   // 团队
        numOfSample: null, // 访谈对象
        numOfInterview: null, // 访谈
        timeStr: null, // 访谈总时长
        fileSizeStr: null, // 信息总量
      } ,
      monitorTimeFrame: '', // 进度监控时间范围
      monitor_chart:null,
      count: 1,
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa'
      },

    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      title: '项目详情',
      link: null,
      backTitle: ''
    })
    this.projectId = this.$route.query.id
    this.httpPost('/project/get/visit/' + this.projectId).then(res => {
      console.log(res.data)
      if (res.data == 1) {
        this.isSample = true
      }
    })
    this.getBaseMessage()
    this.getDisposeMessage()
    this.getProjectSum()
  },
  watch: {
    showAside: function (val) {
      if (!this.monitor_chart) { return }
      this.monitor_chart.dispose();
      this.monitor_chart = null;
      this.get_echarts();
    }
  },
  beforeDestroy() {
    if (!this.monitor_chart) { return }
    this.monitor_chart.dispose();
    this.monitor_chart = null;
  },
  mounted:function (){
    this.get_echarts();
    this.get_map();
  },
  methods: {
    // 改变项目状态
    changeStatus (status) {
      let param = {
        id: this.projectId,
        oldStatus: this.projectBaseMessage.status,
        status: status
      }
      this.httpPost('/project/update/status', param).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.reload()
          this.getBaseMessage();
        }
      })
    },
    // 获取项目基本信息
    getBaseMessage () {
      this.httpPost('/project/get/'+ this.projectId).then(res => {
        if (res.code == 0) {
          this.projectBaseMessage = res.data
          if (this.projectBaseMessage.status == 1) {
            this.projectStatus = '已启动'
          } else if (this.projectBaseMessage.status == 2) {
            this.projectStatus = '已暂停'
          } else if (this.projectBaseMessage.status == 3) {
            this.projectStatus = '已结束'
          }
        }
      })
    },
    // 获取项目配置信息
    getDisposeMessage () {
      this.httpPost('/project/get/config/'+ this.projectId).then(res => {
        if (res.code == 0) {
          this.projectDispose = res.data
        }
      })
    },
    // 获取项目汇总数据
    getProjectSum () {
      this.httpPost('/project/get/monitor/'+ this.projectId).then(res => {
        if (res.code == 0) {
          this.projectSum = res.data
          this.projectSum.interviewTimeLen = this.loadDuration(res.data.interviewTimeLen)
        }
      })
    },
    // 时间换算(秒转天时分秒)
    loadDuration (duration) {
      var day = Math.floor( duration / (24*3600) ); // Math.floor()向下取整
      var hour = Math.floor( (duration - day*24*3600) / 3600);
      var minute = Math.floor( (duration - day*24*3600 - hour*3600) /60 );
      var second = duration - day*24*3600 - hour*3600 - minute*60;
      var time = [];
      time.push(day);
      time.push(hour);
      time.push(minute);
      time.push(second);
      var result = ""
      for (let i = 0;i < time.length;i++) {
        if (time[i] != 0) {
          if (day > 0) {
            if (i == 0) {
              result = result.concat(day + "d");
            } else if (i == 1) {
              result = result.concat(hour + "h");
            } else if (i == 2) {
              result = result.concat(minute + "m");
            }
          } else {
            if (i == 1) {
              result = result.concat(hour + "h");
            } else if (i == 2) {
              result = result.concat(minute + "m");
            } else if (i == 3) {
              result = 0 + "s";
            }
          }
        }
      }
      if (duration < 60) {
        result = 0 + 'h'
      }
      return result;
    },

    get_echarts:function(){
      let params = {
        projectId: this.projectId,
        startTime: null,
        endTime: null
      }
      if (this.monitorTimeFrame != null && this.monitorTimeFrame.length == 2) {
        params.startTime = this.monitorTimeFrame[0]
        params.endTime = this.monitorTimeFrame[1]
      }
      this.httpPost('/project/get/monitor/itw', params).then(res => {
        if (res.code == 0) {
          this.monitor_chart = this.echarts.init(document.getElementById("monitor"));
          // 把配置和数据放这里
          this.monitor_chart.setOption({
            title : {
              x: 'left',
              align: 'left'
            },
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: '0%',
              right: '4%',
              bottom: '0%',
              containLabel: true
            },
            toolbox: {
              feature: {
                magicType: {type: ['line', 'bar']},//柱状图和西和折线图切换
              },
              top: '5%'
            },
            xAxis: {
              type: 'category',
              interval:0,//使x轴横坐标全部显示
              boundaryGap: false,
              data: res.data.xData
            },
            yAxis: {
              min: 0,
              interval: 1, //间隔
              minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数
              name:"个数",
              nameLocation: 'end',
              type: 'value',
              axisLabel: {
                formatter: '{value} '
              }
            },
            series: [
              {
                name:'访谈数量',
                type:'line',
                data: res.data.yData,
                lineStyle:{//设置折线色颜色
                  color:'#ed6c11'
                },
                itemStyle:{//设置折线折点的颜色
                  normal : {
                    color:'#ed6c11'
                  }
                }
              }
            ],
          })
        }
      })
    },

    // 百度地图
    get_map() {
      var map = new BMap.Map("map");    // 创建Map实例
      map.centerAndZoom(new BMap.Point(121.515843, 31.302699), 12);  // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      map.addControl(new BMap.MapTypeControl({
        mapTypes:[
          BMAP_NORMAL_MAP,
          BMAP_HYBRID_MAP
				]})
			)
      map.setCurrentCity("上海");          // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
      // 获取访谈地点坐标
      this.httpPost('/project/get/locations/' + this.projectId).then(res => {
        if (res.code == 0) {
          this.addressList = res.data
          this.addressList.forEach(item => {
            var locations = JSON.parse(item.locations)
            let that = this
            var point = new BMap.Point(+locations.longitude, +locations.latitude);
            map.centerAndZoom(point, 10);
            var marker = new BMap.Marker(point);        // 创建标注
            marker.setTitle('访谈名称：' + item.name);  // 添加标注名称
            marker.addEventListener("click", function () {
              that.$router.push({path: '/talk/info', query: {id: that.projectId, inId: item.id}})
             });
            map.addOverlay(marker); // 将标注添加到地图中
            // 设置标注动画效果。如果参数为null，则取消动画效果。该方法需要在addOverlay方法后设置
            // marker.setAnimation(Animation);
          })
        }
      })
    },

    // 前往基本信息编辑页面
    goBaseMessage () {
      this.$router.push(`/project/edit?id=${this.projectId}`)
    },
    // 前往项目配置编辑页面
    goDispose () {
      this.$router.push(`/project/config?id=${this.projectId}`)
    },
    // 格式化毫秒
    formatDuring(mss) {
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = (mss % (1000 * 60)) / 1000;
      return hours + "h" + minutes + "m" + seconds + "s";
    },
  }
}
</script>

<style scoped>
  .baseMessage>>>.el-button-group .el-button--primary:last-child {
    border-left-color: rgba(255,255,255,0.5);
    border-color: #ccc;
    background-color: #999;
    border: 0px solid #999;
    height: 24px !important;
    display: inline-block;
    box-sizing: border-box;
    position: absolute;
    right: 5px;
    line-height: 12px;
    top: -17px;
  }
  .el-dropdown-menu--mini .el-dropdown-menu__item {
    line-height: 24px;
    padding: 0 24px;
    font-size: 12px;
  }
  .baseMessage>>>.el-button-group .el-button--primary:first-child {
    border-right-color: rgba(255,255,255,0.5);
    background-color: #8bc34a;
    border-color: #8bc34a;
    display: inline-block;
    height: 24px;
    box-sizing: border-box;
    padding: 5px !important;
    position: absolute;
    left: -80px;
    top: -17px;
  }
  .baseMessage>>>.el-button-group .el-button--primary:first-child span{
    font-size: 12px !important;
  }
  .baseMessage>>>.el-dropdown .el-dropdown__caret-button::before {
    content: '';
    position: absolute;
    display: block;
    width: 0px;
    top: 5px;
    bottom: 5px;
    left: 0;
    background: rgba(255,255,255,0.5);
}
</style>
<style lang="scss" scoped>

// 项目详情主体内容
  #proDetail{
    .baseMessage{
      border: 1px solid #ccc;
      width: 100%;
      margin: 0px 20px 20px 0;
      min-height: 473px;
      .bHeader{
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        background-color: #eee;
        border-bottom: 1px solid #ccc;
        .status{
          float: right;
          line-height: 39px;
        }
        .edit{
          float: right;
          line-height: 39px;
          cursor: pointer;
          span{
            font-size: 13px !important;

          }
        }
      }
      .bNav{
        padding: 20px 20px 0;
        .item{
          margin-bottom: 20px;
          .tit{
            font-size: 12px !important;
            color: #444;
          }
          .bTxt{
            font-size: 12px !important;
            color: #444;
          }
        }
      }
    }
    .projectSet{
      min-height: 340px !important;
    }
    .showBox{
      margin: 0px 0 20px 20px;
      .showItem{
        width: 100%;
        height: 100px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        span{
          display: inline-block;
          width: 100%;
          text-align: center;
          color: #444;
        }
        .num{
          font-size: 35px;
          padding: 10px 0;
        }
        .smallNum{
          font-size: 18px;
          padding: 19px 0;
        }
      }
    }
    .monitorBox{
      margin: 20px 0 20px 20px;
      .flr{
        float: right;
      }
      .txt{
        line-height: 32px;
      }
      .monitor_echarts{
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        height: 300px;
        width: 100%;
        padding: 0 10px 10px;
        box-sizing: border-box;
        margin: 20px 0;
      }
    }
    .mapBox{
      margin: 20px 0 20px 20px;
      .tit{
        margin-bottom: 10px;
        margin-top: 30px;
      }
      .map{
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        height: 300px;
        width: 100%;
      }
    }

  }
</style>
