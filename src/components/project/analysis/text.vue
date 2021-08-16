<template>
  <div id="ays">
    <div class="projectDetail">
      <span class="tit">{{title}}</span>
      <span class="sel">
        <el-select size="mini" v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span>
      <span class="back" @click="goteamList()">
        <i class="backBtn el-icon-back"></i>返回质性分析首页
      </span>
    </div>
    <!-- 筛选 -->
    <div class="shai">
      <el-row>
        <el-col :span="3">
          <div class="sel">
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
        <el-col :span="8">
          <div class>
            <el-input
              size="mini"
              style="width: 97%"
              placeholder="输入关键词进行搜索"
              v-model="keyword"
              clearable
            ></el-input>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="mini" class="mini" @click="getList">
            <span>搜索</span>
          </el-button>
        </el-col>
        <!-- <span class="xuan" @click="showOptionBox">显示选项</span> -->
        <!-- <span class="xuan addColor" v-if="type == 2" @click="openLabelDialog">添加标签</span> -->
        <span class="sel" style="float: right">
          <el-select size="mini" v-model="type" @change="changeType(type)" placeholder="请选择模式">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
      </el-row>
    </div>

    <!--注意事项-->
    <div class="attention" v-show="type ===2">
      <p>注：可以选中文字进行标注</p>
    </div>

    <!-- list -->
    <div id="box-container">
      <el-row id="left">
        <el-col :span="16">
          <!-- 列表 -->
          <div class="left" id="list">
            <div v-for="(item, index) in list" :key="'speak'+index" class="item">
              <el-row class="wrp">
                <el-col :span="3">
                  <div
                    class="name"
                    v-bind:style="{color: item.type == 3 ? '#2e83d3' : '#444'}"
                  >{{ item.name }} :</div>
                </el-col>
                <el-col :span="21">
                  <div
                    v-bind:style="{background: item.type == 3 ? '#fafafa' : '#fff'}"
                    :ref="item.id"
                    :id="item.id"
                    :data-id="item.id"
                    class="text"
                    v-html="item.paragraph"
                    @mouseup="onMouseUp(item)"
                  ></div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="8" v-if="isShow">
          <div class="right" id="right">
            <!-- code列表 -->
            <div
              ref="codeBox"
              v-for="(labItem, labIndex) in markList"
              :key="'lab'+ labIndex"
              style="text-align:left; position: relative"
            >
              <i class="iconfont typeface" @click="deletip(labIndex)">&#xe611;</i>
              <span
                class="codeBox codeItem"
                @click="selectSpan(labItem)"
                :data-id="labItem.id"
                :class="{cur: active == labItem.id}"
              >{{ labItem.name }}</span>
              <div class="lis">
                <el-row>
                  <el-col :span="6">
                    <span class="fs12 t" style="color: #2e83d3;">编码：</span>
                  </el-col>
                  <el-col :span="18">
                    <p class="fs12 t">{{ labItem.name }}</p>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <span
                      class="fs12 t"
                      style="color: #2e83d3;vertical-align: -webkit-baseline-middle;"
                    >备注：</span>
                  </el-col>
                  <el-col :span="18">
                    <p class="fs12 t">
                      <el-tooltip
                        class="item"
                        popper-class="activePop"
                        effect="light"
                        :content="labItem.note"
                        placement="top"
                      >
                        <span
                          class="fs12 t"
                        >{{ labItem.note.length > 10 ? labItem.note.substring(0,10) + '...' : labItem.note }}</span>
                      </el-tooltip>
                    </p>
                  </el-col>
                </el-row>
                <el-row style="    margin-top: 5px;">
                  <el-col :span="6">
                    <span class="fs12 t" style="color: #2e83d3;">时间：</span>
                  </el-col>
                  <el-col :span="18">
                    <p class="fs12 t">{{ labItem.createTime }}</p>
                  </el-col>
                </el-row>
                <el-row style="    margin-top: 5px;">
                  <el-col :span="6">
                    <span class="fs12 t" style="color: #2e83d3;">编码者：</span>
                  </el-col>
                  <el-col :span="18">
                    <p class="fs12 t">{{ labItem.createName }}</p>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <span
                      class="fs12 t"
                      style="color: #2e83d3;vertical-align: -webkit-baseline-middle;"
                    >引文：</span>
                  </el-col>
                  <el-col :span="18">
                    <el-tooltip
                      class="item"
                      popper-class="activePop"
                      effect="light"
                      :content="labItem.paragraph"
                      placement="top"
                    >
                      <span
                        class="fs12 t"
                      >{{ labItem.paragraph.length > 10 ? labItem.paragraph.substring(0,10) + '...' : labItem.paragraph }}</span>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="list.length > 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 显示选项弹框 -->
    <!-- <el-dialog
      title="提示"
      :visible.sync="dialogOption"
      width="35%">
      <div>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
          <el-checkbox style="padding: 15px 0;" v-for="item in checkOption" :label="item" :key="item">{{item}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='mini' class="mini" @click="dialogOption = false"><span>取消</span></el-button>
        <el-button size='mini' class="mini" type="primary" @click="dialogOption = false"><span>确定</span></el-button>
      </span>
    </el-dialog>-->

    <!-- 显示编码弹框 -->
    <el-dialog title="提示" :visible.sync="dialogLabel" width="40%">
      <div style="margin-bottom: 40px">
        <el-row style="width: 90%;">
          <el-col :span="4">
            <span class="fs12">编码：</span>
          </el-col>
          <el-col :span="9">
            <el-select
              size="mini"
              v-model="labelVal"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择编码"
              @change="selectOption"
            >
              <el-option
                v-for="item in labelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0 0;width: 90%">
          <el-col :span="4">
            <span class="fs12">备注：</span>
          </el-col>
          <el-col :span="20">
            <div>
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                size="mini"
                v-model="markers"
              ></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" class="mini" @click="deleteTip('.tip')">
          <span>取消</span>
        </el-button>
        <el-button size="mini" class="mini" type="primary" @click="addLabelMessage">
          <span>确定</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
#addTip {
  position: absolute;
  top: -24px;
  right: -1px;
  width: 80px;
  line-height: 20px;
  text-align: center;
}
.typeface {
  z-index: 20;
  position: absolute;
  left: 111px;
  top: -9px;
  color: #fc6a6a;
  cursor: pointer;
}
.tip {
  font-size: 12px;
  position: relative;
  color: #fff !important;
  background-color: #2e83d3 !important;
}
.cur {
  background-color: #2e83d3 !important;
  color: #fff !important;
}
.text span {
  font-size: 12px;
  background-color: #fff;
  border: 1px solid #2e83d3;
  color: #2e83d3;
  cursor: pointer;
}
.codeBox {
  border: 1px solid #ccc;
  padding: 2px 10px;
  background-color: #eee;
}
.codeItem {
  font-size: 12px;
  text-align: center;
  height: 25px;
  border-radius: 5px;
  width: 100px;
  margin-left: 20px;
  display: inline-block;
  margin-bottom: 120px;
  cursor: pointer;
}
.lineStype::before {
  content: "";
  position: absolute;
  left: -7px;
  top: 28px;
  width: 30px;
  height: 0;
  box-sizing: border-box;
  border-bottom: 1px solid #2e83d3;
  transform-origin: bottom center;
  transform: rotateZ(45deg) scale(1);
}
.attention p {
  font-size: 12px;
  color: #2e83d3;
  margin-bottom: 5px;
  padding-left: 10px;
}
</style>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      projectId: null,
      sampleId: null,
      breadcrumbList: [
        {
          name: "质性分析",
          path: "/analysis/index"
        },
        {
          name: "分析首页",
          path: "/analysis/index"
        },
        {
          name: "查看"
        }
      ],
      speakerList: [
        { value: null, label: "全部" },
        { value: 1, label: "主持人" },
        { value: 2, label: "助理" },
        { value: 3, label: "受访者" },
        { value: 4, label: "关系人" }
      ],
      labelVal: null,
      dialogLabel: false,
      markers: "",
      title: "",
      options: [
        {
          value: 1,
          label: "我"
        },
        {
          value: 2,
          label: "分析员1"
        },
        {
          value: 3,
          label: "分析员2"
        }
      ],
      visible: true,
      speakerOptions: [
        {
          value: 1,
          label: "全部讲话者"
        },
        {
          value: 2,
          label: "全部访问员"
        },
        {
          value: 3,
          label: "全部研究对象"
        },
        {
          value: 4,
          label: "张三生"
        },
        {
          value: 5,
          label: "王格武"
        }
      ],
      value: 1,
      speaker: null,
      keyword: "",
      // 控制整个页面的核心
      type: 2,
      typeOptions: [
        {
          value: 1,
          label: "查看模式"
        },
        {
          value: 2,
          label: "编辑模式"
        }
      ],
      list: [],
      markList: [],
      // checkOption: ['编码', '备注', '编码者', '时间', '引文', '标线'],
      // checkOption: ['编码', '备注', '编码者', '时间','引文'],
      // checkList: [],
      // checkAll: false,
      // isIndeterminate: true,
      // dialogOption: false,
      minTop: 0,
      // -------------------------------
      currentParagraph: {},
      currentMark: {
        startIndex: 0,
        endIndex: 0,
        selectText: ""
      },
      currentPage: 1,
      pageSize: 10,
      total: null,
      content: "",
      labelId: null,
      isShow: true, // 用来控制标签是否显示
      active: null, // 用来高亮当前标签
      checkSel: true, // 切换选择或创建标签的方式
      labelOptions: [], // 标签列表
      startIndex: null, // 鼠标选中的开始坐标
      endIndex: null, // 鼠标选中的结束坐标
      nowText: "", // 鼠标当前所在文本
      selctText: "", // 鼠标选中的文本
      pId: null, // 当前选中文本所在的段落id
      dLabelList: [], // 存储标签信息数组
      dCodeList: [
        {
          id: 1,
          labelList: [
            {
              labId: 2,
              nowText: "",
              selctText: "",
              name: "",
              remarks: "",
              startIndex: null,
              endIndex: null,
              length: null
            }
          ]
        }
      ],
      // ------------------------------------

      pointLine: {
        1: [100, 100, 200, 100],
        2: [150, 115, 250, 115]
      },
      pointLabel: {
        1: [200, 100, 220, 100],
        2: [250, 115, 270, 120]
      }
    };
  },

  created() {
    this.$emit("getSamllChild", {
      breadcrumbList: this.breadcrumbList,
      link: null
    });
    this.projectId = this.$route.query.id;
    this.sampleId = this.$route.query.sId;
    this.title = this.$route.query.name;
    this.getList();
    this.getCodeOption(); // 获取编码列表
  },

  mounted() {},

  methods: {
    //点击删除编码
    deletip(index) {
      let ids = []
      ids.push(this.markList[index].id)
    //  console.log(this.markList)
      let params = {
        ids: ids,
        projectId: this.projectId
      };
      this.httpPost("/analyze/mark/delete", params).then(res => {
        if (res.code === 0) {
          this.markList.splice(index, 1);
          this.getList();
          this.$message({
            type: "success",
            message: "移除成功!"
          });
        }
      });
    },

    onMouseUp(row) {
      if (this.type == 2) {
        this.addEvent(row);
      } else {
        return;
      }
    },
    // 添加事件
    addEvent(row) {
      // console.log(row)
      if ($(".tip").length > 0 && this.isClickAddTip) {
        this.deleteTip(".tip");
      }
      this.interviewId = row.interviewId;
      this.currentMark.id = row.id;
      var txt = document.getSelection();
      let previousSibling = txt.anchorNode.previousSibling;
      let nextSibling = txt.anchorNode.nextSibling;
      if (!previousSibling) {
        // 第一个标签
        this.currentMark.startIndex = txt.anchorOffset;
        this.currentMark.endIndex = txt.focusOffset;
        this.currentMark.selctText = row.paragraph.substring(
          this.currentMark.startIndex,
          this.currentMark.endIndex
        );
      } else {
        // 最后一个标签
        var begin;
        var len;
        let idStr = +previousSibling.getAttribute("id").substring(3);
        this.markList.forEach(item => {
          if (item.id == idStr) {
            begin = item.begin;
            len = item.len;
          }
        });
        this.currentMark.startIndex = txt.anchorOffset + begin + len;
        this.currentMark.endIndex = txt.focusOffset + begin + len;
        this.currentMark.selctText = row.paragraph.substring(
          this.currentMark.startIndex,
          this.currentMark.endIndex
        );
      }
      if (this.currentMark.selctText && this.currentMark.selctText.length > 0) {
        let spanStr = `<span class='tip'>${this.currentMark.selctText}</span>`;
        $(`#${row.id}`)[0].innerHTML = $(`#${row.id}`)[0].innerHTML.replace(
          this.currentMark.selctText,
          spanStr
        );
        this.dialogLabel = true;
      }
    },
    // 删除提示标签
    deleteTip(id) {
      let item = $(id);
      if (item.length > 0) {
        let itemTxt = item[0].innerText;
        let itemParent = item[0].parentElement;
        let parentHtml = item[0].parentElement.innerHTML;
        let str = item[0].outerHTML;
        parentHtml = parentHtml.replace(str, itemTxt);
        item[0].parentElement.innerHTML = parentHtml;
      }
      this.labelVal = [];
      this.markers = "";
      this.dialogLabel = false;
    },
    // 获取编码的列表
    getCodeOption() {
      var params;
      if (this.labelVal) {
        params = {
          projectId: this.projectId,
          name: this.labelVal[0]
        };
      } else {
        params = {
          projectId: this.projectId,
          name: null
        };
      }
      this.httpPost("/analyze/code/list/page", params).then(res => {
        if (res.code == 0) {
          this.labelOptions = [];
          res.data.data.forEach(item => {
            let obj = {
              value: item.id,
              label: item.name
            };
            this.labelOptions.push(obj);
          });
        }
      });
    },
    // 创建编码
    addCode() {
      if (this.labelVal[0].length > 5) {
        this.$message({ type: "warning", message: "编码长度不超过5个字符" });
        return;
      }
      let params = {
        name: this.labelVal[0],
        type: 1,
        projectId: +this.projectId
      };
      this.httpPost("/analyze/code/save", params).then(res => {
        if (res.code == 0) {
          this.labelVal = [];
          this.getCodeOption();
        }
      });
    },
    // 选择编码
    selectOption(val) {
      if (this.labelVal.length > 1) {
        let arr = [];
        arr.push(this.labelVal[this.labelVal.length - 1]);
        this.labelVal = arr;
      }
      if (typeof this.labelVal[0] == "string") {
        this.addCode();
      }
    },
    // 确认添加标签
    addLabelMessage() {
      var labObj = {};
      // 获取编码名称和id
      this.labelOptions.forEach(item => {
        if (item.value == this.labelVal[0]) {
          labObj.name = item.label;
          labObj.id = item.value;
        }
      });
      let obj = {
        id: this.currentMark.id,
        codeId: labObj.id,
        nowText: this.nowText,
        selctText: this.selctText,
        name: labObj.name,
        markers: this.markers,
        startIndex: this.currentMark.startIndex,
        endIndex: this.currentMark.endIndex,
        length: this.currentMark.endIndex - this.currentMark.startIndex
      };
      var params = {
        projectId: +this.projectId,
        interviewId: this.interviewId,
        paragraphId: obj.id,
        sampleId: this.sampleId,
        codeId: obj.codeId,
        begin: obj.startIndex,
        len: obj.length,
        note: obj.markers
      };
      this.httpPost("/analyze/mark/save", params).then(res => {
        if (res.code == 0) {
          this.labelId = res.data;
          this.$message({ type: "success", message: res.message });
          this.dialogLabel = false;
          this.labelVal = [];
          this.markers = "";
          this.getList();
          this.getMarkList();
        }
      });
    },
    // 获取标签的列表
    getMarkList() {
      this.httpPost("/analyze/code/mark/list", {
        sampleId: this.sampleId,
        projectId: this.projectId
      }).then(res => {
        if (res.code == 0) {
          this.markList = res.data;
          this.$nextTick(function() {
            var arr = [];
            var mark = [];
            var arr3 = [];
            this.list.forEach(item => {
              arr.push(item.id);
            });
            this.markList.forEach(item => {
              mark.push(item.paragraphId);
            });

            // 控制标签是否显示
            for (var i = 0; i < arr.length; i++) {
              for (var j = 0; j < mark.length; j++) {
                if (arr[i] == mark[j]) {
                  arr3.push(arr[i]);
                }
              }
            }
            if (arr3.length > 0) {
              this.isShow = true;
            } else {
              this.isShow = false;
            }
            this.markList.forEach(item => {
              // 重绘文本标签
              if (this.isShow) {
                this.drawSpanLabel(item);
              }
            });
          });
        }
      });
    },
    // 重绘文本标签
    drawSpanLabel(item) {
      var that = this;
      var label;
      setTimeout(() => {
        let spanItem = $(`#${item.paragraphId}`);
        var paragraphHtml = spanItem[0].innerText;
        let startIndex = item.begin;
        let endIndex = item.begin + item.len;
        let selctText = paragraphHtml.substring(startIndex, endIndex);
        if (selctText && selctText.length > 0) {
          let spanStr = `<span id='lab${item.id}' class='labs'>${selctText}</span>`;
          $(`#${item.paragraphId}`)[0].innerHTML = $(
            `#${item.paragraphId}`
          )[0].innerHTML.replace(selctText, spanStr);
        }
      }, 500);
      setTimeout(() => {
        label = $(`#lab${item.id}`);
        label.on("click", function() {
          that.active = item.id;
          $(".left span").removeClass("cur");
          $(this).addClass("cur");
        });
      }, 1000);
    },
    // 为标签添加点击事件，给文本标签添加选中样式
    selectSpan(item) {
      this.active = item.id;
      var that = this;
      $(".labs").each(function(index, ele) {
        var strLab = +$(this)[0]
          .getAttribute("id")
          .substring(3);
        if (strLab == that.active) {
          $(this).addClass("cur");
        } else {
          $(this).removeClass("cur");
        }
      });
    },
    goteamList() {
      // this.$router.push({path: '/analysis/index', query: {id: this.projectId}})
    },
    // 获取文本列表
    getList() {
      this.list = [];
      this.httpPost("/analyze/code/text/list", {
        keyword: this.keyword,
        speakerId: this.speakerId,
        sampleId: this.sampleId,
        projectId: this.projectId,
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        speakType: this.speaker
      }).then(res => {
        if (res.code == 0) {
          this.list = res.data.data;
          this.total = res.data.total;
          this.getMarkList();
        }
      });
    },
    // 切换编辑或查看模式
    changeType(value) {
      this.active = null;
      $(".cur").removeClass("cur");
      this.deleteTip(".tip");
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
    // 切换阅读模式讲话者
    changeSpeaker(val) {
      this.getList();
    },
    // showOptionBox () {
    //   this.dialogOption = true
    // },
    // handleCheckAllChange (val) {
    //   // this.checkList = val ? this.checkOption : [];
    //   // this.isIndeterminate = false;
    // },
    // handleCheckedCitiesChange (value) {
    //   // let checkedCount = value.length;
    //   // this.checkAll = checkedCount === this.checkOption.length;
    //   // this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkOption.length;
    // },

    // *******************************画线暂存代码****************************
    // 画点
    makedot(x, y) {
      let pointDiv =
        "<span style='height:1px;position:absolute;left:" +
        x +
        "px;top:" +
        y +
        "px;width:1px;background:#f00;overflow:hidden'></span>";
      return pointDiv;
    },
    // 画线
    line(x1, y1, x2, y2) {
      var slope; //斜率
      var direction; //坐标运动方向
      var tx = x2 - x1;
      var ty = y2 - y1;
      if (tx == 0 && ty == 0) return;
      var points = "";
      var axis; //坐标轴上的坐标
      if (Math.abs(tx) >= Math.abs(ty)) {
        //在x轴上移动
        direction = tx > 0 ? 1 : -1;
        tx = Math.abs(tx);
        slope = ty / tx;
        axis = x1;
        for (let i = 0; i < tx; i++) {
          points += this.makedot(axis, y1 + i * slope);
          axis += direction;
        }
      } else {
        //在y轴上移动
        direction = ty > 0 ? 1 : -1;
        ty = Math.abs(ty);
        slope = tx / ty;
        axis = y1;
        for (let i = 0; i < ty; i++) {
          points += this.makedot(x1 + i * slope, axis);
          axis += direction;
        }
      }
      var container = document.getElementById("left");
      container.innerHTML += points;
    },
    // 画线和
    drawGraph(row) {
      var row = row;
      let id = row.paragraphId;
      this.drawSpanLabel(row);

      // 获取右边分割线距离
      var rl = $("#list").width(); // 当前外边框的宽度
      // 画新框框 删除右边线 计算第一个标签高度
      // 在文本中创建当前标签对应的文本 span 标签, id值为 标签id
      let classAte = ".tip";
      this.deleteTip(classAte);
      let spanStr = `<span id='lab${this.labelId}'>${this.currentMark.selctText}</span>`;
      let str = $(`#${id}`);
      let paragraphHTML = str[0].innerHTML;
      $(`#${id}`)[0].innerHTML = paragraphHTML.replace(
        this.currentMark.selctText,
        spanStr
      );
      // 获取当前文本 span 标签的位置信息
      this.$nextTick(function() {
        let labSpan = $(`#lab${this.labelId}`);
        let spanLeft = this.getOffsetLeft(labSpan[0]); // 当前标签到#left的左边距
        spanLeft = spanLeft + labSpan.width();
        let spanTop = this.getOffsetTop(labSpan[0]); // 当前标签到#left的上边距
        spanTop = spanTop + labSpan.height();
        let totalLeft = $("#list").width(); // 当前外边框的宽度
        var ll = spanLeft;
        var lt = spanTop;
        var rt = this.minTop;
        if (lt > rt) {
          rt = lt;
        }
        var newPointLine = {};
        var newPointLabel = {};
        var newMarkList = [];
        // 找到新标签位置并且重新写左边
        if (this.markList.length == 0) {
          let pl = [];
          pl.push(ll);
          pl.push(lt);
          pl.push(rl);
          pl.push(lt);
          newPointLine[id] = pl;
          let pm = [];
          pm.push(rl);
          pm.push(lt);
          pm.push(rl + 25);
          pm.push(rt);
          newPointLabel[id] = pm;
          row.top = rt - 10;
          newMarkList.push(row);
        } else {
          var flag = false;
          for (let i = 0; i < this.markList.length; i++) {
            let key = this.markList[i].id;
            if (
              (this.pointLine[key][1] == lt && this.pointLine[key][0] <= ll) ||
              (this.pointLine[key][1] <= lt && this.pointLine[key][0] == ll) ||
              (this.pointLine[key][1] < lt && this.pointLine[key][0] < ll)
            ) {
              let pl = [];
              pl.push(ll);
              pl.push(lt);
              pl.push(rl);
              pl.push(lt);
              newPointLine[id] = pl;
              let pm = [];
              pm.push(rl);
              pm.push(lt);
              pm.push(rl + 25);
              pm.push(rt);
              newPointLabel[id] = pm;
              row.top = rt - 10;
              newMarkList.push(row);
              flag = true;
            }
            newPointLine[key] = this.pointLine[key];
            newPointLabel[key] = this.pointLabel[key];
            newMarkList.push(this.markList[i]);
          }
          if (!flag) {
            let pl = [];
            pl.push(ll);
            pl.push(lt);
            pl.push(rl);
            pl.push(lt);
            newPointLine[id] = pl;
            let pm = [];
            pm.push(rl);
            pm.push(lt);
            pm.push(rl + 25);
            pm.push(rt);
            newPointLabel[id] = pm;
            row.top = rt - 10;
            newMarkList.push(row);
          }
        }
        this.pointLine = newPointLine;
        this.pointLabel = newPointLabel;
        this.markList = newMarkList;
        for (let key in this.pointLine) {
          // 画线
          this.line(
            this.pointLine[key][0],
            this.pointLine[key][1],
            this.pointLine[key][2],
            this.pointLine[key][3]
          );
          this.line(
            this.pointLabel[key][0],
            this.pointLabel[key][1],
            this.pointLabel[key][2],
            this.pointLabel[key][3]
          );
        }

        let that = this;
        $(".text").each(function(index, ele) {
          $(this).on("mouseup", function(event) {
            that.addEvent(that.list[index]);
          });
        });
      });
    },
    // 获取元素到浏览器左侧的距离
    getOffsetLeft(obj) {
      var tmp = obj.offsetLeft;
      var val = obj.offsetParent;
      var left = $("#left")[0];
      while (val != null) {
        if (val != left) {
          tmp += val.offsetTop;
          val = val.offsetParent;
        } else {
          return tmp;
        }
      }
    },
    // 获取元素到浏览器顶部的距离
    getOffsetTop(obj) {
      var tmp = obj.offsetTop;
      var val = obj.offsetParent;
      var top = $("#left")[0];
      while (val != null) {
        if (val != top) {
          tmp += val.offsetTop;
          val = val.offsetParent;
        } else {
          return tmp;
        }
      }
    }
    // *******************************画线暂存代码****************************
  }
};
</script>

