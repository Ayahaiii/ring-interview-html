<template>
  <div id="soundRecording">
    <div>
      <!--搜索 -->
      <div class="search">
        <el-row>
          <!-- 阅读模式搜索 -->
          <el-col :span="3">
            <div class="drop" style="width: 90%">
              <el-select size="mini" v-model="speaker" @change="changeSpeaker">
                <el-option
                  v-for="item in speakerList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
          <!-- 阅读模式搜索 -->
          <el-col :span="7">
            <el-input size="mini" v-model="keyword" style="width: 97%"></el-input>
          </el-col>
          <!-- 阅读模式搜索 -->
          <el-col :span="2">
            <el-button size="mini" @click="getWriteList" type="primary" class="mini">
              <span>搜索</span>
            </el-button>
          </el-col>
          <el-col :span="12">
            <div style="text-align: right">
              <span style="vertical-align: middle;" class="fs12">显示录音详情：</span>
              <el-switch v-model="isShowNav" active-color="#2e83d3" inactive-color="#ccc"></el-switch>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 阅读模式列表 -->
      <div style="min-height: 400px" v-loading="loading">
        <div v-for="(item, index) in list" :key="'speak'+index" class="item">
          <el-row
            class="wrp"
            v-bind:style="{background: item.type == 3 ? '#fafafa' : '#fff', marginBottom: (item.type == 3 && speaker == 3) ? '10px' : '0'}"
          >
            <el-col :span="3">
              <div class="name">
                <span
                  class="fs12"
                  v-bind:style="{color: item.type == 3 ? '#2e83d3' : '#444'}"
                >{{ item.speakName }} :</span>
              </div>
            </el-col>
            <el-col :span="21" v-bind:class="{'current': active == item.id}">
              <div class="txt">
                <span class="fs12">{{ item.paragraph }}</span>
              </div>
              <div style="margin: 10px 0 0;overflow:hidden;" v-if="isShowNav">
                <el-row>
                  <span class="vItem" style="width: 180px">
                    <span class="fs10">录音：{{ item.fileName }}</span>
                  </span>
                  <span class="vItem" style="width: 140px">
                    <span class="fs10" v-if="item.beginTime">开始：{{ item.beginTime }}</span>
                  </span>
                  <span class="vItem" style="width: 140px">
                    <span
                      class="fs10"
                      v-if="item.duration"
                    >时长：{{ item.duration ? formatDuring(item.duration) : '0s' }}</span>
                  </span>
                  <span class="vItem flr" style="margin-right: 0;width: 240px">
                    <span class="fs10">录入时间：{{ item.createTime }}</span>
                  </span>
                  <span class="vItem flr" style="width: 120px">
                    <span class="fs10">录入员：{{ item.createName }}</span>
                  </span>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 暂无数据 -->
        <div v-if="noMessage" style="text-align: center;margin: 100px 0;color: #666">暂无数据 . . .</div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="list.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowNav: false,
      speaker: null,
      speakerList: [
        { value: null, label: "全部" },
        { value: 1, label: "主持人" },
        { value: 2, label: "助理" },
        { value: 3, label: "受访者" },
        { value: 4, label: "关系人" }
      ],
      keyword: "",
      list: [],
      active: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      noMessage: false,
      interviewId: null,
      projectId: null,
      loading: false,
      status: null,
      interName: null
    };
  },
  created() {
    this.interName = this.$route.query.ina;
    this.projectId = this.$route.query.id;
    this.interviewId = this.$route.query.inId;
    this.status = +this.$route.query.sta;
    this.$emit("getChild", {
      breadcrumbList: this.breadcrumbList,
      link: "/talk",
      interviewName: this.interName,
      interviewId: this.interviewId
    });
    this.getWriteList();
  },
  methods: {
    // 导出对话文本
    goExport() {
      this.$router.push({
        path: "/talk/text/export",
        query: {
          id: this.projectId,
          inId: this.interviewId,
          ina: this.interName
        }
      });
    },

    // 切换阅读模式讲话者
    changeSpeaker(val) {
      this.getWriteList();
    },

    // 获取录入文本列表
    getWriteList() {
      this.loading = true;
      this.list = [];
      var params;
      params = {
        keyword: this.keyword,
        speakType: this.speaker,
        interviewId: +this.interviewId,
        projectId: +this.projectId,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      };
      this.httpPost("/interview/list/paragraph", params)
        .then(res => {
          if (res.code == 0) {
            this.list = res.data.data;
            this.total = res.data.total;
            this.$emit("getSamllChild", {
              interviewName: this.interName
            });
            if (this.total <= 0) {
              this.noMessage = true;
            } else {
              this.noMessage = false;
            }
            this.loading = false;
          } else {
            this.$message({ type: "error", message: res.message });
            this.loading = false;
          }
        })
        .catch(error => {
          this.$message({ type: "error", message: error });
          this.loading = false;
        });
    },

    // 格式化毫秒
    formatDuring(mss) {
      var minutes = Math.floor((mss / 1000 / 60) << 0);
      var seconds = Math.floor((mss / 1000) % 60);
      return minutes + " m " + seconds + " s ";
    },

    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val;
      this.getWriteList();
    },

    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getWriteList();
    }
  }
};
</script>

<style scoped>
.drop >>> .el-input--mini .el-input__inner {
  height: 28px;
  line-height: 28px;
}
.drop >>> .el-input--mini .el-input__icon {
  line-height: 26px;
}
</style>
<style lang='scss' scoped>
#soundRecording {
  div {
    overflow: hidden;
  }
  .padd {
    padding: 2px 0;
  }
  .current {
    background-color: #eee;
    padding: 5px;
  }
  .vItem {
    display: inline-block;
    margin-right: 15px;
    line-height: 28px;
    color: #444;
    width: 15%;
  }
  .flr {
    float: right;
    text-align: right;
  }
  .col {
    span {
      color: #fff !important;
    }
  }
  .search {
    margin: 20px 0 10px;
  }
  .item {
    line-height: 20px;
    .wrp {
      padding: 15px 10px 15px 0;
      border-bottom: 1px solid #eee;
      min-height: 50px;
      // margin-bottom: 5px;
      .vItem {
        color: #999;
        span {
          font-size: 10px;
        }
      }
    }
    .ico {
      overflow: hidden;
      margin: 20px 0 0;
      li {
        float: left;
        width: 100%;
        margin-bottom: 8px;
        text-align: right;
        i {
          font-size: 18px;
          color: #666;
          cursor: pointer;
        }
      }
    }
    .name {
      font-size: 12px;
      padding-left: 15px;
      color: #444;
    }
    .txt {
      font-size: 12px;
      color: #444;
    }
  }
}
</style>
