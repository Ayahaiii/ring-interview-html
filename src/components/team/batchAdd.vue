<template>
  <div id="batchAdd">
    <div class="upload">
      <div>
        <el-upload  class="upload-demo"  action="https://jsonplaceholder.typicode.com/posts/"  :on-change="handleChange"  :file-list="fileList">
          <el-button size="mini" type="primary" class="btn mini"><span class="iconfont">&#xe629;</span>上传文件</el-button>
          <span slot="tip" class="el-upload__tip">支持扩展名：.xlsx  .csv</span>
        </el-upload>
      </div>
      <div class="nav">
        <div class="item"><span>成功上传 {{ successUpload }} 条记录，共找到 {{ all }} 个合格用户<span class="color"> (下载有效名单) </span>， {{ no }} 个用户未找到<span class="color"> (下载无效名单) </span></span></div>
        <div class="item">
          <el-row>
            <el-col :span='4'>{{ no }} 个无效名单包括 ：</el-col>
            <el-col :span='20'>
              <div>[1891881081],  </div>
              <div>[lij@fuda.edu.cn]</div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="addBtn"><el-button type='primary' size='mini' class="mini"><span>确定批量添加</span></el-button></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      breadcrumbList: [
        {
          name: '民营企业家应对新肺疫情深度访谈研究',
          path: '/index'
        }, {
          name: '团队',
          // path: ''
        }
      ],
      successUpload: 12,
      all: 3,
      no: 22,
      fileList: []
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      title: '团队',
      link: '/team',
      backTitle: '团队列表'
    })
  },
  methods: {
    // 返回团队列表
    goteamList () {
      this.$router.push('/team')
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
  }
}
</script>

<style lang="scss" scoped>
  #batchAdd{
    .upload{
      margin: 20px 0 20px 0;
      .nav{
        background-color: #dbeee6;
        padding: 10px 20px;
        .color{
          color: #ed6c11;
        }
        .item{
          line-height: 40px;
          span{
            font-size: 12px;
          }
          div{
            font-size: 12px;
          }
        }
      }
      .addBtn{
        margin-top: 20px;
      }
    }
    .upload-demo{
      margin: 20px 0;
    }
    .el-upload__tip{
      margin-left: 20px;
    }
  }
</style>
