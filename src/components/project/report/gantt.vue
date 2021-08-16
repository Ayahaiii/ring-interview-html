<!-- 甘特图 -->
<template>
	<div>
		<wlGanttMore showPagination="true"></wlGanttMore>
	</div>
</template>

<script>
import wlGanttMore from './ganttEchart'
export default {
	components: {
		wlGanttMore
	},
  data () {
    return {
			breadcrumbList: [
				{
          name: '报表',
          path: '/report'
        }, {
          name: '甘特图',
        }
			],
    }
  },
	created () {
		this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/report',
      backTitle: '报表'
    })
	}
}
</script>

<style lang='scss' scoped>
</style>
