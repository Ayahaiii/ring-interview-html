<!-- s属性管理 -->
<template>
  <div id="propertyAdmin">
    <div class="export">
      <div class="sample-property">
        <div class="tit mr15">样本属性模块：</div>
        <div class="check">
          <el-select v-model="sampleValue" class="select-wid" size="mini" placeholder="请选择属性模版" clearable @change="switchTemplate" @clear="clearTemplate">
            <el-option v-for="item in sampleList" :label="item.name" :value="item.id" :key="item.id" ></el-option>
          </el-select>
        </div>
      </div>
      <!-- 属性 -->
      <div class="tit">全部属性</div>
        <div class="exportBox check">
          <custom-transfer @saveLists="saveLists" ref="customtransfer"></custom-transfer>
        </div>
        <!-- 导出格式 -->
        <div>
          <el-row class="li" v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_PROPERTY_ADMIN}">
            <el-col :span='3'><el-button type='primary' size='small' class="eBtn mini" @click="savePropertyAdmin" :disabled='isSample'><span>保存</span></el-button></el-col>
            <el-col :span='4'><el-button type='primary' size='small' class="eBtn mini" @click="showDialog = true" :disabled='isSample'><span>保存到常用属性模板</span></el-button></el-col>
            <el-col :span='4'><el-button type='primary' size='small' class="eBtn mini" @click="openShowDefined" :disabled='isSample'><span>修改自定义名称</span></el-button></el-col>
          </el-row>
        </div>

        <el-dialog title="保存到常用模版" :visible.sync="showDialog" v-if="showDialog" width="30%">
          <el-form :model="form" :rules="rules" ref="ruleForm">
            <el-form-item label="模版名称：" label-width="100px" prop="name">
              <el-input v-model="form.name" autocomplete="off" placeholder="请输入模版名称" size="mini"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelDialog" class="mini" size="mini"> <span> 取 消</span></el-button>
            <el-button type="primary" @click="submitForm('ruleForm')" class="mini" size="mini"> <span>确 定</span> </el-button>
          </div>
        </el-dialog>
        <el-dialog title="修改自定义名称" :visible.sync="showDefinedDialog" v-if="showDefinedDialog" width="70%">
          <el-form :model="formDefined" ref="ruleDefinedForm" style="overflow: hidden">
            <el-form-item label="自定义名称1：" label-width="100px" prop="custom1" class="fl50">
              <el-input v-model="formDefined.custom1" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称6：" label-width="100px" prop="custom6" class="fl50">
              <el-input v-model="formDefined.custom6" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称11：" label-width="100px" prop="custom11" class="fl50">
              <el-input v-model="formDefined.custom11" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称2：" label-width="100px" prop="custom2" class="fl50">
              <el-input v-model="formDefined.custom2" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称7：" label-width="100px" prop="custom7" class="fl50">
              <el-input v-model="formDefined.custom7" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称12：" label-width="100px" prop="custom12" class="fl50">
              <el-input v-model="formDefined.custom12" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称3：" label-width="100px" prop="custom3" class="fl50">
              <el-input v-model="formDefined.custom3" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称8：" label-width="100px" prop="custom8" class="fl50">
              <el-input v-model="formDefined.custom8" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称13：" label-width="100px" prop="custom13" class="fl50">
              <el-input v-model="formDefined.custom13" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称4：" label-width="100px" prop="custom4" class="fl50">
              <el-input v-model="formDefined.custom4" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称9：" label-width="100px" prop="custom9" class="fl50">
              <el-input v-model="formDefined.custom9" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称14：" label-width="100px" prop="custom14" class="fl50">
              <el-input v-model="formDefined.custom14" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称5：" label-width="100px" prop="custom5" class="fl50">
              <el-input v-model="formDefined.custom5" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称10：" label-width="100px" prop="custom10" class="fl50">
              <el-input v-model="formDefined.custom10" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称15：" label-width="100px" prop="custom15" class="fl50">
              <el-input v-model="formDefined.custom15" autocomplete="off" placeholder="请输入" size="mini"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="canceDefinedlDialog" class="mini" size="mini"> <span> 取 消</span></el-button>
            <el-button type="primary" @click="submitDefinedForm('ruleDefinedForm')" class="mini" size="mini"> <span>确 定</span> </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
