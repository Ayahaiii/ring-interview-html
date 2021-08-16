<!-- index.vue -->
<template>
  <div class="container">
    <index-header></index-header>
    <section class="top">
      <div class="slogan-box">
        <h1 class="slogan">质性访谈研究云平台</h1>
        <p class="desc">全面<span class="cor">支持个案访谈，焦点小组访谈；</span>支持访谈研究全过程管理</p>
        <p class="desc"><span class="cor">AI自动录音转文字，</span>轻松实现在线逐字稿整理</p>
        <p class="desc">集成质性分析工具，支持<span class="cor">基于扎根理论的多人协作编码和自动编码</span></p>
        <p class="desc">支持词频统计分析和编码知识图谱</p>
      </div>
    </section>
    <section class="middle">
      <div class="function-box have-color">
        <el-row class="middle-content" :gutter="30">
          <el-col class="function-grid" :span="6" :xs="12">
            <div @click="goAnchor('#questionnaire1')" class="bg-circle">
              <img src="../../assets/img/questionnaire-design.png" alt="#">
            </div>
            <h4 class="function-name">访谈管理</h4>
            <p class="function-desc">访谈研究生命周期管理</p>
          </el-col>
          <el-col class="function-grid" :span="6" :xs="12">
            <div class="bg-circle" @click="goAnchor('#questionnaire2')">
              <img src="../../assets/img/response-collect.png" alt="#">
            </div>
            <h4 class="function-name">资料整理</h4>
            <p class="function-desc">人工智能录音转文字</p>
          </el-col>
          <el-col class="function-grid" :span="6" :xs="12">
            <div @click="goAnchor('#questionnaire3')" class="bg-circle">
              <img src="../../assets/img/quality-watching.png" alt="#">
            </div>
            <h4 class="function-name">质性分析</h4>
            <p class="function-desc">基于扎根理论的多人协作编码</p>
          </el-col>
          <el-col class="function-grid" :span="6" :xs="12">
            <div @click="goAnchor('#questionnaire4')" class="bg-circle">
              <img src="../../assets/img/statistics-analysis.png" alt="#">
            </div>
            <h4 class="function-name">团队协作</h4>
            <p class="function-desc">多角色团队协作和授权管理</p>
          </el-col>
        </el-row>
      </div>
      <div class="project-box">
        <el-row class="middle-content" :gutter="30" id='questionnaire1'>
          <el-col class="img-box" :span="12" :xs="24">
            <img src="../../assets/img/module-phone.png" alt="#" width="430px">
          </el-col>
          <el-col :span="12" :xs="24">
            <h4 class="content-title">访谈管理：访谈研究全生命周期管理</h4>
            <ul class="content-item">
              <li>支持访谈的全生命周期管理，包括访谈计划、访谈执行、资料整理、资料审核和资料分析；</li>
              <li>支持访谈样本信息的统一管理，支持联系人、联系地址和接触记录的管理；</li>
              <li>支持空号过滤、支持号码抽样、支持智能拨号动态分配；</li>
              <li>支持访谈样本的分派管理；</li>
              <li>支持访谈项目可视化报表，包括项目统计汇总、访谈进度、访谈地图、项目甘特图、访员绩效等报表；</li>
            </ul>
          </el-col>
        </el-row>
        <el-row class="middle-content xs-reverse" :gutter="30" id="questionnaire2">
          <el-col :span="12" :xs="24"></el-col><el-col :span="12" :xs="24">
            <h4 class="content-title">资料整理：人工智能录音转文字</h4>
            <ul class="content-item">
              <li>支持AI自动录音转文字，轻松实现在线逐字稿整理；</li>
              <li>支持访谈录音管理；</li>
              <li>支持访谈对话文本管理，支持对话文本的录入、校对、审核、导入和导出；</li>
              <li>支持访谈多媒体附件的管理；</li>
            </ul>
          </el-col>
          <el-col class="img-box" :span="12" :xs="24" style="text-align: right">
            <img src="../../assets/img/module-interview.png" alt="#" width="430px">
          </el-col>
        </el-row>
      </div>
      <div class="project-box have-color">
        <el-row class="middle-content" :gutter="30" id="questionnaire3">
          <el-col class="img-box" :span="12" :xs="24">
            <img src="../../assets/img/module-data.png" alt="#" width="430px">
          </el-col>
          <el-col :span="12" :xs="24"></el-col><el-col :span="12" :xs="24">
            <h4 class="content-title">质性分析：基于扎根理论的多人协作编码</h4>
            <ul class="content-item">
              <li>支持基于扎根理论的多人协作人工编码；</li>
              <li>支持机器自动编码；</li>
              <li>支持词频统计和词云图展现；</li>
              <li>支持编码知识图谱，可展示访谈对象的编码共现网络；</li>
            </ul>
          </el-col>
        </el-row>
        <el-row class="middle-content xs-reverse" :gutter="30" id="questionnaire4">
          <el-col :span="12" :xs="24"></el-col><el-col :span="12" :xs="24">
            <h4 class="content-title">团队协作：多角色团队协作和授权管理</h4>
            <ul class="content-item">
              <li>支持对访谈项目团队的管理；</li>
              <li>支持邀请用户参与访谈项目；</li>
              <li>支持访问员、督导员、分析员和管理员四种角色；</li>
              <li>支持对团队成员的数据访问权限管理和使用期限授权；</li>
            </ul>
          </el-col>
          <el-col class="img-box" :span="12" :xs="24" style="text-align: right">
            <img src="../../assets/img/img-website.png" alt="#" width="430px">
          </el-col>
        </el-row>
      </div>
      <div class="function-box" style="padding: 0;">
        <h1 class="title">客户类型</h1>
        <el-row class="middle-content" :gutter="30">
          <el-col class="client-grid" :span="6" :xs="12">
            <img class="img-icon" src="../../assets/img/client-enterprise.png" alt="#">
            <div class="client-type">企业客户</div>
            <ul class="client-list">
              <li>零售、快消、金融、医药、汽车调查</li>
              <li>品牌监测</li>
              <li>客户忠诚度调查</li>
              <li>客户满意度调查</li>
              <li>新产品可行性调查</li>
            </ul>
          </el-col>
          <el-col class="client-grid" :span="6" :xs="12">
            <img class="img-icon" src="../../assets/img/client-investigate.png" alt="#">
            <div class="client-type">市场研究机构</div>
            <ul class="client-list">
              <li>市场调查与分析</li>
              <li>产品研究</li>
              <li>用户行为研究</li>
              <li>行业研究</li>
              <li>决策咨询</li>
            </ul>
          </el-col>
          <el-col class="client-grid" :span="6" :xs="12">
            <img class="img-icon" src="../../assets/img/client-education.png" alt="#">
            <div class="client-type">科研教育机构</div>
            <ul class="client-list" style="padding-left: 70px;">
              <li>学术科研调查</li>
              <li>课题调查</li>
              <li>新闻调查</li>
              <li>心理调查</li>
              <li>社会调查</li>
            </ul>
          </el-col>
          <el-col class="client-grid" :span="6" :xs="12">
            <img class="img-icon" src="../../assets/img/client-government.png" alt="#">
            <div class="client-type">政府机关</div>
            <ul class="client-list" style="padding-left: 70px;">
              <li>社情民意调查</li>
              <li>企业经济调查</li>
              <li>家庭跟踪调查</li>
              <li>流动人口调查</li>
              <li>公共卫生调查</li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <div class="function-box" style="padding-top: 0;">
        <h1 class="title">他们正在使用锐研</h1>
        <div class="middle-row">
          <div class="logos-wrapper hidden-xs-only">
            <img src="../../assets/img/clients.png" alt="#">
          </div>
          <el-row class="hidden-sm-and-up">
            <el-col class="logos-wrapper" :span="8">
              <img src="../../assets/img/client1.png" alt="#">
            </el-col>
            <el-col class="logos-wrapper" :span="8">
              <img src="../../assets/img/client2.png" alt="#">
            </el-col>
            <el-col class="logos-wrapper" :span="8">
              <img src="../../assets/img/client3.png" alt="#">
            </el-col>
            <el-col class="logos-wrapper" :span="8">
              <img src="../../assets/img/client4.png" alt="#">
            </el-col>
            <el-col class="logos-wrapper" :span="8">
              <img src="../../assets/img/client5.png" alt="#">
            </el-col>
            <el-col class="logos-wrapper" :span="8">
              <img src="../../assets/img/client6.png" alt="#">
            </el-col>
            <el-col class="logos-wrapper" :span="8">
              <img src="../../assets/img/client7.png" alt="#">
            </el-col>
            <el-col class="logos-wrapper" :span="8">
              <img src="../../assets/img/client8.png" alt="#">
            </el-col>
            <el-col class="logos-wrapper" :span="8">
              <img src="../../assets/img/client9.png" alt="#">
            </el-col>
          </el-row>
        </div>
        <!-- <div class="section-bottom">
          <router-link to="/case">案例<i class="iconfont">&#xe61b;</i></router-link>
        </div> -->
      </div>
    </section>
    <index-footer></index-footer>
  </div>
