<template>
  <div id="interview">
    <!-- 侧边栏 -->
    <div>
      <el-row>
        <el-col :span='2'>
          <div class="aside">
            <ul>
              <router-link to="/project/detail"><li class="child" v-bind:class="{current: active == 1}" @click="changeAsideItem(1)"><span class="icon"><i class="iconfont">&#xe653;</i></span><span class="txt">项目详情</span></li></router-link>
              <router-link to='/target'><li class="child" v-bind:class="{current: active == 2}" @click="changeAsideItem(2)"><span class="icon"><i class="iconfont">&#xe865;</i></span><span class="txt">访谈对象</span></li></router-link>
              <router-link to='/team'><li class="child" v-bind:class="{current: active == 3}" @click="changeAsideItem(3)"><span class="icon"><i class="iconfont">&#xe62e;</i></span><span class="txt">团队</span></li></router-link>
              <router-link to='/interviewees'><li class="child" v-bind:class="{current: active == 4}" @click="changeAsideItem(4)"><span class="icon"><i class="iconfont">&#xe60f;</i></span><span class="txt">访谈</span></li></router-link>
              <router-link to=''><li class="child" v-bind:class="{current: active == 5}" @click="changeAsideItem(5)"><span class="icon"><i class="iconfont">&#xe652;</i></span><span class="txt">质性分析</span></li></router-link>
              <router-link to=''><li class="child" v-bind:class="{current: active == 6}" @click="changeAsideItem(6)"><span class="icon"><i class="iconfont">&#xe834;</i></span><span class="txt">监控报表</span></li></router-link>
            </ul>
          </div>
        </el-col>
        <el-col :span='22' class="main-right">
          <div class="brand">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/index' }"><span class="iconfont">&#xe605;</span>我的访谈</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" :to="item.path">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="projectDetail"><span class="tit">{{title}}</span><span v-if="link" class="back" @click="goteamList()">返回{{ backTitle }}</span></div>
          <div class="nav">
            <router-view @getChild="getChild" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 1,
      breadcrumbList: [],
      title: '',
      link: null,
      backTitle: ''
    }
  },

  created () {
    if (this.$route.path.indexOf('/project') != -1) {
      this.active = 1
    } else if (this.$route.path.indexOf('/target') != -1) {
      this.active = 2
    } else if (this.$route.path.indexOf('/team') != -1) {
      this.active = 3
    } else if (this.$route.path.indexOf('/interviewees') != -1) {
      this.active = 4
    }
  },

  watch: {
    $route: {
      handler: function(val, oldVal){
        if (val.path.indexOf('/project') != -1) {
          this.active = 1
        } else if (val.path.indexOf('/target') != -1) {
          this.active = 2
        } else if (val.path.indexOf('/team') != -1) {
          this.active = 3
        } else if (val.path.indexOf('/interviewees') != -1) {
          this.active = 4
        }
      },
      // 深度观察监听
      deep: true
    }
  },

  methods: {
    changeAsideItem (cur) {
      this.active = cur
    },
    goteamList () {
      this.$router.push(this.link)
    },
    getChild (params) {
      this.breadcrumbList  = params.breadcrumbList
      this.title = params.title
      this.backTitle = params.backTitle
      if (params.link) {
        this.link = params.link
      } else {
        this.link = null
      }
    }
  }
}
</script>

<style scoped>

</style>
<style lang="scss" scoped>
  #interview{
    width: 1200px;
    margin: 0 auto;
    .aside{
      width: 100%;
      padding: 20px 0;
      box-sizing: border-box;
      overflow: hidden;
      .child{
        cursor: pointer;
        float: left;
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
        span{
          display: inline-block;
        }
        .icon{
          width: 55px;
          height: 55px;
          background-color: #eee;
          border-radius: 3px;
          line-height: 55px;
          margin-bottom: 3px;
          i{
            font-size: 35px;
            color: #666;
          }
        }
        .txt{
          width: 100%;
          color: #555;
          text-align: center;
        }
      }
    }
    .current{
      .icon{
        background-color: #5873b4 !important;
        i{
          color: #fff !important;
        }
      }
      .txt{
        color: #5873b4 !important;
      }
    }
    .nav{
      padding: 20px 0;
    }
    .main-right {
      min-height: 100vh;
      border-left: 1px solid #ccc;
      padding: 0 20px;
    }
    .projectDetail{
      width: 100%;
      padding: 10px 0 10px;
      border-bottom: 1.5px solid #ccc;
      .tit{
        color: #5873b4;
        font-size: 17px;
        font-weight: bold;
      }
      .back{
        float: right;
        border: 1px solid #ccc;
        padding: 3px 15px 4px;
        display: inline-block;
        background-color: #eee;
        font-size: 13px;
        cursor: pointer;
      }
    }
  }
</style>