import customTransfer from '../../common/customTransfer'
import { mapMutations } from 'vuex'
export default {
  components: {
    customTransfer
  },
  data () {
    return {
      projectId: null,
      isSample: false,
      breadcrumbList: [
        {
          name: '样本',
          path: '/sample'
        }, {
          name: '属性管理',
        }
      ],
      proList: [],
      formDefined: {
        custom1: null,
        custom2: null,
        custom3: null,
        custom4: null,
        custom5: null,
        custom6: null,
        custom7: null,
        custom8: null,
        custom9: null,
        custom10: null,
        custom11: null,
        custom12: null,
        custom13: null,
        custom14: null,
        custom15: null,
      },
      format: 1,
      sampleValue: '',
      sampleList: [],
      allProperty: null,
      proArr: [],
      value: [],
      valueRgt: [],
      id: '',
      useArr: '', // 项目使用属性
      listArr: '', //列表显示属性
      sampleArr: '', //样本标识
      showDialog: false,
      showDefinedDialog: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入模版名称', trigger: 'blur' },
        ]
      }
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      link: '/sample',
      backTitle: '访谈列表'
    })
    this.projectId = this.$route.query.id
    this.httpPost('/project/get/visit/' + this.projectId).then(res => {
      console.log(res.data)
      if (res.data == 1) {
        this.isSample = true
      }
    })
    this.getSampleProList()
    this.getTemplate()
  },
  methods: {
    ...mapMutations(['setAllProperty']),
    // 改变当前页码
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 改变当前每页条数
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //获取属性
    getSampleProList () {
      let _this = this
      this.httpPost(`/sample/property/get/${this.projectId}`).then(res => {
        if (res.code == 0) {
          if (res.data != null) {
            _this.id = res.data.id
            let allProperty = JSON.parse(res.data.allProperty)
            this.allProperty = allProperty
            let proArr = Object.keys(allProperty)
            this.proArr = Object.keys(allProperty)
            var proList = []
            proArr.forEach(item => {
              let allObj = {}
              allObj.key = item
              allObj.label = allProperty[item]
              if (item == 'name' || item == 'code') {
                allObj.disabled = true
                allObj.checked = true
              } else {
                allObj.disabled = false
                allObj.checked = false
              }
              proList.push(allObj)
            })
            let filterName = proList.filter(item => {
              return item.key == 'name'
            })
            let filterCode = proList.filter(item => {
              return item.key == 'code'
            })
            for (let index = 0; index < proList.length; index++) {
              const element = proList[index];
              if (element.key == 'name') {
                proList.splice(index, 1)
              } else if (element.key == 'code') {
                proList.splice(index, 1)
              }
            }
            proList.unshift(filterCode[0], filterName[0])
            this.$store.commit('setAllProperty', {
              allProperty: proList
            })
            this.proList = proList
            this.$refs.customtransfer.getResult(res.data)
          }
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    //查询项目属性模版
    getTemplate() {
      let _this = this
      let param = {
        projectId: this.projectId
      }
      this.httpPost(`/sample/property/template/list`, param).then(res => {
        if (res.code == 0) {
           this.sampleList = res.data
           this.allProperty = JSON.parse(this.sampleList[0].allProperty)
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        // this.$message({type: 'error', message: error})
      })
    },
    //保存自组件传过来的list
    saveLists (useArr, listArr, sampleArr) {
      this.useArr = useArr
      this.listArr = listArr
      this.sampleArr = sampleArr
    },
    //保存按钮事件
    savePropertyAdmin () {
      let listKey = []
      this.listArr.forEach(item => {
        listKey.push(item.key)
      })
      let markKey = []
      this.sampleArr.forEach(item => {
        markKey.push(item.key)
      })
      let useKey = []
      this.useArr.forEach(item => {
        useKey.push(item.key)
      })
      if (useKey.length == 2) {
        listKey = ['name', 'code']
        markKey = ['name', 'code']
        useKey = ['name', 'code']
      }
      let params = {
        "id": this.id,
        "listProperty": listKey == null ? listKey : JSON.stringify(listKey),
        "markProperty": markKey == null ? markKey : JSON.stringify(markKey),
        "projectId": this.projectId,
        "useProperty": useKey == null ? useKey : JSON.stringify(useKey)
      }
      this.httpPost(`/sample/property/project`, params).then(res => {
        if (res.code == 0) {
          if (res.data) {
            this.$message({type: 'success', message: res.message})
            this.$router.push(`/sample?id=${this.projectId}`)
          } else {
            this.$message({type: 'error', message: res.message})
          }
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    //关闭dialog
    cancelDialog () {
      this.showDialog = false
      this.form.name =''
    },
    // 打开自定义名称修改dialog
    openShowDefined () {
      this.showDefinedDialog = true
      this.proList.forEach(all => {
        this.proArr.forEach(item => {
          if (item == 'custom1' && all.key == 'custom1') {
            this.formDefined.custom1 = all.label
          } else if (item == 'custom2' && all.key == 'custom2') {
            this.formDefined.custom2 = all.label
          } else if (item == 'custom3' && all.key == 'custom3') {
            this.formDefined.custom3 = all.label
          } else if (item == 'custom4' && all.key == 'custom4') {
            this.formDefined.custom4 = all.label
          } else if (item == 'custom5' && all.key == 'custom5') {
            this.formDefined.custom5 = all.label
          } else if (item == 'custom6' && all.key == 'custom6') {
            this.formDefined.custom6 = all.label
          } else if (item == 'custom7' && all.key == 'custom7') {
            this.formDefined.custom7 = all.label
          } else if (item == 'custom8' && all.key == 'custom8') {
            this.formDefined.custom8 = all.label
          } else if (item == 'custom9' && all.key == 'custom9') {
            this.formDefined.custom9 = all.label
          } else if (item == 'custom10' && all.key == 'custom10') {
            this.formDefined.custom10 = all.label
          } else if (item == 'custom11' && all.key == 'custom11') {
            this.formDefined.custom11 = all.label
          } else if (item == 'custom12' && all.key == 'custom12') {
            this.formDefined.custom12 = all.label
          } else if (item == 'custom13' && all.key == 'custom13') {
            this.formDefined.custom13 = all.label
          } else if (item == 'custom14' && all.key == 'custom14') {
            this.formDefined.custom14 = all.label
          } else if (item == 'custom15' && all.key == 'custom15') {
            this.formDefined.custom15 = all.label
          }
        })
      })
    },
    // 关闭自定义名称修改dialog
    canceDefinedlDialog () {
      this.showDefinedDialog = false
      this.formDefined = {
        custom1: null,
        custom2: null,
        custom3: null,
        custom4: null,
        custom5: null,
        custom6: null,
        custom7: null,
        custom8: null,
        custom9: null,
        custom10: null,
        custom11: null,
        custom12: null,
        custom13: null,
        custom14: null,
        custom15: null,
      }
    },
    // 提交自定义名称修改
    submitDefinedForm (formName) {
      let arr = JSON.parse(JSON.stringify(this.allProperty))
      this.proArr.forEach(item => {
        if (item == 'custom1') {
          arr[item] = this.formDefined.custom1
        } else if (item == 'custom2') {
          arr[item] = this.formDefined.custom2
        } else if (item == 'custom3') {
          arr[item] = this.formDefined.custom3
        } else if (item == 'custom4') {
          arr[item] = this.formDefined.custom4
        } else if (item == 'custom5') {
          arr[item] = this.formDefined.custom5
        } else if (item == 'custom6') {
          arr[item] = this.formDefined.custom6
        } else if (item == 'custom7') {
          arr[item] = this.formDefined.custom7
        } else if (item == 'custom8') {
          arr[item] = this.formDefined.custom8
        } else if (item == 'custom9') {
          arr[item] = this.formDefined.custom9
        } else if (item == 'custom10') {
          arr[item] = this.formDefined.custom10
        } else if (item == 'custom11') {
          arr[item] = this.formDefined.custom11
        } else if (item == 'custom12') {
          arr[item] = this.formDefined.custom12
        } else if (item == 'custom13') {
          arr[item] = this.formDefined.custom13
        } else if (item == 'custom14') {
          arr[item] = this.formDefined.custom14
        } else if (item == 'custom15') {
          arr[item] = this.formDefined.custom15
        }
      })
      this.allProperty = JSON.parse(JSON.stringify(arr))
      let params = {
        "projectId": +this.projectId,
        "allProperty": JSON.stringify(this.allProperty),
      }
      this.httpPost('/sample/property/save', params).then(res => {
        if (res.code == 0) {
          this.showDefinedDialog = false
          this.getSampleProList()
          this.getTemplate()
          this.$message({type: 'success', message: res.message})
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: res.message})
      })
    },
    //保存模版
    submitForm(formName) {
      let listKey = []
      this.listArr.forEach(item => {
        listKey.push(item.key)
      })
      let markKey = []
      this.sampleArr.forEach(item => {
        markKey.push(item.key)
      })
      let useKey = []
      this.useArr.forEach(item => {
        useKey.push(item.key)
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.showDialog = false
          let params = {
            "name": this.form.name,
            "listProperty": JSON.stringify(listKey),
            "markProperty": JSON.stringify(markKey),
            "useProperty": JSON.stringify(useKey),
            "projectId": this.projectId,
          }
          this.httpPost(`/sample/property/template/save`, params).then(res => {
            if (res.code == 0) {
              this.form.name = ''
              this.getTemplate()
              if (res.data) {
                this.$message({type: 'success', message: res.message})
              } else {
                this.$message({type: 'error', message: res.message})
              }
            } else {
              this.$message({type: 'error', message: res.message})
            }
          }).catch(error => {
            this.$message({type: 'error', message: error})
          })
        } else {
          return false;
        }
      })
    },
    //切换模版
    switchTemplate(e) {
      let arr = this.sampleList.filter(item => {
        return e == item.id
      })
      let obj = {}
      if (arr.length != 0) {
        obj.useProperty = arr[0].useProperty
        obj.listProperty = arr[0].listProperty
        obj.markProperty = arr[0].markProperty
        obj.allProperty = arr[0].allProperty
        this.$refs.customtransfer.getResult(obj)
      }
    },
    //清空模版
    clearTemplate() {
      let obj = {}
      obj.useProperty = '["name", "code"]'
      obj.listProperty = '[]'
      obj.markProperty = '[]'
      this.$refs.customtransfer.getResult(obj)
    }
  }
}
</script>

<style scoped>
  .history>>>.el-table th, .el-table tr {
    background-color: #3e4b6b33;
  }
  #propertyAdmin>>>.el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 12px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  #propertyAdmin>>>.el-form-item {
    margin-bottom: 0px;
  }
  #propertyAdmin>>>.el-pagination span{
    font-size: 12px;
  }
  .exportBox>>>.el-button {
    padding: 8px 8px;
    margin: 0;
  }
  #propertyAdmin>>>.el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 12px;
  }
  .export>>>.el-radio__label {
    font-size: 12px;
    padding-left: 10px;
  }
  #propertyAdmin>>>.el-transfer-panel__item.el-checkbox .el-checkbox__label span{
    font-size: 12px !important;
  }
  #propertyAdmin>>>.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 13px;
    color: #303133;
    font-weight: normal;
  }
  #propertyAdmin>>>.el-button--primary.is-disabled, .el-button--primary.is-disabled:hover, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:active {
    color: #fff;
    background-color: #acb9da;
    border-color: #acb9da;
    padding: 5px;
    margin: 3px;
  }
</style>
<style lang="scss" scoped>
  #propertyAdmin{
    div{
      overflow: hidden;
    }
    .fl50{
      float: left;
      width: 30%;
      margin-left: 3%;
    }
    .export{
      .sample-property {
        display: flex;
        align-items: center;
      }
      .mr15 {
        margin-right: 15px !important;
      }
      .tit{
        margin: 0px 0 20px;
        font-size: 14px;
        color: #444;
      }
      .check{
        margin-bottom: 20px;
      }
      .li{
        margin: 30px 0;
        font-size: 14px;
        color: #444;

        .eBtn{
          width: 90%;
        }
      }
    }
  }
</style>
