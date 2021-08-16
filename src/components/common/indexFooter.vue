<template>
  <div class="footer">
    <div class="footer-top">
      <a href="mailto:marketing@monetware.com" target="_blank">
        <i class="iconfont">&#xe6b0;</i>
      </a>
      <a href="https://weibo.com/ringdata" target="_blank">
        <i class="iconfont">&#xe61d;</i>
      </a>
      <a href="javascript:alert('欢迎关注“锐研中国”微信公众号！')" target="_blank">
        <i class="iconfont">&#xe61c;</i>
      </a>
    </div>
    <div class="footer-middle">
      锐研•云访谈 提供最专业的云访谈解决方案
    </div>
    <div class="footer-bottom">
      <a href="http://www.monetware.com" target="_blank" title="数据研究技术服务商">上海萌泰数据科技股份有限公司</a>
      2020 ©版权所有.
      <a href="http://www.miitbeian.gov.cn" target="_blank">沪ICP备09099644号</a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  padding: 55px 20px;
  text-align: center;
  background: #eeeeee;
  .footer-top {
    a {
      display: inline-block;
      width: 45px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      border-radius: 50%;
      background: #bdbdbd;
      font-size: 20px;
      color: #ffffff;
      margin-right: 20px;
    }
    i {
      font-size: 22px !important;
    }
  }
  .footer-middle {
    color: #a0a0a0;
    padding: 15px 0;
    font-size: 12px;
  }
  .footer-bottom {
    color: #a0a0a0;
    font-size: 12px;
    line-height: 26px;
    a {
      color: #337ab7;
      text-decoration: none;
      font-size: 12px;
    }
  }
}
</style>
