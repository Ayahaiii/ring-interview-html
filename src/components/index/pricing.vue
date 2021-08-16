<template>
  <div class="container pricing">
    <index-header></index-header>
    <section class="section-pricing">
      <div class="section-header">
        <h1 class="title">按需付费，一切为您！</h1>
        <p class="desc">锐研根据客户需求，提供灵活可定制的云访谈平台建设服务。</p>
      </div>
      <!-- 更多套餐start-->
      <div v-if="isToMore">
        <div>
          <div @click="toBack"
               style="color: #f2832a; float: right;margin-bottom:24px; cursor: pointer"><i class="el-icon-back"
               style="margin-right: 12px;"></i>返回</div>
        </div>
        <table class="more">
          <tr class="th"
              style="line-height: 28px;">
            <td colspan="4">套餐定价</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td style="color: #000; font-size: 20px; font-weight:300; line-height: 48px;">标准版</td>
            <td style="color: #000; font-size: 20px; font-weight:300; line-height: 48px;">高级版</td>
          </tr>
          <tr>
            <td>统计调查套餐</td>
            <td>云调查+云统计</td>
            <td>￥2380
              <span style="font-size:14px; color: #000">/年</span>
              <div><span class="original">原价：<span style="text-decoration:line-through;">￥2960/年</span></span></div>
            </td>
            <td>￥3980
              <span style="font-size:14px; color: #000">/年</span>
              <div><span class="original">原价：<span style="text-decoration:line-through;">￥4960/年</span></span></div>
            </td>
          </tr>
          <tr>
            <td>小数据研究套餐</td>
            <td>云调查+云访谈</td>
            <td>￥3180
              <span style="font-size:14px; color: #000">/年</span>
              <div><span class="original">原价：<span style="text-decoration:line-through;">￥3960/年</span></span></div>
            </td>
            <td>￥4780
              <span style="font-size:14px; color: #000">/年</span>
              <div><span class="original">原价：<span style="text-decoration:line-through;">￥5960/年</span></span></div>
            </td>
          </tr>
          <tr>
            <td>大数据研究套餐</td>
            <td>云采集+云文析</td>
            <td>￥3180
              <span style="font-size:14px; color: #000">/年</span>
              <div><span class="original">原价：<span style="text-decoration:line-through;">￥3960/年</span></span></div>
            </td>
            <td>￥4780
              <span style="font-size:14px; color: #000">/年</span>
              <div><span class="original">原价：<span style="text-decoration:line-through;">￥5960/年</span></span></div>
            </td>
          </tr>
          <tr>
            <td>数据分析套餐</td>
            <td>云统计+云文析</td>
            <td>￥2380
              <span style="font-size:14px; color: #000">/年</span>
              <div><span class="original">原价：<span style="text-decoration:line-through;">￥2960/年</span></span></div>
            </td>
            <td>￥3980
              <span style="font-size:14px; color: #000">/年</span>
              <div><span class="original">原价：<span style="text-decoration:line-through;">￥4960/年</span></span></div>
            </td>
          </tr>
          <tr>
            <td>社会科学研究工具套餐</td>
            <td>云调查+云统计+云采集+云文析+云访谈</td>
            <td>￥5880
              <span style="font-size:14px; color: #000">/年</span>
              <div><span class="original">原价：<span style="text-decoration:line-through;">￥8900/年</span></span></div>
            </td>
            <td>￥8880
              <span style="font-size:14px; color: #000">/年</span>
              <div><span class="original">原价：<span style="text-decoration:line-through;">￥13900/年</span></span></div>
            </td>
          </tr>
        </table>
      </div>
      <!-- 更多套餐end -->
      <!-- 版本价格表start -->
      <table v-if="!isToMore"
             class="version">
        <tr class="th"
            style="line-height: 28px;">
          <td>版本<br>定价</td>
          <td>体验版<br><span style="color:#5eaf10;font-size: 20px">免费</span></td>
          <td>标准版<br><span class="text">￥1980</span><span style="font-size:14px;">/年</span></td>
          <td>高级版<br><span class="text">￥2980</span><span style="font-size:14px;">/年</span></td>
          <td>定制版版<br><span style="color:#f2832a;font-size: 20px">按需定制</span></td>
        </tr>
        <tr style="background-color: #e5e5e5">
          <td colspan="6">各版本功能区别</td>
        </tr>
        <tr>
          <td>个案访谈</td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
        </tr>
        <tr>
          <td>焦点小组访谈</td>
          <td></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
        </tr>
        <tr>
          <td>数据存储时间</td>
          <td>一年</td>
          <td>有效期内永久</td>
          <td>有效期内永久</td>
          <td>永久</td>
        </tr>
        <tr>
          <td>存储空间</td>
          <td>1G</td>
          <td>30G</td>
          <td>100G</td>
          <td>不限</td>
        </tr>
        <tr>
          <td>免费AI语音转录时长</td>
          <td>1小时</td>
          <td>30小时</td>
          <td>100小时</td>
          <td>按需收费</td>
        </tr>
        <tr>
          <td>录音与附件管理</td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
        </tr>
        <tr>
          <td>文件上传大小</td>
          <td>不超过100M</td>
          <td>不超过500M</td>
          <td>不超过1G</td>
          <td>不限</td>
        </tr>
        <tr>
          <td>对话文本Word导入</td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
        </tr>
        <tr>
          <td>团队成员数量</td>
          <td></td>
          <td>10人/项目</td>
          <td>20人/项目</td>
          <td>不限</td>
        </tr>
        <tr>
          <td>质性分析</td>
          <td></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
        </tr>
        <tr>
          <td>多人协作分析</td>
          <td></td>
          <td></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
        </tr>
        <tr>
          <td>协作访问员</td>
          <td></td>
          <td></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
        </tr>
        <tr>
          <td>样本扩展信息</td>
          <td></td>
          <td></td>
          <td><i class="el-icon-success"></i></td>
          <td><i class="el-icon-success"></i></td>
        </tr>
        <tr>
          <td>私有云部署</td>
          <td></td>
          <td></td>
          <td></td>
          <td><i class="el-icon-success"></i></td>
        </tr>
        <tr class="end">
          <td></td>
          <td>
            <el-button style="border-color: #f27800;color:#f27800"
                       @click="onRegister"
                       round>立即体验</el-button>
          </td>
          <td>
            <el-button style="border-color: #f27800;color:#f27800"
                       @click="onCreateOrder(2,1980)"
                       round>立即使用</el-button>
          </td>
          <td>
            <el-button style="border-color: #f27800;color:#f27800"
                       @click="onCreateOrder(3,5980)"
                       round>立即使用</el-button>
          </td>
          <td>
            <el-button style="border-color: #f27800;color:#f27800"
                       round>立即咨询</el-button>
          </td>
        </tr>
      </table>
      <!-- 版本价格表end -->

      <!-- 套餐定价start -->
      <div class="price"
           v-if="!isToMore">
        <div class="title">套餐定价</div>
        <div class="content">
          <el-row :gutter="24">
            <el-col :span="5">
              <div>统计调查套餐</div>
              <div>小数据套餐</div>
            </el-col>
            <el-col :span="9">
              <div>云调查+云统计</div>
              <div>云调查+云访谈</div>
            </el-col>
            <el-col :span="7">
              <div><span class="yuan">￥3980</span>/年<span class="original">原价：<span style="text-decoration:line-through;">￥4960/年</span></span></div>
              <div><span class="yuan">￥4780</span>/年<span class="original">原价：<span style="text-decoration:line-through;">￥5960/年</span></span></div>
            </el-col>
            <el-col :span="2">
              <el-button type="warning"
                         class="btn"
                         @click="toMore">更多套餐</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 套餐定价end -->
    </section>
    <index-footer></index-footer>
  </div>
