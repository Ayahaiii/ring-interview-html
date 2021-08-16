<!--  -->
<template>
  <div id = "monitorIndex" ref="monitorIndex">
		<div class='echarts-nav-wrapper'>
			<span @click="showDialog">自定义报表首页</span>
			<!-- <el-select v-model="echartsAnchor" class="select-wid" placeholder="报表导航" size="mini" clearable @change="goAnchor">
				<el-option label="数据汇总" value="#dataBox"></el-option>
				<el-option label="进度监控" value="#monitorBox"></el-option>
				<el-option label="访谈地图" value="#mapBox"></el-option>
				<el-option label="仪表盘" value="#gaugeBox"></el-option>
				<el-option label="项目甘特图" value="#ganttEchart"></el-option>
			</el-select> -->
		</div>
		<div v-for="item in echartsNameList" :key="item.name">
			<component :is="item.com" :id="item.com"></component>
		</div>
		<el-dialog
			title="自定义报表首页"
			:visible.sync="dialogVisible"
			width="30%">
			<draggable v-model="echartsNameList">
				<div v-for="item in echartsNameList" :key="item.index" class="dragg-style">
					{{item.name}}
				</div>
			</draggable>
			<div class="btn-wrapper">
				<el-button @click="dialogCancel" class="mini" size="mini"><span>取 消</span></el-button>
				<el-button type="primary" @click="dialogConfirm" class="mini" size="mini"><span>确 定</span></el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import ganttEchart from './ganttEchart'
import draggable from 'vuedraggable'
import dataBox from './echartsComponents/dataBox'
import monitorBox from './echartsComponents/monitorBox'
import mapBox from './echartsComponents/mapBox'
import gaugeBox from './echartsComponents/gaugeBox'
export default {
	name: 'index',
	components:{
		ganttEchart,
		draggable, //拖拽组件
		dataBox,
		monitorBox,
		mapBox,
		gaugeBox
	},
  data () {
    return {
			key: "RI_MONITOR_" + this.$cookies.get("userInfo").userId,
			projectId: null,
			breadcrumbList: [
				{
          name: '报表',
        }
      ],
			dialogVisible: false,
			echartsNameList: [
				{ name: '数据汇总', com: 'dataBox' },
				{ name: '进度监控', com: 'monitorBox' },
				{ name: '访谈地图', com: 'mapBox' },
				{ name: '仪表盘', com: 'gaugeBox' },
				{ name: '项目甘特图', com: 'ganttEchart' }
			],
			echartsAnchor: '', //报表导航锚点
			echartsNameListHistory:[]
    }
  },
	created () {
		this.projectId = this.$route.query.id
		this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      title: '报表',
      link: null,
      backTitle: ''
    })
    this.projectId = this.$route.query.id
		this.getEchartsNameList()
	},

	beforeDestroy() {
    if (!this.monitor_chart) { return }
    this.monitor_chart.dispose();
    this.monitor_chart = null;
  },
	methods: {
		// 展示弹框
		showDialog () {
			this.dialogVisible = true
			this.echartsNameListHistory = this.echartsNameList
		},
		// 获取自定义报表数组
		getEchartsNameList () {
			let echartsNameList = window.localStorage.getItem(this.key)
			if (echartsNameList && echartsNameList.length != 0) {
				this.echartsNameList = JSON.parse(echartsNameList)
			}
		},
		// 弹框的取消点击时间
		dialogCancel() {
			this.echartsNameList = this.echartsNameListHistory
			this.dialogVisible = false
		},
		// 弹框的确定点击事件
		dialogConfirm () {
			window.localStorage.setItem(this.key, JSON.stringify(this.echartsNameList))
			this.$message.success("已保存自定义报表首页")
			this.dialogVisible = false
		},
		goAnchor(selector) {
			document.querySelector(selector).scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
		},
		clearAnchor () {
		}
	}
}
</script>
<style lang="scss" scoped>
#monitorIndex {
	.echarts-nav-wrapper {
		margin: 0px 0 20px 0px;
		span {
			border: 1px solid #ccc;
			padding: 3px 15px 4px;
			display: inline-block;
			border-radius: 3px;
			font-size: 13px;
			color: #444;
			cursor: pointer;
			margin-right: 10px;
		}
		.select-wid {
			width: 120px;
		}
	}


	.ganttBox {
		margin: 20px 0 20px 0px;
		position: relative;
		.tit{
			margin-bottom: 20px;
			// margin-top: 30px;
		}
		.more {
			position: absolute;
			right: 0;
			top: 0;
			cursor: pointer;
		}
	}
	.dragg-style {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		height: 40px;
		text-align: center;
		line-height: 40px;
		margin-bottom: 20px;
		font-size: 12px;
		cursor: move;
	}
	.btn-wrapper {
		text-align: center;
	}
}
</style>
