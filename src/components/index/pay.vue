<template>
  <div class="container">
    <index-header></index-header>
    <div class="container-pay">
      <div class="content">
        <el-row>
          <el-col :span="24">
            <ul class="menus">
              <li>
                <span>订单支付</span>
              </li>
            </ul>
          </el-col>
        </el-row>
        <el-row>
          <el-card class="box-card">
            <div slot="header">
              <span style="font-size: 16px">确认订单信息</span>
              <span style="color: #666666">请在两小时之内完成支付，否则订单会被自动取消</span>
            </div>
            <el-row>
              购买账号：{{result.account}}
            </el-row>
            <el-row>
              <span style="font-size: 10px; color: #999999">注意：购买后不支持退款、转让，请确认版本相关权益或有效期后再支付订单</span>
            </el-row>
            <div style="margin-top: 10px; font-weight: bold; margin-bottom: 10px">支付方式</div>
            <el-radio>余额支付</el-radio>
            <span style="font-size: 10px; color: #cf9236">（可用余额：{{result.balance}}元）</span>
            <span v-if="result.balance < result.orderAmount"><span>余额不足，<a href="http://i.ringdata.com/balance">前往充值>></a></span></span>
            <div style="margin-top: 10px; font-weight: bold; margin-bottom: 10px">订单详情</div>
            <el-table
              :cell-style="tableCellStyle"
              :row-style="tableRowStyle"
              :header-cell-style="tableHeaderColor"
              :data="resultData" width="100%">
              <el-table-column prop="orderNo" label="订单编号">
              </el-table-column>
              <el-table-column prop="name" label="商品名称">
              </el-table-column>
              <el-table-column prop="orderAmount" label="订单金额">
              </el-table-column>
              <el-table-column prop="createTime" label="下单时间">
              </el-table-column>
            </el-table>
            <el-row style="margin-top: 10px">
              <el-form label-position="left" label-width="100px" style="width: 200px;">
                <el-form-item label="实付金额：" prop="name">
                  <span style="color: red; font-size: 24px">¥{{result.orderAmount}}</span>
                </el-form-item>
                <!--<el-form-item label="支付密码：" prop="name">-->
                  <!--<el-input type="password" style="width: 200px"></el-input>-->
                <!--</el-form-item>-->
              </el-form>
              <el-button type="primary" size="medium" @click="payOrder()">确认支付</el-button>
              <span style="color: #777">&nbsp;&nbsp;注：支付订单则表示同意《锐研用户付费协议》</span>
            </el-row>
          </el-card>
        </el-row>
      </div>
    </div>

    <!-- <index-footer></index-footer> -->
  </div>
</template>

<script>
  import indexHeader from '../common/indexHeader'
  export default {
    components: {
      indexHeader,
      // indexFooter
    },
    data() {
      return {
        loading: false,
        orderId:'',
        result:{},
        resultData: []
      }
    },
    mounted(){
      this.orderId = this.$route.query.id;
      this.getOrderInfo();
    },
    methods: {

      /*获取订单信息*/
      getOrderInfo() {
        this.httpGet('/order/get/' + this.orderId).then((result) => {
          if (result.code == 0) {
            this.resultData = result.data;
            this.result = this.resultData[0];
          }
        })
      },

      /*支付订单*/
      payOrder() {
        this.loading = true;
        if (this.result.balance < this.result.orderAmount) {
          this.$message({
            type: 'info',
            message: '余额不足，请先充值!'
          });
          this.loading = false;
          return;
        }
        this.httpGet('/order/execute/' + this.orderId).then((result) => {
          if (result.code == 0) {
            this.$message({
              type: 'success',
              message: '支付成功!'
            });
            let userInfo = this.$cookies.get("userInfo");
            this.httpPost("/login/v1/userInfo/permission", null).then(res => {
              if (res && res.code === 0) {
                userInfo.nlpPermission = res.data;
                this.$cookies.set("userInfo", JSON.stringify(userInfo));
                this.$router.push("/project");
              }
            });
          }
          this.loading = false;
        }).catch((error) => {
          this.loading = false;
        })
      },

      /*修改table tr行的背景色*/
      tableRowStyle({ row, rowIndex }) {
        return 'text-align: center;'
      },

      /*修改table tr行的背景色*/
      tableCellStyle({ row, rowIndex }) {
        return 'text-align: center; height: 30px;padding: 8px;'
      },

      /*修改table header的背景色*/
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #f5f7f9; font-weight: bold; text-align: center;'
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  .container-pay {
    width: 100%;
    margin-top: 70px;
    border-top: 1px solid #ddd;
    .content{
      width: 1200px;
      margin: 0px auto 0;
      .tool-bar{
        margin: 20px 0px;
        color: #E94743;
        i,span{
          cursor: pointer;
        }
      }
      .box-card{
        min-height: 500px;
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }
    li{
      float: left;
      list-style: none;
    }
    ul{
      margin-top: 20px;
      margin-bottom: 50px;
    }
    .add{
      margin-top: 10px;
    }
  }
</style>