</template>

<script>
import indexHeader from '../common/indexHeader'
import indexFooter from '../common/indexFooter'

export default {
  data () {
    return {
    }
  },
  components: {
    indexHeader,
    indexFooter
  },
  mounted() {
    this.addViewTimes()
  },
  methods: {
    goAnchor (selector) {
      window.location.hash = '';  //防止刷新时，又回到锚点处
      window.scrollTo(0, 100);
      this.$el.querySelector(selector).scrollIntoView({
        behavior: 'smooth'
      })
    },

    // 增加访问次数
    addViewTimes() {
      let key = "VIEW_SURVEY";
      this.httpPostIsAnonymous("/show/update/view/" + key,null).then(res => {
        if (res && res.code === 0) {
        }
      });
    }
  }
}
</script>

<style lang='scss' scoped>
.container {
  width: 100%;
}
.cor{
  color: #DA6A7D;
}
.top {
  margin-top: 70px;
  background: url('../../assets/img/bg-tree.png');
  background-size: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: 750px;
  color: #ffffff;
  .slogan-box {
    padding: 120px 20px;
    text-align: center;
    .slogan {
      color: #2e83d3;
      font-size: 46px;
      font-weight: 500;
      margin-bottom: 30px;
      letter-spacing: 20px;
    }
    .slogan-en {
      font-size: 25px;
      margin-top: 20px;
      font-weight: 300;
      margin-bottom: 40px;
    }
    .desc {
      color: #444;
      font-size: 16px;
      letter-spacing: 2px;
      font-weight: 400;
      line-height: 36px;
      // text-shadow: 0 1px 2px rgba(0,0,0,.12);
      span{
        font-size: 15px;
      }
    }
  }
}
.middle {
  .have-color {
    background: #f7f8fd;
  }
  .function-box {
    padding-bottom: 30px;
  }
  .middle-content {
    max-width: 1120px;
    margin: 0 auto !important;
    padding-top: 30px;
    .bg-circle {
      background: #d2d3d7;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover {
        background: #2e83d3;
      }
    }
    .function-name {
      text-align: center;
      font-size: 18px;
      font-weight: 300;
      margin: 30px 0 25px;
    }
    .function-desc {
      color: #777777;
      line-height: 28px;
      text-align: center;
    }
  }
  .project-box {
    padding-bottom: 50px;
    .middle-content {
      padding: 50px 0 0;
      .img-box {
        text-align: left;
        img {
          max-width: 90%;
          border: 1px solid #ddd;
        }
      }
    }
    .content-title {
      font-size: 25px;
      font-weight: 300;
      color: #495766;
      margin: 20px 0 30px;
    }
    .content-item {
      color: #666666;
      padding-left: 20px;
      li {
        list-style: disc;
        margin: 10px 0;
        line-height: 26px;
      }
    }
  }
  .title {
    font-size: 28px;
    color: #495766;
    margin: 20px 0 30px;
    font-weight: 300;
    text-align: center;
  }
  .client-grid {
    text-align: center;
    min-height: 380px;
    .img-icon {
      width: 70px;
      height: 70px;
    }
    .client-type {
      font-size: 18px;
      font-weight: 300;
      margin: 25px 0 15px;
    }
    .client-list {
      text-align: left;
      padding-left: 20px;
      color: #666666;
      li {
        margin: 10px 0;
        list-style: disc;
        line-height: 26px;
      }
    }
  }
  .logos-wrapper {
    text-align: center;
  }
  .section-bottom {
    margin-top: 30px;
    text-align: center;
    a {
      color: #f27800;
    }
  }
}
</style>
