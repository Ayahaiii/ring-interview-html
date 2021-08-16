<!-- 数据展示框 -->
<template>
  <div id="dataBox">
		<div class="showBox">
			<p style="margin-top: 20px">数据汇总</p>
			<el-row type="flex" class="row-bg" justify="space-between">
				<el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num" style="color:#ED6C11">{{ projectSum.numOfTeam }}</span><span class="txt">团队</span></div></div></el-col>
				<el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num" style="color:#1486C6">{{ projectSum.numOfSample }}</span><span class="txt">样本</span></div></div></el-col>
				<el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num" style="color:#18BD6B">{{ projectSum.numOfInterview }}</span><span class="txt">访谈</span></div></div></el-col>
				<el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num smallNum" style="color:#EA7272">{{ projectSum.timeStr }}</span><span class="txt">访谈总时长</span></div></div></el-col>
				<el-col :span="4"><div class="grid-content"><div class="showItem"><span class="num smallNum" style="color:#ED6C11">{{ projectSum.fileSizeStr }}</span><span class="txt">信息总量</span></div></div></el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
			projectId: null,
			projectSum: {
        numOfTeam: 0,   // 团队
        numOfSample: 0, // 访谈对象
        numOfInterview: 0, // 访谈
        timeStr: '0S', // 访谈总时长
        fileSizeStr: '0B', // 信息总量
      }
    }
  },
	created () {
		this.projectId = this.$route.query.id
		this.getMonitoring()
	},
	methods: {
		// 数据展示框
		getMonitoring () {
			this.httpPost(`/monitor/getMonitoring/${this.projectId}`).then(res => {
        if (res.code == 0) {
					this.projectSum = res.data
        }
      })
		}
	}
}
</script>

<style lang='scss' scoped>
#dataBox {
	.showBox{
		margin: 0px 0 20px 0px;
		p {
			margin-bottom: 20px;
		}
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
				font-size: 20px;
				padding: 19px 0;
			}
		}
	}
}
</style>
