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
                <el-row>
                  <el-col :span='17'>
                    <div class="status">
                      <el-dropdown size="mini" split-button type="primary">
                      {{ projectStatus }}
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><span @click="changeStatus(1)">启动</span></el-dropdown-item>
                        <el-dropdown-item><span @click="changeStatus(2)">暂停</span></el-dropdown-item>
                        <el-dropdown-item><span @click="changeStatus(3)">结束</span></el-dropdown-item>
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
            <!-- <div class="item"><el-row><el-col :span='6'><div class="tit">项目id:</div></el-col><el-col :span='18'><div class="bTxt">{{ projectBaseMessage.id }}</div></el-col></el-row></div> -->
            <div class="item"><el-row><el-col :span='6'><div class="tit">项目名称:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.name }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">项目描述:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.desc }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">项目标签:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.label }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">项目角色:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.role }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">创建时间:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.createTime }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">启动时间:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.beginTime }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">暂停时间:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.stopTime }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='6'><div class="tit">结束时间:</div></el-col><el-col :span='18'><div class="bTxt"> {{ projectBaseMessage.endTime }}</div></el-col></el-row></div>
          </div>
        </div>
        <!-- 项目配置 -->
        <div class="baseMessage projectSet">
          <div class="bHeader">
            <el-row>
              <el-col :span='8'><div>项目配置</div></el-col>
              <el-col :span='16'>
                <div class="edit" @click="goDispose">
                  <span class="iconfont">&#xe63b;</span>
                  <span>编辑</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="bNav">
            <div class="item"><el-row><el-col :span='20'><div class="tit">客户端现场定位：</div></el-col><el-col :span='4'><div class="bTxt" v-bind:style="{ color: projectDispose.location == 1 ? '#18bd68' : '#444' }">{{ projectDispose.location == 1 ? '开启' : '关闭' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='20'><div class="tit">客户端轨迹监控：</div></el-col><el-col :span='4'><div class="bTxt" v-bind:style="{ color: projectDispose.monitor == 1 ? '#18bd68' : '#444' }"> {{ projectDispose.monitor == 1 ? '开启' : '关闭' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='20'><div class="tit">追踪访谈（一个研究对象多个访谈）：</div></el-col><el-col :span='4'><div class="bTxt" v-bind:style="{ color: projectDispose.interview == 1 ? '#18bd68' : '#444' }"> {{ projectDispose.interview == 1 ? '开启' : '关闭' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='20'><div class="tit">焦点小组（一个访谈多个研究对象）：</div></el-col><el-col :span='4'><div class="bTxt" v-bind:style="{ color: projectDispose.focus == 1 ? '#18bd68' : '#444' }"> {{ projectDispose.focus == 1 ? '开启' : '关闭' }}</div></el-col></el-row></div>
            <div class="item"><el-row><el-col :span='20'><div class="tit">项目生效时间到期后自动暂停：</div></el-col><el-col :span='4'><div class="bTxt" v-bind:style="{ color: projectDispose.endTime == 1 ? '#18bd68' : '#444' }"> {{ projectDispose.endTime == 1 ? '开启' : '关闭' }}</div></el-col></el-row></div>
          </div>
        </div>
      </el-col>
      <el-col :span='16'>
        <!-- 数据展示框 -->
        <div class="showBox">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num" style="color:#ED6C11">{{ team }}</span><span class="txt">团队</span></div></div></el-col>
            <el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num" style="color:#1486C6">{{ interviewTarget }}</span><span class="txt">访谈对象</span></div></div></el-col>
            <el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num" style="color:#18BD6B">{{ interviewNum }}</span><span class="txt">访谈</span></div></div></el-col>
            <el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num smallNum" style="color:#EA7272">{{ interviewTime }}</span><span class="txt">访谈总时长</span></div></div></el-col>
            <el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num smallNum" style="color:#ED6C11">{{ interviewMessageNum }}</span><span class="txt">信息总量</span></div></div></el-col>
          </el-row>
        </div>
        <!-- 进度监控 -->
        <div class="monitorBox">
          <div class="mHeader">
            <el-row>
              <el-col :span='4'><span class="txt">进度监控</span></el-col>
              <el-col :span='20'>
                <div>
                  <el-row>
                    <el-col :span='6'><span class="txt flr">时间范围</span></el-col>
                    <el-col :span='18'>
                      <div class="mTime flr">
                        <el-date-picker size='small' v-model="monitorTimeFrame" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
          <div class="map">
            <!-- <div class="amap-page-container">
              <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
                <el-amap-marker vid="component-marker" :position="componentMarker.position" :content-render="componentMarker.contentRender" ></el-amap-marker>
                <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index"></el-amap-marker>
              </el-amap>
              <div class="toolbar">
                <button type="button" name="button" v-on:click="toggleVisible">toggle first marker</button>
                <button type="button" name="button" v-on:click="changePosition">change position</button>
                <button type="button" name="button" v-on:click="chnageDraggle">change draggle</button>
                <button type="button" name="button" v-on:click="addMarker">add marker</button>
                <button type="button" name="button" v-on:click="removeMarker">remove marker</button>
              </div>
            </div> -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style>
  /* .amap-demo {
    height: 300px;
  } */
</style>
<script>
  // const exampleComponents = {
  //   props: ['text'],
  //   template: `<div>text from  parent: {{text}}</div>`
  // }
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
      projectStatus: '已启动', // 项目状态
      projectBaseMessage: {
        name: '民营企业家应对新肺疫情深度访谈研究',
        desc: '研究民企企业家对新肺疫情的认知，受损失情况，对政府政策扶持的期望',
        label: '企业研究, 政策研究',
        role: '负责人',
        createTime: '2020-01-25  09:10:05',
        beginTime: '2020-01-26  15:23:25',
        stopTime: '没有就整体不显示',
        endTime: '没有就整体不显示',
      },  // 基本信息
      projectDispose: {
        location: 1,
        monitor: 0,
        interview: 0,
        focus: 0,
        endTime: 1,
      }, // 项目配置
      team: 5,   // 团队
      interviewTarget: 26, // 访谈对象
      interviewNum: 15, // 访谈
      interviewTime: '12h25m', // 访谈总时长
      interviewMessageNum: '15.5M', // 信息总量
      monitorTimeFrame: '', // 进度监控时间范围
      monitor_chart:null,
      monitor_option : {
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
          data: ["11-26","11-27","11-28","11-29","11-30","12-01","12-02"]
        },
        yAxis: {
          name:"次数",
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
            data:[9,10,6,7,12,11,8],
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
      },
      count: 1,
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa'
      },
      // zoom: 14,
        // center: [121.5273285, 31.21515044],
        // markers: [
        //   {
        //     position: [121.5273285, 31.21515044],
        //     events: {
        //       click: () => {
        //         alert('click marker');
        //       },
        //       dragend: (e) => {
        //         console.log('---event---: dragend')
        //         this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
        //       }
        //     },
        //     visible: true,
        //     draggable: false,
        //     template: '<span>1</span>',
        //   }
        // ],
        // renderMarker: {
        //   position: [121.5273285, 31.21715058],
        //   contentRender: (h, instance) => {
        //     // if use jsx you can write in this
        //     // return <div style={{background: '#80cbc4', whiteSpace: 'nowrap', border: 'solid #ddd 1px', color: '#f00'}} onClick={() => ...}>marker inner text</div>
        //     return h(
        //       'div',
        //       {
        //         style: {background: '#80cbc4', whiteSpace: 'nowrap', border: 'solid #ddd 1px', color: '#f00'},
        //         on: {
        //           click: () => {
        //             const position = this.renderMarker.position;
        //             this.renderMarker.position = [position[0] + 0.002, position[1] - 0.002];
        //           }
        //         }
        //       },
        //       ['marker inner text']
        //     )
        //   }
        // },
        // componentMarker: {
        //   position: [121.5273285, 31.21315058],
        //   contentRender: (h, instance) => h(exampleComponents,{style: {backgroundColor: '#fff'}, props: {text: 'father is here'}}, ['xxxxxxx'])
        // },
        // slotMarker: {
        //   position: [121.5073285, 31.21715058]
        // }
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      title: '项目详情',
      link: null,
      backTitle: ''
    })
  },
  beforeDestroy() {
    if (!this.monitor_chart) { return }
    this.monitor_chart.dispose();
    this.monitor_chart = null;
  },
  mounted:function (){
    this.get_echarts();
  },
  methods: {
    // 改变项目状态
    changeStatus (status) {
      if (status == 1) {
        this.projectStatus = '已启动'
      } else if (status == 2) {
        this.projectStatus = '已暂停'
      } else if (status == 3) {
        this.projectStatus = '已结束'
      }
    },
    get_echarts:function(){
      this.monitor_chart = this.echarts.init(document.getElementById("monitor"));
      // 把配置和数据放这里
      this.monitor_chart.setOption(this.monitor_option)
    },
    // 前往基本信息编辑页面
    goBaseMessage () {
      this.$router.push('/project/base/message')
    },
    // 前往项目配置编辑页面
    goDispose () {
      this.$router.push('/project/dispose')
    },
    // onClick() {
      //     this.count += 1;
      //   },
      //   changePosition() {
      //     let position = this.markers[0].position;
      //     this.markers[0].position = [position[0] + 0.002, position[1] - 0.002];
      //   },
      //   chnageDraggle() {
      //     let draggable = this.markers[0].draggable;
      //     this.markers[0].draggable = !draggable;
      //   },
      //   toggleVisible() {
      //     let visableVar = this.markers[0].visible;
      //     this.markers[0].visible = !visableVar;
      //   },
      //   addMarker() {
      //     let marker = {
      //       position: [121.5273285 + (Math.random() - 0.5) * 0.02, 31.21515044 + (Math.random() - 0.5) * 0.02]
      //     };
      //     this.markers.push(marker);
      //   },
      //   removeMarker() {
      //     if (!this.markers.length) return;
      //     this.markers.splice(this.markers.length - 1, 1);
      //   }
  }
}
</script>

<style scoped>
  .baseMessage>>>.el-button-group .el-button--primary:last-child {
    border-left-color: rgba(255,255,255,0.5);
    border-color: #ccc;
    background-color: #999;
    border: 1px solid #999;
    padding: 6px 5px 4px;
  }
  .baseMessage>>>.el-button-group .el-button--primary:first-child {
    border-right-color: rgba(255,255,255,0.5);
    background-color: #8bc34a;
    border-color: #8bc34a;
    padding: 6.5px 10px 5px;
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
  #proDetail{
    .baseMessage{
      border: 1px solid #ccc;
      width: 100%;
      margin: 0px 20px 20px 0;
      .bHeader{
        padding: 0 20px;
        margin-right: -.1px;
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
          margin-bottom: 15px;
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
        }
        .num{
          font-size: 35px;
          padding: 10px 0;
        }
        .smallNum{
          font-size: 20px;
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
        margin-bottom: 20px;
      }
      .map{
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        height: 300px;
        width: 100%;
      }
    }

  }

</style>
