<!-- 布局 -->
<template>
  <div id="layout-wrapper">
    <div v-if="isLogin">
      <cus-header></cus-header>
    </div>
    <div class="main" v-if="isLogin">
      <router-view></router-view>
    </div>
    <div class="login" v-else>
      <router-view></router-view>
    </div>
    <cus-footer v-if="isShowBottom"></cus-footer>
  </div>
  <!-- 嵌套子网站 -->

</template>

<script>
import cusHeader from './common/header'
import cusFooter from './common/footer'

export default {
  data () {
    return {
    }
  },
  computed: {
    isLogin () {
      if (this.$route.path == '/login') {
        return false
      } else if (this.$route.path == '/privacyPolicy') {
        return false
      } else if (this.$route.path == '/index') {
        return false
      } else if (this.$route.path == '/case') {
        return false
      } else if (this.$route.path == '/pricing') {
        return false
      } else if (this.$route.path == '/pay') {
        return false
      } else if (this.$route.path == '/register') {
        return false
      } else if (this.$route.path == '/findPassword') {
        return false
      } else {
        return true
      }
    },
    isShowBottom () {
      if (this.$route.name == 'PrivacyPolicy') {
        return false
      } else if (this.$route.name == 'Index') {
        return false
      } else if (this.$route.name == 'Case') {
        return false
      } else if (this.$route.name == 'Pricing') {
        return false
      } else {
        return true
      }
    }
  },
  components: {
    cusHeader,
    cusFooter
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