</template>

<script>
import indexHeader from '../common/indexHeader'
import indexFooter from '../common/indexFooter'

export default {
  data() {
    return {
      isToMore: false, //更多套餐
    }
  },
  components: {
    indexHeader,
    indexFooter,
  },
  methods: {
    /**
     * 更多套餐
     */
    toMore() {
      this.isToMore = true
    },
    /**
     * 返回
     */
    toBack() {
      this.isToMore = false
    },
    /*点击立即体验事件*/
    onRegister() {
      this.$router.push({
        path: '/register',
      })
    },

    /*点击立即购买事件*/
    onCreateOrder(type, money) {
      if (this.$cookies.isKey('tokenWeb')) {
        this.httpPost('/order/create', {
          orderAmount: money,
          type: type,
        }).then((result) => {
          if (result.code == 0) {
            // 跳转支付页面
            this.$router.push({
              path: '/pay',
              query: {
                id: result.data,
              },
            })
          }
        })
      } else {
        this.$message.info('您还未登录，请登录后购买使用')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
}
.section-pricing {
  padding: 50px 20px 10px;
  max-width: 1120px;
  margin: 70px auto 0;
}
.section-header {
  margin-bottom: 60px;
  .title {
    text-align: center;
    color: #000000;
    font-size: 34px;
    font-weight: 300;
    margin-bottom: 30px;
  }
  .desc {
    text-align: center;
    color: grey;
    font-size: 16px;
    font-weight: 300;
  }
}
// 版本价格表格start
$base-color: #f2832a;
.version {
  width: 1080px;
  height: 300px;
  text-align: center;
  line-height: 40px;
  border: 1px solid #cbcbcb;
  border-collapse: collapse; /* 合并单元格 */
  .th {
    text-align: center !important;
  }
  .th td {
    padding: 18px 0px;
    background: #fff !important;
    font-size: 20px;
    font-weight: 300;
    color: #000;
    .text {
      color: #f2832a;
      font-size: 20px;
    }
  }
  .end td {
    padding: 12px 0px;
    background: #fff !important;
  }
  tr td:nth-child(3),
  tr td:nth-child(5) {
    background: #f3f3f3;
  }
  //   tr td:nth-child(1){
  //       text-align: left;
  //       padding-left: 12px;
  //   }
  td button:hover {
    background-color: hsl(27, 89%, 82%);
  }
}

.more {
  width: 1080px;
  height: 300px;
  text-align: center;
  border: 1px solid #cbcbcb;
  border-collapse: collapse; /* 合并单元格 */
  margin-bottom: 32px;
  .th {
    text-align: center !important;
    td {
      padding: 18px 0px;
      background: #fff !important;
      font-size: 20px !important;
      font-weight: 300;
      color: #000;
    }
  }
  tr td:nth-child(1) {
    font-size: 16px;
    font-weight: 400;
  }
  tr td:nth-child(3),
  tr td:nth-child(4) {
    font-size: 18px;
    color: $base-color;
    padding: 4px 12px;
  }
  td {
    height: 60px;
    border: 1px solid #cbcbcb;
  }
  .original {
    padding-left: 8px;
    line-height: 28px !important;
    font-size: 14px;
    color: #b3b1b1;
  }
}
td {
  border: 1px solid #cbcbcb;
}
.el-icon-success {
  color: $base-color;
  font-size: 18px;
}
// 版本价格表格end
// 套餐价格start
.price {
  margin-top: 32px;
  margin-bottom: 32px;
  .title {
    margin-bottom: 12px;
  }
  .title,
  .yuan {
    font-size: 18px;
    color: $base-color;
  }
  .btn {
    margin-top: 24px;
    background: #f2832a;
  }
  .btn:hover {
    background: #f89543;
  }
  .content {
    padding-top: 12px;
    height: 100px;
    line-height: 40px;
    padding-left: 24px;
    border: solid 1px #b5b5b5;
  }
  .original {
    padding-left: 24px;
    font-size: 12px;
    color: #dfdfdf;
  }
}
//套餐定价end
</style>
