<!--  -->
<template>
  <div id="gaugeBox">
    <div>
      <div class="tit">指标仪表盘</div>
      <div class="gaugeWrapper">
        <div class="gaugeChart">
          <div class="gauge" id="sampleUse"></div>
          <p>样本使用率</p>
        </div>
        <div class="gaugeChart">
          <div class="gauge" id="sampleEffective"></div>
          <p>样本有效率</p>
        </div>
        <div class="gaugeChart">
          <div class="gauge" id="success"></div>
          <p>成功率</p>
        </div>
        <div class="gaugeChart">
          <div class="gauge" id="refuse"></div>
          <p>拒访率</p>
        </div>
        <div class="gaugeChart">
          <div class="gauge" id="examine"></div>
          <p>审核率</p>
        </div>
        <div class="gaugeChart">
          <div class="gauge" id="examinePass"></div>
          <p>审核通过率</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectId: null,
      sample_use_echart: null,
      sample_effective_echart: null,
      success_echart: null,
      refuse_echart: null,
      examine_echart: null,
      examine_pass_echart: null,
      sample_status_echart: null
    };
  },
  created() {
    this.projectId = this.$route.query.id;
  },
  mounted: function() {
    this.get_sample_echarts();
  },
  methods: {
    // 仪表盘
    get_sample_echarts() {
      let _this = this;
      this.httpPost(`/monitor/percent/${this.projectId}`).then(res => {
        if (res.code == 0) {
          // 样本使用率
					this.sample_use_echart = this.echarts.init(document.getElementById('sampleUse'))
					this.sample_use_echart.setOption(_this.getOption(res.data.usePercent, '样本使用率'))
					// 样本有效率
					this.sample_effective_echart = this.echarts.init(document.getElementById('sampleEffective'))
					this.sample_effective_echart.setOption(this.getOption(res.data.validPercent, '样本有效率'))
					// 成功率
					this.success_echart = this.echarts.init(document.getElementById('success'))
					this.success_echart.setOption(this.getOption(res.data.successPercent, '成功率'))
					// 拒访率
					this.refuse_echart = this.echarts.init(document.getElementById('refuse'))
					this.refuse_echart.setOption(this.getOption(res.data.failPercent, '拒访率'))
					// 审核率
					this.examine_echart = this.echarts.init(document.getElementById('examine'))
					this.examine_echart.setOption(this.getOption(res.data.auditPercent, '审核率'))
					// 审核通过率
					this.examine_pass_echart = this.echarts.init(document.getElementById('examinePass'))
					this.examine_pass_echart.setOption(this.getOption(res.data.auditSuccessPercent, '审核通过率'))
				}
			})
		},
		getOption (val, name1) {
			let value = (val * 100).toFixed(2)
			let option = {
				tooltip: {
					formatter: '{a} <br/>{b} : {c}%'
				},
				series: [
					{
						name: name1,
						type: 'gauge',
						axisLine: {      //仪表盘轴线相关配置
							lineStyle: {
								color: [[0.2, '#308E31'],[0.8, '#5B94C0'],[1, '#FC481E']],
								width:12,  //轴线宽度
							},
						},
						splitLine: {
              // 分隔线样式。
              show: true, // 是否显示分隔线,默认 true。
              length: 15 // 分隔线线长。支持相对半径的百分比,默认 30。
            },
            detail: {
              formatter: "{value}%",
              fontSize: "14",
              offsetCenter: [0, "65%"]
            },
            data: [{ value: value, name: "" }],
            title: {
              //设置仪表盘中间显示文字样式
              textStyle: {
                fontSize: 10
              }
            },
            axisLabel: {
              // 刻度标签
              show: true,
              color: "#000",
              fontSize: 8, //改变仪表盘内刻度数字的大小
              shadowColor: "#000" //默认透明
            }
          }
        ]
      };
      return option;
    }
  }
};
</script>

<style  lang='scss'  scoped>
#gaugeBox {
  margin: 20px 0 20px 0px;
  .tit {
    margin-bottom: 20px;
    // margin-top: 30px;
  }
  .gaugeWrapper {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    height: 300px;
    box-shadow: border-box;
    text-align: center;
    .gaugeChart {
      position: relative;
    }
    p {
      position: absolute;
      bottom: 80px;
      left: 0;
      right: 0;
      font-size: 12px;
    }
    .gauge {
      width: 175px;
      height: 175px;
      top: 55px;
    }
  }
}
</style>
