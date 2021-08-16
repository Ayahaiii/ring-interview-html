<template>
  <div id="createInterview">
    <!-- 项目列表 -->
    <el-row>
      <el-form :hide-required-asterisk='true' size='mini' label-position="left" :model="searchForm" :rules="rules" ref="searchForm" label-width="90px" class="demo-ruleForm">
        <el-col :span='24'>
          <el-form-item label="访谈对象 :" prop="name">
            <el-autocomplete  class="inline-input"  v-model="searchForm.name"  :fetch-suggestions="querySearch"  placeholder="请输入内容"  @select="handleSelect"></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="负责人 :">
            <span class="txt">{{ searchForm.responsible }}</span>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="协作者 :">
            <span class="txt">{{ searchForm.cooperation }}</span>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="计划时间 :" prop="planTime">
            <el-date-picker v-model="searchForm.planTime" type="date" placeholder="选择计划时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="访谈地点 :" prop="address">
            <el-input v-model="searchForm.address" placeholder="请输入访谈地点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="访谈计划 :" prop="plan">
            <div>
              <EditorBar v-model="searchForm.plan" @change='change' :isClear="isClear" :url="url"></EditorBar>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="备注 :" prop="remarks">
            <el-input v-model="searchForm.remarks" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" type='textarea'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item>
            <el-button type="primary" style="width: 150px" @click="save('searchForm')" class="mini"><span>保存</span></el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import EditorBar from './wangEditor'
export default {
  components: { EditorBar },
  data () {
    return {
      breadcrumbList: [
        {
          name: '民营企业家应对新肺疫情深度访谈研究',
          path: '/index'
        }, {
          name: '访谈',
          // path: ''
        }
      ],
      restaurants: [],
      searchForm: {
        name: '',
        responsible: '张三',
        cooperation: '李四、王五',
        planTime: '',
        address: '',
        plan: '',
        remarks: '',
      },
      rules: {
        name: [{ required: true, message: '请输入访谈对象', trigger: 'blur' }],
        address: [{ required: true, message: '请输入访谈地址', trigger: 'blur' }],
        planTime: [{ type: 'date', required: true, message: '请选择计划时间', trigger: 'change' }],
        remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        plan: [{ required: true, message: '请输入备注', trigger: 'blur' }],
      },
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      title: '访谈',
      backTitle: '',
      link: '/interviewees',
      backTitle: '访谈列表'
    })
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          return false;
        }
      });
    },
    // childValue就是子组件传过来的值
    change: function (childValue) {
      this.emailContent = childValue
    },

    // childValue就是子组件传过来的值
    changeE: function (childValue) {
      this.EContent = childValue
    },

    // 回显
    getDetail (id) {
      let params = {
        id: id
      }
      this.httpPost('/news/detail', params).then(res => {
        if (res.code == 0) {
          this.newTitle = res.data.title
          this.EnewTitle = res.data.titleEnglish
          this.newAbstract = res.data.newsAbstract
          this.EnewAbstract = res.data.newsAbstractEnglish
          this.emailContent = res.data.content
          this.EContent = res.data.contentEnglish
          this.dateValue = res.data.newsDate
          this.sortNum = res.data.sort
        }
      })
    },
    // 搜索成员
    querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [
          { "value": "三全鲜食（北新泾店）" },
          { "value": "(小杨生煎)西郊百联餐厅"},
          { "value": "阳阳麻辣烫"},
          { "value": "南拳妈妈龙虾盖浇饭"}
        ];
      },
      handleSelect(item) {
        console.log(item);
      }
    }
}
</script>

<style scoped>
 #createInterview>>>.el-form-item--mini .el-form-item__label {
    line-height: 28px;
    font-size: 12px;
  }
</style>
<style lang="scss" scoped>
  #createInterview{
    width: 80%;
    .txt{
      font-size: 12px;
    }
  }
</style>
