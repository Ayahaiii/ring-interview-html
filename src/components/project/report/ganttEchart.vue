<!-- 甘特图 -->
<template>
	<div id="ganttBox">
		<div class="top-filter" v-if="showPagination == 'true'">
			<div class="filter-item">
				<label>关键词：</label>
				<el-input v-model="keyword" placeholder="输入关键字进行智能搜索" size="mini" style="width: 350px;"></el-input>
			</div>
			<div class="filter-item">
				<el-button type="primary" size="mini" class="mini" @click="getGantt"><span>搜索</span></el-button>
			</div>
		</div>
		<div class="gantt-more" v-if="!showPagination">
			<div class="tit">项目甘特图</div>
			<div class="more fs12" @click="$router.push(`/report/gantt?id=${projectId}`)">查看更多<i class="el-icon-d-arrow-right"></i></div>
		</div>
		<div class="gantt-wrapper">
			<wlGantt
				:data="data"
				use-real-time
				use-ing-time
				use-done-time
				use-check-column
				use-index-column
				date-type="monthAndDay"
				:start-date="startDate"
				:end-date="endDate"
			>
			</wlGantt>
		</div>
		<div class="pagination" v-if="showPagination == 'true'">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[10, 20, 30, 40]"
				:page-size="pageSize"
				layout="total, sizes, prev, pager, next"
				:total='total'
				hide-on-single-page>
			</el-pagination>
		</div>
	</div>

</template>

<script>
import wlGantt from './pages/wl-gantt/index'
export default {
	props: ['showPagination'],
  data () {
    return {
			projectId: null,
			data: [], // 数据
			startDate: null,
			endDate: null,
			selected:[], // 选中数据
			currentPage: 1,
      pageSize: 10,
			total: 20,
			keyword: '',
    }
  },
	created () {
		this.projectId = this.$route.query.id
	},
	mounted () {
		this.getGantt()
	},
	methods: {
		// 改变当前页码
		handleSizeChange(val) {
			this.pageSize = val
			this.getGantt()
		},
		// 改变当前每页条数
		handleCurrentChange(val) {
			this.currentPage = val
			this.getGantt()
		},
		// 获取甘特图
		getGantt () {
			let params = {
				keyword: this.keyword,
				pageNum: this.currentPage,
				pageSize: this.pageSize,
				projectId: this.projectId
			}
			this.httpPost(`/monitor/gante`, params).then(res => {
				if (res.code == 0) {
					this.startDate = res.data.startDate
					this.endDate = res.data.endDate
					this.data = res.data.pageList.data
					this.total = res.data.pageList.total
          this.pageSize = res.data.pageList.pageSize
          this.pageNum = res.data.pageList.pageNum
				}
			})
		}
	}
}
</script>
<style scoped>
#ganttBox >>> .el-pagination span{
	font-size: 12px;
}
</style>
<style lang='scss' scoped>
#ganttBox {
	margin: 20px 0 20px 0px;
}
.top-filter {
  display: flex;
	margin-bottom: 20px;
	.filter-item {
		margin-right: 10px;
		display: flex;
		align-items: center;
		label {
			color: #444;
			font-size: 12px;
			margin-right: 10px;
			min-width: 50px;
		}
	}
}
.gantt-more {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	.more {
		cursor: pointer;
	}
}
.gantt-wrapper {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.pagination {
  margin-top: 30px;
}
</style>
