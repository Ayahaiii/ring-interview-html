<template>
  <div id="createInterview">
    <!-- 项目列表 -->
    <el-row>
      <el-form :hide-required-asterisk='true' size='mini' label-position="left" :model="searchForm" :rules="rules" ref="searchForm" label-width="100px" class="demo-ruleForm">
        <el-col :span='24'>
          <el-form-item label="名称 :" prop="intName">
            <el-input v-model="searchForm.intName" style="width: 60%" placeholder="请输入访谈名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="访谈对象 :" prop="sampleList">
            <div>
              <!-- 当status不为计划中时，访谈对象不可以删除 -->
              <el-select v-if="status != 1" style="width: 60%" v-model="searchForm.sampleList" :remote-method="remoteMethod" remote :loading="loading"
                reserve-keyword multiple filterable placeholder="请输入关键词" @keyup.delete.native='deleteInput' @change="changeSelect" v-defaultSelect="[searchForm.sampleList,restaurants,'value','disabled',true]">
                <div>
                  <el-option v-for="item in restaurants" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                </div>
              </el-select>

              <!-- 当status为计划中时，访谈对象可以删除 -->
              <el-select v-if="status == 1" style="width: 60%" v-model="searchForm.sampleList" :remote-method="remoteMethod" remote :loading="loading"
                reserve-keyword multiple filterable placeholder="请输入关键词"  @keyup.delete.native='deleteInput' @change="changeSelect">
                <div>
                  <el-option v-for="item in restaurants" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                </div>
              </el-select>
              <span v-if="isShowMessage" style='color: #F56C6C; margin-left: 10px; font-size: 12px'>未找到此用户，对方可能尚未注册</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="负责人 :">
            <span class="txt">{{ searchForm.manager.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="协作者 :">
            <span class="txt xie" v-for="(ass, index) in xieArr" :key="'ass'+index">{{ ass.name }} </span>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="计划开始时间 :">
            <el-date-picker v-model="searchForm.planStartTime" type="date" placeholder="选择计划开始时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="计划结束时间 :">
            <el-date-picker v-model="searchForm.planEndTime" type="date" placeholder="选择计划结束时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="访谈地点 :">
            <el-input v-model="searchForm.address" style="width: 60%" placeholder="请输入访谈地点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="访谈计划 :">
            <div>
              <EditorBar v-model="searchForm.plan" @change='change' :isClear="isClear" :url="url"></EditorBar>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span='24'>
          <el-form-item label="备注 :">
            <el-input v-model="searchForm.remarks" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" type='textarea'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='24' v-permission="{projectId: $route.query.id, permissionId: Constant.RI_INTERVIEW_ADD}">
          <el-form-item>
            <el-button type="primary" :disabled='isDisabled || isSample' style="width: 150px" @click="save('searchForm')" class="mini"><span>保存</span></el-button>
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
          name: '访谈',
          path: '/talk'
        }, {
          name: '创建访谈',
        }
      ],
      status: null,
      oldArr: null,
      keyword: '',
      projectId: null,
      isSample: false,
      interviewId: null,
      isClear: false,
      url: '',
      isShowMessage: false,
      restaurants: [],
      listArr: [],
      xieArr: [],
      isDisabled: false,
      sampleIdArr: [],
      sIds: null,
      sampleName: '',
      assistantName: '',
      managerName: '',
      searchForm: {
        intName: '',
        sampleList: [],
        manager: '',
        cooperation: '',
        planStartTime: '',
        planEndTime: '',
        address: '',
        plan: '',
        remarks: '',
      },
      list:[],
      samIds: [],
      rules: {
        sampleList: [{ required: true, message: '请输入访谈对象', trigger: 'blur' }],
        address: [{ required: true, message: '请输入访谈地址', trigger: 'blur' }],
      },
      resultList: [
        {
          assistant: [],
          manager: {},
          sample: []
        }
      ], // 详情old数组
      newList: [],
      oldRestaurants: [],
      loading: false,
    }
  },
  created () {
    this.$emit('getChild', {
      breadcrumbList: this.breadcrumbList,
      backTitle: '',
      link: '/talk',
      backTitle: '访谈列表'
    })
    this.projectId = this.$route.query.id
    this.httpPost('/project/get/visit/' + this.projectId).then(res => {
      console.log(res.data)
      if (res.data == 1) {
        this.isSample = true
      }
    })
    this.interviewId = this.$route.query.inId
    this.status = this.$route.query.status
    if (this.$route.query.sIds) {
      this.sIds = JSON.parse(this.$route.query.sIds)
    }
    if (this.sIds) {
      // 合并访谈
      this.meargInterview()
    }
    if (this.interviewId) {
      // 获取详情
      this.getDetail()
    }
  },
  methods: {
    // 合并访谈
    meargInterview () {
      let params = {
        "sampleIds": this.sIds,
        "projectId": +this.projectId
      }
      this.httpPost('/interview/sample/assigned', params).then(res => {
        if (res.code == 0) {
          this.searchForm.sampleList = []
          this.restaurants = []
          this.searchForm.manager = res.data[0].manager
          this.xieArr = []
          var xieArr = []
          res.data.forEach(item => {
            item.assistant.forEach(ass => {
              if (xieArr.indexOf(ass.id) == -1) {
                xieArr.push(ass.id)
                this.xieArr.push(ass)
              }
            })
            let obj = {}
            obj.value = item.sample.id
            obj.id = item.sample.id
            obj.disabled = false
            obj.label = item.sample.code + '-' + item.sample.name
            this.restaurants.push(obj)
            this.searchForm.sampleList.push(+item.sample.id)
            this.sampleIdArr.push(item.sample)
          })
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
      })
    },

    // 获取访谈详情信息
    getDetail () {
      this.oldArr = null
      let params = {
        "interviewId": +this.interviewId,
        "projectId": +this.projectId
      }
      this.httpPost('/interview/detail', params).then(res => {
        if (res.code == 0) {
          let resData = res.data
          const old = resData.assistantList
          this.oldArr = JSON.parse(JSON.stringify(old))
          this.searchForm.address = resData.address
          this.searchForm.remarks = resData.description
          this.searchForm.intName = resData.interviewName
          this.searchForm.planEndTime = resData.planEndTime
          this.searchForm.planEndTime = new Date(this.searchForm.planEndTime)
          this.searchForm.planStartTime = resData.planStartTime
          this.searchForm.planStartTime = new Date(this.searchForm.planStartTime)
          this.searchForm.plan = resData.planText
          this.searchForm.manager = resData.manager
          this.sampleIdArr = resData.sampleList
          this.sampleIdArr.forEach(item => {
            if (this.searchForm.sampleList.indexOf(item.id) == -1) {
            this.searchForm.sampleList.push(item.id)
            this.samIds.push(item.id)
            }
            let obj = {}
            obj.value = item.id
            obj.id = item.id
            obj.disabled = true
            obj.label = item.code + '-' + item.name
            this.restaurants.push(obj)
            this.oldRestaurants.push(obj)
          })
          this.xieArr = resData.assistantList
          this.resultList[0].assistant = resData.assistantList
          this.resultList[0].manager = resData.manager
          this.managerId = resData.manager.id
          this.resultList[0].sample = resData.sampleList
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },

    // 当下拉框获取焦点时，禁用backspace键
    deleteInput () {
      if (this.interviewId) {
        this.restaurants = JSON.parse(JSON.stringify(this.oldRestaurants))
        this.searchForm.sampleList = JSON.parse(JSON.stringify(this.samIds))
      }
    },

    // 访谈对象发生变化
    changeSelect (sampleIdList) {
      this.keyword = null
      this.newList = []
      if (this.newList.length <= 0 && this.interviewId) {
        this.xieArr = this.oldArr
      }
      if (sampleIdList.length <= 0 && !this.interviewId) {
        this.searchForm.manager = {}
        this.xieArr = []
        this.restaurants = []
        this.newList = []
      } else if (sampleIdList.length <= 0 && this.interviewId) {
        this.xieArr = []
        this.restaurants = []
        this.newList = []
      } else {
        this.getInterviewSampleLIst(sampleIdList)
      }
    },

    // 关键字改变
    remoteMethod (val) {
      this.keyword = val
      if (this.searchForm.sampleList.length > 0) {
        this.managerId = this.searchForm.manager.id
      }
      if (this.keyword.trim()) {
        this.getInterviewSampleLIst(this.searchForm.sampleList)
      }
    },

    // 获取访谈对象
    getInterviewSampleLIst (sArr) {
      this.restaurants = []
      this.xieArr = []
      this.newList = []
      this.sampleIdArr = []
      this.loading = true
      let params = {
        'keyword': this.keyword,
        'managerId': this.managerId,
        "projectId": +this.projectId
      }
      this.httpPost('/interview/sample/assigned', params).then(res => {
        if (res.code == 0) {
          this.loading = false
          this.list = res.data
          var arr = this.list
          if (arr.length <= 0) {
            this.restaurants = []
          } else {
            var assId = []
            arr.forEach(item => {
              let obj = {}
              obj.value = item.sample.id
              obj.id = item.sample.id
              obj.disabled = false
              obj.label = item.sample.code + '-' + item.sample.name
              // 获取访谈下拉列表
              this.restaurants.push(obj)
            })
            arr.forEach(item => {
              // 详情新数组
              if (this.interviewId) {
                // 获取负责人
                sArr.forEach(sam => {
                  if (item.sample.id == sam) {
                    this.newList.push(item.sample)
                  }
                })
              } else {
                if (this.searchForm.sampleList.length > 0) {
                  // 获取协作者
                  sArr.forEach(sam => {
                    // 打印协作者
                    if (item.sample.id == sam) {
                      item.assistant.forEach(ass => {
                        if (assId.indexOf(ass.id) == -1) {
                          assId.push(ass.id)
                          this.xieArr.push(ass)
                        }
                      })
                      // 获取访谈对象
                      this.sampleIdArr.push(item.sample)
                    }
                  })
                }
              }
            })
            // 获取负责人
            this.searchForm.manager = arr[0].manager
          }
          if (this.newList.length <= 0) {
            this.resultList[0].sample.forEach(item => {
              sArr.forEach(s => {
                if (s == item.id) {
                  var assistantIdArr = item.assistantId.split(",")
                  this.resultList[0].assistant.forEach(si => {
                    assistantIdArr.forEach(ai => {
                      if (si.id == ai) {
                        this.xieArr.push(si)
                      }
                    })
                  })
                }
              })
            })
          } else {
            this.xieArr = []
            var indexArr = []
            // 判断访谈对象中是否存在旧的访谈对象
            this.resultList[0].sample.forEach(item => {
              sArr.forEach(s => {
                if (s == item.id) {
                  var assistantIdArr = item.assistantId.split(",")
                  this.resultList[0].assistant.forEach(si => {
                    assistantIdArr.forEach(ai => {
                      if (si.id == ai && indexArr.indexOf(ai) == -1) {
                        this.xieArr.push(si)
                        indexArr.push(ai)
                      }
                    })
                  })
                }
              })
            })
            var ids = []
            this.xieArr.forEach(xie => {
              ids.push(xie.id)
            })
            let idss = Array.from(new Set(ids))
            // 获取协作者
            this.list.forEach(item => {
              sArr.forEach(saa => {
                if (saa == item.sample.id) {
                  item.assistant.forEach(ass => {
                    if (idss.indexOf(ass.id) == -1) {
                      idss.push(ass.id)
                      this.xieArr.push(ass)
                    }
                  })
                }
              })
            })
          }
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        // this.$message({type: 'error', message: error})
      })
    },

    // 保存
    save(formName) {
      this.isDisabled = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let startTime = new Date(this.searchForm.planStartTime); // 开始时间
          let endTime = new Date(this.searchForm.planEndTime); // 结束时间
          let time = endTime - startTime
          var params;
          var sampleArr = []
          if (this.status != 1) {
            if (this.newList.length > 0) {
              sampleArr = this.resultList[0].sample.concat(this.newList)
            } else {
              sampleArr = this.resultList[0].sample
            }
          } else {
            sampleArr = []
            this.resultList[0].sample.forEach(item => {
              this.searchForm.sampleList.forEach(sea => {
                if (item.id == sea) {
                  sampleArr.push(item)
                }
              })
            })
            if (this.newList.length > 0) {
              sampleArr = sampleArr.concat(this.newList)
            }
          }
          if (this.interviewId) {
            params = {
              "name": this.searchForm.intName,
              "address": this.searchForm.address,
              "planDuration": time,
              "description": this.searchForm.remarks,
              "planEndTime": this.searchForm.planEndTime,
              "planStartTime": this.searchForm.planStartTime,
              "planText": this.searchForm.plan,
              "projectId": +this.projectId,
              "id": this.interviewId,
              "oldSample": this.resultList[0].sample,
              "oldAssistant": this.oldArr,
              "sample": sampleArr,
              "assistant": this.xieArr,
            }
          } else {
            params = {
              "name": this.searchForm.intName,
              "address": this.searchForm.address,
              "assistant": this.xieArr,
              "planDuration": time,
              "description": this.searchForm.remarks,
              "manager": this.searchForm.manager,
              "planEndTime": this.searchForm.planEndTime,
              "planStartTime": this.searchForm.planStartTime,
              "planText": this.searchForm.plan,
              "projectId": +this.projectId,
              "sample": this.sampleIdArr
            }
          }
          this.httpPost('/interview/save', params).then(res => {
            if (res.code == 0) {
              this.searchForm.intName = ''
              this.searchForm.sampleList = []
              this.searchForm.address = ''
              this.searchForm.remarks = ''
              this.searchForm.manager = {}
              this.searchForm.planEndTime = null
              this.searchForm.planStartTime = null
              this.searchForm.plan = null
              this.isClear = true
              this.xieArr = []
              this.sampleIdArr = []
              this.isDisabled = false
              this.$message({type: 'success', message: res.message})
              this.$router.push({path: '/talk', query: {id: this.projectId}})
            } else {
              this.$message({type: 'error', message: res.message})
            }
          }).catch(error => {
            this.$message({type: 'error', message: error})
          })
        } else {
          return false;
        }
      });
    },
    // childValue就是子组件传过来的值
    change: function (childValue) {
      this.searchForm.plan = childValue
    },
  }
}
</script>

<style scoped>
  #createInterview>>>.el-form-item--mini .el-form-item__label {
    line-height: 28px;
    font-size: 12px;
  }
  #createInterview>>>.el-select__tags-text{
    font-size: 12px !important;
  }
</style>
<style lang="scss" scoped>
  #createInterview{
    width: 80%;
    .txt{
      font-size: 12px;
    }
    .xie{
      display: inline-block;
      margin-right: 20px;
    }
  }
</style>