<style scoped>
</style>
<style lang="scss" scoped>
#ays {
  .activePop {
    width: 50%;
  }
  .t {
    vertical-align: text-top;
  }
  .lis {
    position: absolute;
    right: 0;
    top: 0;
    width: 220px;
    border: 1px solid #ddd;
    padding: 10px 10px 0;
  }
  .projectDetail {
    width: 100%;
    border-bottom: 1px solid #ccc;
    position: relative;
    overflow: initial;
    .tit {
      display: inline-block;
      color: #2e83d3;
      padding: 6px 0 10px;
      font-size: 17px;
      font-weight: bold;
    }
    .sel {
      float: right;
      display: inline-block;
      margin-left: 10px;
      width: 120px;
    }
    .back {
      float: right;
      border: 1px solid #ccc;
      padding: 5px 15px 4px;
      display: inline-block;
      border-radius: 4px;
      font-size: 12px;
      color: #555;
      cursor: pointer;
      .backBtn {
        vertical-align: bottom;
        color: #444;
      }
    }
  }
  .addColor {
    border: 1px solid #cee8ff !important;
    color: #2e83d3 !important;
    background-color: #cee8ff;
  }
  .shai {
    padding: 20px 0;
    .sel {
      width: 120px;
      display: inline-block;
    }
    .xuan {
      display: inline-block;
      width: 100px;
      border: 1px solid #ccc;
      text-align: center;
      float: right;
      font-size: 12px;
      cursor: pointer;
      border-radius: 4px;
      margin-left: 10px;
      line-height: 26px;
    }
  }
  .item {
    line-height: 30px;
    z-index: 100;
    .wrp {
      padding: 0px 0 30px;
      min-height: 60px;
      .vItem {
        color: #999;
        span {
          font-size: 10px;
        }
      }
    }
    .jiao {
      border-bottom: 1px solid #ccc;
      .vItem {
        color: #999;
        span {
          font-size: 10px;
        }
      }
      .bgc {
        margin: 10px 0;
        cursor: pointer;
        padding: 10px 0;
      }
      .cur {
        background-color: #eee;
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
    .text {
      font-size: 12px;
      color: #444;
    }
  }
  .left {
    padding-right: 20px;
    border-right: 1px solid #eee;
  }
  .right {
    position: relative;
  }
}
</style>
