<!--  -->
<template>
  <div id="dialogCom">
		<el-dialog
      :title="title"
      :visible.sync="sampleDialog"
			:before-close="cancelDia"
      width="60%"
		>
      <div class="sample-dialog">
        <div style="width: 45.5%;">
          <div :class="['box', {'pad': ifCode}]">
            <div class="item pointer" v-for="(item, index) in listAll"  :class="{active: item.isActive, wid: ifCode}" :key="item.id" @click="toHasWords(item, index)">
              <div>{{ item.name }}</div>
              <div>{{ item.code }}</div>
            </div>
          </div>
          <div style="margin-top: 10px; overflow: auto">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total='total'
              hide-on-single-page
            >
            </el-pagination>
          </div>
        </div>
        <div class="icon-po">
          <div @click="arrowRight"><i class="el-icon-arrow-right"></i></div>
          <div @click="arrowLeft"><i class="el-icon-arrow-left"></i></div>
        </div>
        <div style="width: 45.5%;">
          <div class="box">
            <div class="item pointer"  v-for="(item, index) in listChoose" :class="{wid: ifCode}" :key="index" @click="toWaitWords(item, index)">
              <div>{{ item.name }}</div>
              <div>{{ item.code }}</div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='mini' class="mini"  @click="cancelDia"><span>取消</span></el-button>
        <el-button size='mini' class="mini" type="primary" @click="saveSample"><span>确定</span></el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
export default {
	props: [ 'title', 'sampleDialog', 'listAll', 'listChoose', 'pageSize', 'currentPage', 'total', 'ifCode'],
  data () {
    return {
    }
  },
	methods: {
		toHasWords (item, index) {
			this.$emit('toHasWords', item)
		},
		toWaitWords (item, index) {
			this.$emit('toWaitWords', item)
		},
		cancelDia () {
			this.$emit('cancelDia', false)
		},
		saveSample () {
			this.$emit('saveSample')
		},
		handleSizeChange () {
			this.$emit('handleSizeChange')
		},
		handleCurrentChange () {
			this.$emit('handleCurrentChange')
    },

    arrowRight() {
      this.$emit('arrowRight')
    },
    arrowLeft () {
      this.$emit('arrowLeft')
    },
	}
}
</script>

<style  lang='scss'  scoped>
	.box1 {
		background-color: #F3F8F9;
		border: 1px solid #c1c1c1;
		overflow: hidden;
		.item {
			float: left;
			background-color: #e7e7e7;
			border-radius: 4px;
			div {
				color: #101010;
				text-align: center;
				font-size: 12px;
			}
		}
	}
	.sample-dialog {
		display: flex;
		justify-content: space-around;
		.icon-po {
			margin-top: 10%;
		}
		.pad {
			padding: 15px 10px 10px 20px !important;
		}
		.box {
			@extend .box1;
			padding: 10px;
			width: 100%;
			height: 220px;
			.item {
				margin: 0 10px 10px 0;;
				padding: 3px 10px;
				width: 60px;
				white-space: nowrap;
			}
			.wid {
				width: 75px !important;
			}
		}
		.pointer {
			cursor: pointer;
		}
		.active {
			background-color: #2e83d3 !important;
			div {
				color: #ffffff !important;
			}
		}
	}
</style>
