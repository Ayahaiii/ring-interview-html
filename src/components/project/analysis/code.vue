<template>
  <div id="aysCode">
    <!-- 搜索框 -->
    <div class="search">
      <el-row :gutter="10">
        <el-col :span="2">
          <span class="fs12 fl">编码类型 :</span>
        </el-col>
        <el-col :span="4">
          <el-select
            class="fs12 fl"
            size="mini"
            style="width: 100%"
            v-model="type"
            placeholder="请选择编码类型"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <span class="fs12 fl">编码名称 :</span>
        </el-col>
        <el-col :span="6">
          <div class="fs12 fl" style="width: 100%">
            <el-input
              size="mini"
              placeholder="输入编号"
              v-model="keyword"
              clearable
            ></el-input>
          </div>
        </el-col>
        <el-col :span="1" style="line-height: 32px">
          <el-button type="primary" size="mini" class="mini" @click="getList">
            <span>搜索</span>
          </el-button>
        </el-col>
      </el-row>
    </div>

    <div style="margin: 20px 0">
      <el-row :gutter="20">
        <el-col :span="12">
          <div style="margin: 20px 0">编码列表</div>
          <!-- 创建框 -->
          <div>
            <el-row>
              <div class="add" @click="addInterview">
                <span class="iconfont fw">&#xe612;</span>
                <span>创建编码</span>
              </div>
              <div class="add" @click="exportTeam">
                <span class="iconfont fw">&#xe629;</span>
                <span>批量导出</span>
              </div>
              <div class="add" @click="deleteMore && !isSample">
                <span class="iconfont fw">&#xe606;</span>
                <span>批量删除</span>
              </div>
              <div class="add" @click="noteMore && !isSample">
                <span class="iconfont fw">&#xe670;</span>
                <span>自动标注</span>
              </div>
            </el-row>
          </div>
          <!-- 列表 -->
          <div class="nav">
            <el-table
              ref="workerList"
              :data="workerList"
              size="small"
              class="workerForm"
              v-loading="loading"
              @selection-change="handleSelectionChange"
              style="width: 100%"
            >
              <el-table-column
                type="selection"
                width="45"
                align="center"
              ></el-table-column>
              <el-table-column
                label="#"
                type="index"
                width="45"
                align="center"
              ></el-table-column>
              <el-table-column
                label="编码"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column
                label="类型"
                prop="type"
                align="center"
                width="60"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1" class="fs12">人工</span>
                  <span v-if="scope.row.type == 2" class="fs12">自动</span>
                </template>
              </el-table-column>
              <el-table-column
                label="频数"
                prop="markCount"
                align="center"
                width="70"
              >
                <template slot-scope="scope">
                  <span class="fs12">{{ scope.row.markCount || 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="样本数"
                prop="sampleCount"
                align="center"
                width="70"
              >
                <template slot-scope="scope">
                  <span class="fs12">{{ scope.row.sampleCount || 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                fixed="right"
                width="110"
              >
                <template slot-scope="scope">
                  <el-button type="primary" plain size="mini" class="mini">
                    <span @click="editor(scope.row)">编辑</span>
                  </el-button>
                  <el-button type="danger" plain size="mini" class="mini">
                    <span @click="onDelete(scope.row.id)">删除</span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination" v-if="workerList.length > 0">
              <el-pagination
                @size-change="handleSizeChange()"
                @current-change="handleCurrentChange()"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total"
                hide-on-single-page
              ></el-pagination>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="margin: 20px 0 15px">编码词云</div>
          <div>
            <el-row>
              <el-col :span="8">
                <el-select
                  class="fs12 fl"
                  size="mini"
                  @change="drawWordChart"
                  style="width: 70%"
                  v-model="cy"
                  placeholder="词云数量"
                >
                  <el-option
                    v-for="item in cyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="5" style="float: right; text-align: center">
                <div class="pin">
                  <div
                    v-bind:class="{ bgc: isActive }"
                    @click="frequency"
                    class="line"
                  >
                    频数
                  </div>
                  <div
                    v-bind:class="{ bgc: showActive }"
                    @click="sample"
                    class="line span2"
                  >
                    样本数
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="cy">
            <div :ref="'chart1'" style="width: 100%; height: 430px"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 显示弹框 -->
    <el-dialog title="创建编码" :visible.sync="dialogOption" width="40%">
      <div>
        <el-row>
          <el-col :span="2">
            <span class="fs12">类型：</span>
          </el-col>
          <el-col :span="22" class="encoder">
            <el-select
              class="fs12 fl"
              size="mini"
              style="width: 30%"
              v-model="form.type"
              placeholder="请选择编码类型"
              @change="convert"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <p>{{ content }}</p>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 0">
          <el-col :span="2">
            <span class="fs12">编码：</span>
          </el-col>
          <el-col :span="22">
            <el-input v-model="form.name" size="mini"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin: 20px 0">
          <el-col :span="2">
            <span class="fs12">规则：</span>
          </el-col>
          <el-col :span="22">
            <el-input
              v-model="form.rule"
              size="mini"
              type="textarea"
            ></el-input>
            <div style="margin: 20px 0" class="fs12">
              或者用 | ，并且用 &，支持()及嵌套，如：(企业|公司)&
              (创新|创业|(发明&专利))
            </div>
            <div style="text-align: center">
              <el-button size="small" class="mini" @click="deleteLabelCode">
                <span>取消</span>
              </el-button>
              <el-button
                type="primary"
                size="small"
                class="mini"
                @click="saveLabelCode"
                :disabled="isDisable || isSample"
              >
                <span>保存</span>
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import { export2Excel } from "../../../utils/excel";
export default {
  props: ["userId"],
  data() {
    return {
      isActive: true,
      showActive: false,
      content: "",
      projectId: null,
      isSample: false,
      breadcrumbList: [
        {
          name: "质性分析",
          path: "/analysis/index",
        },
        {
          name: "编码管理",
        },
      ],
      dialogOption: false,
      isDisable: false,
      keyword: "",
      type: "",
      form: {
        id: "",
        name: "",
        type: "",
        rule: "",
      },
      options: [
        {
          value: 1,
          label: "人工标签",
        },
        {
          value: 2,
          label: "自动标签",
        },
      ],
      cy: "",
      cyOptions: [
        {
          value: 1,
          label: "排名前10",
        },
        {
          value: 2,
          label: "排名前30",
        },
        {
          value: 3,
          label: "排名前50",
        },
      ],
      sampleCloud: [],
      markCloud: [],
      workerList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      interviewIdArr: [],
    };
  },

  created() {
    this.$emit("getSamllChild", {
      breadcrumbList: this.breadcrumbList,
      link: null,
    });
    this.projectId = this.$route.query.id;
    this.httpPost('/project/get/visit/' + this.projectId).then(res => {
      console.log(res.data)
      if (res.data == 1) {
        this.isSample = true
      }
    })
    this.getList();
  },

  methods: {
    // 动态显示隐藏
    frequency() {
      this.isActive = true;
      this.showActive = false;
      this.drawWordChart();
    },
    // 动态显示隐藏
    sample() {
      this.isActive = false;
      this.showActive = true;
      var flat = 0;
      this.drawWordChart();
    },
    // 动态改变提示
    convert(val) {
      // console.log(val)
      if (val === 1) {
        this.content = "注：需要手动对文本进行标注";
      } else {
        this.content = "注：自动匹配文本中符合规则的标签";
      }
    },

    saveLabelCode() {
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 1000);
      let params = this.form;
      params.projectId = this.projectId;
      this.httpPost("/analyze/code/save", params).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.message,
          });
          this.form = {
            id: "",
            name: "",
            type: "",
            rule: "",
          };
          this.getList();
          this.dialogOption = false;
        } else {
          // this.$message({
          //   type: 'error',
          //   message: res.message
          // })
          return;
        }
      });
      // 清空提示框内容
      this.content = "";
    },
    deleteLabelCode() {
      this.dialogOption = false;
      this.form = {
        id: "",
        name: "",
        type: "",
        rule: "",
      };
      // 清空提示框的内容
      this.content = "";
    },

    getWordChartData() {
      this.httpPost("/analyze/code/cloud", {
        name: this.keyword,
        userId: this.userId,
        type: this.type,
        projectId: this.projectId,
      }).then((res) => {
        if (res.code == 0 && res.data) {
          this.markCloud = [];
          this.sampleCloud = [];
          let temp = res.data;
          for (let key in temp.markCloud) {
            this.markCloud.push({
              name: key,
              value: temp.markCloud[key],
            });
          }
          for (let key in temp.sampleCloud) {
            this.sampleCloud.push({
              name: key,
              value: temp.sampleCloud[key],
            });
          }
        }
        this.drawWordChart();
      });
    },

    /*创建词云图*/
    drawWordChart() {
      let showChartList = [];
      // TODO 判断选中的词数量 及类型

      showChartList = this.markCloud;
      var worldCloudcharts = echarts.init(this.$refs["chart1"]);
      var worldCloudoption = {
        title: {
          x: "center",
          textStyle: {
            fontSize: 23,
            color: "#FFFFFF",
          },
        },
        tooltip: {
          show: true,
        },
        series: [
          {
            name: "",
            type: "wordCloud",
            size: ["100%", "100%"],
            //center:['400px','600px'],
            sizeRange: [12, 70],
            rotationRange: [-45, 90],
            textPadding: 10,
            drawOutOfBound: true,
            autoSize: {
              enable: true,
              minSize: 12,
            },
            textStyle: {
              normal: {
                color: function () {
                  return (
                    "rgb(" +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                    ].join(",") +
                    ")"
                  );
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            data: [],
          },
        ],
      };
      worldCloudoption.series[0].data = showChartList;
      worldCloudcharts.setOption(worldCloudoption);
    },

    onDelete: function (id) {
      let ids = [];
      ids.push(id);
      this.$confirm("确定移除标注吗？, 是否移除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            ids: ids,
            projectId: this.projectId,
          };
          this.httpPost("/analyze/code/delete", params).then((res) => {
            if (res.code === 0) {
              this.getList();
              this.$message({
                type: "success",
                message: "移除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    // 编辑
    editor(row) {
      this.dialogOption = true;
      this.form = row;
    },

    getList() {
      this.httpPost("/analyze/code/list/page", {
        name: this.keyword,
        userId: this.userId,
        type: this.type,
        projectId: this.projectId,
        pageNum: this.currentPage,
        pageSize: this.currentSize,
      }).then((res) => {
        if (res.code == 0) {
          this.workerList = res.data.data;
          // console.log(this.workerList)
          this.currentPage = res.data.pageNum;
          this.currentSize = res.data.pageSize;
          this.total = res.data.total;
          this.getWordChartData();
        }
      });
    },

    addInterview() {
      this.dialogOption = true;
    },
    // 批量导出
    exportTeam() {
      // console.log(this.workerList)
      this.workerList.forEach((item) => {
        if (item.sampleCount == null) {
          item.sampleCount = 0;
        }
        if (item.type === 1) {
          item.type = "人工";
        } else {
          item.type = "自动";
        }
      });
      // console.log(this.workerList)
      const tHeader = ["编码", "类型", "频数", "样本数"];
      const filterVal = ["name", "type", "markCount", "sampleCount"];
      const list = this.workerList;
      const fileName = "样本编码表格";
      export2Excel(tHeader, filterVal, list, fileName);
    },
    deleteMore() {
      var ids = [];
      if (this.interviewIdArr.length == 0) {
        // 弹出错误信息
        this.$message({ type: "warning", message: "请选择需要删除的编码" });
        return;
      }
      ids = this.interviewIdArr;
      this.$confirm("确定移除标注吗？, 是否移除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            ids: ids,
            projectId: this.projectId,
          };
          this.httpPost("/analyze/code/delete", params).then((res) => {
            if (res.code === 0) {
              this.getList();
              this.$message({
                type: "success",
                message: "移除成功!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 列表选择状态改变
    handleSelectionChange(val) {
      this.interviewIdArr = [];
      val.forEach((item) => {
        this.interviewIdArr.push(item.id);
      });
    },
    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
  },
};
</script>

<style scoped>
#aysCode >>> .el-col-2 {
  width: 7%;
}
#aysCode >>> .encoder {
  display: flex;
  align-items: center;
}
#aysCode >>> .encoder p {
  /* text-align: center; */
  margin-left: 20px;
  color: #2e83d3;
  font-size: 12px;
}
#aysCode >>> .el-button + .el-button {
  margin-left: 3px;
}
#aysCode >>> .el-table td div {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 12px;
}
#aysCode >>> .el-table .cell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 12px;
}
#aysCode >>> .el-button--mini {
  padding: 3px 7px;
  font-size: 12px;
  border-radius: 3px;
}
</style>
<style lang="scss" scoped>
.search {
  margin: 20px 0 20px 0;
  .fl {
    float: left;
    line-height: 32px;
    font-size: 12px;
    color: #555;
    span {
      font-size: 12px;
    }
  }
  .fr {
    float: right;
    line-height: 32px;
  }
  .w9 {
    width: 85%;
  }
}
.add {
  margin: 0px 40px 20px 0;
  float: left;
  .fw {
    font-size: 15px;
    font-weight: bold;
  }
  span {
    color: #2e83d3;
    padding-right: 5px;
    font-weight: 500;
    cursor: pointer;
  }
}
.pin {
  border: 1px solid #ccc;
  width: 100px;
  height: 28px;
  overflow: hidden;
  div {
    cursor: pointer;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    width: 49px;
    line-height: 28px;
    border-right: 1px solid #ccc;
    font-size: 12px;
    float: left;
  }
  .span2 {
    border-right: 0px solid #ccc !important;
  }
  .bgc {
    background-color: #eee;
  }
}
.cy {
  margin-top: 16px;
  width: 100%;
  border: 1px solid #ccc;
  height: 437px;
}
</style>
