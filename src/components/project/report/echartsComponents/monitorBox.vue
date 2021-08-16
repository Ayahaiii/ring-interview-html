<!--  -->
<template>
  <div id="monitorBox">
		<div>
			<div class="mHeader">
				<el-row type="flex">
					<el-col :span='10'><span class="txt">进度监控</span></el-col>
					<el-col :span='14'>
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
					</el-col>
				</el-row>
			</div>
			<div class="mNav">
				<div class="monitor_echarts"  id="monitor"></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
			projectId: null,
			monitorTimeFrame: '', // 进度监控时间范围
      monitor_chart:null,
    }
  },
	created () {
		this.projectId = this.$route.query.id
	},
	mounted:function (){
		this.get_echarts()
	},
	methods: {
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
			this.httpPost('/monitor/getProgress/monitoring', params).then(res => {
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
	}
}
</script>

<style  lang='scss'  scoped>
#monitorBox{
	margin: 20px 0 20px 0px;
	.flr{
		float: right;
	}
	.txt{
		line-height: 32px;
	}
	.monitor_echarts{
		.tit{
		margin-bottom: 20px;
			// margin-top: 30px;
		}
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		height: 300px;
		width: 100%;
		padding: 0 10px 10px;
		box-sizing: border-box;
		margin: 20px 0;
	}
}
</style>
