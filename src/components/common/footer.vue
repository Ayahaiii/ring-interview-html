<!-- 公共底部 -->
<template>
  <div id="footer-wrapper">
    <ul>
      <li>
        <a href="http://www.monetware.com/page/introduction.html" target="_blank">关于我们</a>
      </li>
      <li>
        <router-link to="/privacyPolicy?key=2">服务协议</router-link>
      </li>
      <li style='margin-right: 0;'>
        <router-link to="/privacyPolicy?key=3">隐私政策</router-link>
      </li>
    </ul>
    <div class="copyright rsp-xs-fs14">
        Copyright © 2019 上海萌泰数据科技股份有限公司
        <a href="http://beian.miit.gov.cn" target="_blank" style="font-size: 12px;">&ensp;&ensp;沪ICP备09099644号</a >
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

