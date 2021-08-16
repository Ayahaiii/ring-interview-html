<!-- add -->
<template>
  <div id = 'sampleAdd' v-loading="fullscreenLoading">
  <div class="box" v-if="operation == 1 && interviewList.length > 0">
    <el-row style="margin-bottom: 10px" v-for="(item, index) in interviewList" :key="'form'+index">
      <el-col :span='6'><span class="iconfont col">&#xe631;</span><span class="fs12 col">{{ item.name }}</span></el-col>
      <el-col :span='3'><span class="iconfont cc">&#xe60b;</span><span class="tit fs12">负责人：</span><span class="fs12 tit">{{ item.managerName }}</span></el-col>
      <el-col :span='5'><span class="tit fs12">协作者：</span><span class="fs12 tit">{{ item.assistantName }}</span></el-col>
      <el-col :span='3'><span class="iconfont cc">&#xe604;</span><span class="tit fs12">文本：</span><span class="fs12 wen1">{{ item.fileCountDTO.itwtCount }}</span></el-col>
      <el-col :span='3'><span class="iconfont cc">&#xe8e0;</span><span class="tit fs12">录音：</span><span class="fs12 wen2">{{ item.fileCountDTO.fileCount }}</span></el-col>
      <el-col :span='3'><span class="iconfont cc">&#xe632;</span><span class="tit fs12">附件：</span><span class="fs12 wen3">{{ item.fileCountDTO.attaCount }}</span></el-col>
    </el-row>
  </div>
    <el-form
      :model="form"
      :rules="formRules"
      ref="formRules"
      label-width="90px"
      label-position="left"
      size='mini'
    >
      <!-- 基本信息 -->
      <div>
        <p>基本信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="样本名称：" prop="name" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('name') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.name}}</span>
              <el-input v-model="form.name" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样本编号：" prop="code" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('code') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.code}}</span>
              <el-input v-model="form.code" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('gender') != -1)">
            <el-form-item label="性别：">
              <span v-if="operation == 1" class="fs12">{{form.gender}}</span>
              <el-select v-model="form.gender" class="select-wid" v-else>
                <el-option label="未知" value="未知"></el-option>
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('birth') != -1)">
            <el-form-item label="出生日期：" >
              <span v-if="operation == 1" class="fs12">{{form.birth}}</span>
              <el-date-picker
                v-model="form.birth"
                type="date"
                placeholder="选择日期"
                class="select-wid"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                clearable
                @change="birthChange"
                v-else
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('organization') != -1)">
            <el-form-item label="单位：" >
              <span v-if="operation == 1" class="fs12">{{form.organization}}</span>
              <el-input v-model="form.organization" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('age') != -1)">
            <el-form-item label="年龄：">
              <span v-if="operation == 1 || form.birth" class="fs12">{{form.age}}</span>
              <el-select v-model="form.age" class="select-wid" v-if="operation != 1 && !form.birth">
                <el-option v-for = "i in 100" :key="i" :value="i"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 联系方式 -->
      <div
        v-if="useProperty == null || (useProperty != null && useProperty.indexOf('mobile') != -1)
              || (useProperty != null && useProperty.indexOf('weixin') != -1)
              || (useProperty != null && useProperty.indexOf('phone') != -1)
              || (useProperty != null && useProperty.indexOf('qq') != -1)
              || (useProperty != null && useProperty.indexOf('email') != -1)
              || (useProperty != null && useProperty.indexOf('weibo') != -1)"

      >
        <el-row>
          <el-col :span="24"><p>联系方式</p></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话号码："  v-if="useProperty == null || (useProperty != null && useProperty.indexOf('mobile') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.mobile}}</span>
              <el-input v-model="form.mobile" type="number" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('weixin') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.weixin}}</span>
              <el-input v-model="form.weixin" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('phone') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.phone}}</span>
              <el-input v-model="form.phone" type="number" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="QQ：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('qq') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.qq}}</span>
              <el-input v-model="form.qq" type="number" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('email') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.email}}</span>
              <el-input v-model="form.email" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微博：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('weibo') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.weibo}}</span>
              <el-input v-model="form.weibo" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 地址 -->
      <div v-if="useProperty == null || (useProperty != null && useProperty.indexOf('province') != -1) || (useProperty != null && useProperty.indexOf('city') != -1) || (useProperty != null && useProperty.indexOf('district') != -1) || (useProperty != null && useProperty.indexOf('town') != -1)">
        <el-row>
          <el-col :span="24"><p>地址</p></el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址：">
              <el-col :span="3" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('province') != -1)">
                <span v-if="operation == 1" class="fs12">{{form.province}}</span>
                <el-select v-model="form.province" @change="getCities" class="select-wid-add" placeholder="省" v-else>
                  <el-option v-for="(item, index) in provinces"
                             :label="item"
                             :value="item"
                             :key="index"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="3" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('city') != -1)">
                <span v-if="operation == 1" class="fs12">{{form.city}}</span>
                <el-select v-model="form.city" @change="getDists" class="select-wid-add" placeholder="市" v-else>
                  <el-option v-for="(item, index) in cities"
                             :label="item"
                             :value="item"
                             :key="index"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="3" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('district') != -1)">
                <span v-if="operation == 1" class="fs12">{{form.district}}</span>
                <el-select v-model="form.district" @change="getTowns" class="select-wid-add" placeholder="区/县" v-else>
                  <el-option v-for="(item, index) in dists"
                             :label="item"
                             :value="item"
                             :key="index"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="3" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('town') != -1)">
                <span v-if="operation == 1" class="fs12">{{form.town}}</span>
                <el-select v-model="form.town" class="select-wid-add" placeholder="街道/镇" v-else>
                  <el-option v-for="(item, index) in towns"
                             :label="item"
                             :value="item"
                             :key="index"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="24" style="margin-top:15px;" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('address') != -1)">
                <span v-if="operation == 1" class="fs12">{{form.address}}</span>
                <el-input v-model="form.address" type="text" size="mini" style="width: 73%;" v-else></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 更多信息 -->
      <div
        v-if="useProperty == null || (useProperty != null && useProperty.indexOf('position') != -1)
              || (useProperty != null && useProperty.indexOf('profession') != -1)
              || (useProperty != null && useProperty.indexOf('marriageStatus') != -1)
              || (useProperty != null && useProperty.indexOf('education') != -1)
              || (useProperty != null && useProperty.indexOf('politicalStatus') != -1)
              || (useProperty != null && useProperty.indexOf('nationality') != -1)
              || (useProperty != null && useProperty.indexOf('religion') != -1)
              || (useProperty != null && useProperty.indexOf('placeOfBirth') != -1)
              || (useProperty != null && useProperty.indexOf('dialects') != -1)
              || (useProperty != null && useProperty.indexOf('language') != -1)
              || (useProperty != null && useProperty.indexOf('description') != -1)
              || (useProperty != null && useProperty.indexOf('detail') != -1)"

      >
        <el-row><el-col :span="24"><p>更多信息</p></el-col></el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职务：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('position') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.position}}</span>
              <el-input v-model="form.position" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('profession') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.profession}}</span>
              <el-input v-model="form.profession" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="婚姻状况：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('marriageStatus') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.marriageStatus}}</span>
              <el-select v-model="form.marriageStatus" class="select-wid" v-else>
                <el-option v-for="item in marryList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('education') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.education}}</span>
              <el-select v-model="form.education" class="select-wid" v-else>
                <el-option v-for="item in educationList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="政治面貌：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('politicalStatus') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.politicalStatus}}</span>
              <el-select v-model="form.politicalStatus" class="select-wid" v-else>
                <el-option v-for="item in polityList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国籍：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('nationality') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.nationality}}</span>
              <el-select v-model="form.nationality" class="select-wid" v-else>
                <el-option v-for="item in nationalityList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="宗教信仰：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('religion') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.religion}}</span>
              <el-select v-model="form.religion" class="select-wid" v-else>
                <el-option v-for="item in religionList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('placeOfBirth') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.placeOfBirth}}</span>
              <el-input v-model="form.placeOfBirth" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="方言：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('dialects') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.dialects}}</span>
              <el-select v-model="form.dialects" class="select-wid" v-else>
                <el-option v-for="item in dialectList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="语言：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('language') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.language}}</span>
              <el-select v-model="form.language" class="select-wid" v-else>
                <el-option v-for="item in languageList" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('description') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.description}}</span>
              <el-input v-model="form.description" type="text" style="width: 73%;" size="mini" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详细介绍：" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('detail') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.detail}}</span>
              <el-input v-model="form.detail" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 73%;" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 自定义 -->
      <div v-if="useProperty == null || (useProperty != null && useProperty.indexOf('custom1') != -1) || (useProperty != null && useProperty.indexOf('custom2') != -1) || (useProperty != null && useProperty.indexOf('custom3') != -1) || (useProperty != null && useProperty.indexOf('custom4') != -1) || (useProperty != null && useProperty.indexOf('custom5') != -1)">
        <el-row><el-col :span="24"><p>自定义</p></el-col></el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="customName1" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('custom1') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.custom1}}</span>
              <el-input v-model="form.custom1" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="customName2" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('custom2') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.custom2}}</span>
              <el-input v-model="form.custom2" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="customName3" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('custom3') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.custom3}}</span>
              <el-input v-model="form.custom3" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="customName4" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('custom4') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.custom4}}</span>
              <el-input v-model="form.custom4" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="customName5" v-if="useProperty == null || (useProperty != null && useProperty.indexOf('custom5') != -1)">
              <span v-if="operation == 1" class="fs12">{{form.custom5}}</span>
              <el-input v-model="form.custom5" type="text" class="select-wid" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 保存按钮 -->
      <div v-if="operation != 1">
        <el-col :span='24' v-permission="{projectId: $route.query.id, permissionId: Constant.RS_SAMPLE_ADD}">
          <el-form-item>
            <el-button type="primary" style="width: 150px"  class="mini" @click="submitForm('formRules')" :disabled='isSample'><span>保存</span></el-button>
          </el-form-item>
        </el-col>
      </div>
    </el-form>
  </div>
</template>

<script>
import * as p from '../../../utils/province';
import { checkPhoneNum, checkEmail } from '../../../utils/utils'
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    const validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入样本编号'))
      }  else {
        callback()
      }
    }
    return {
      projectId: null,
      isSample: false,
      breadcrumbList: [
        {
          name: '研究对象',
          path: '/sample'
        }, {
          name: '创建研究对象',
        }
      ],
      interviewList: [],
      form: {
        id: '',
        name: '',             //姓名
        code: '',             //样本编码
        gender: '未知',          //性别
        organization: '',     //单位
        birth: '',            //出生日期
        age: '',              //年龄
        mobile: '',           //电话
        weixin: '',           //微信
        phone: '',            //手机
        qq: '',               //qq
        email: '',            //邮箱
        weibo: '',            //weibo
        province: '',         //省
        city: '',             //市
        district: '',         //县
        town: '',             //街道/镇
        address: "",          //详细地址
        marriageStatus: '未知',  //婚姻状况
        education: '未知',       //学历
        politicalStatus: '未知', //政治面貌
        nationality: '未知',     //国籍
        profession: '',       //职业
        position: '',         //职务
        placeOfBirth: '',     //籍贯
        religion: '未知',        //宗教信仰
        language: '未知',        //语言
        dialects: '未知',        //方言
        description: '',      //备注
        detail: '',           //详细介绍
        custom1: '',
        custom2: '',
        custom3: '',
        custom4: '',
        custom5: '',
      },
      formRules: {
        name: [
          { required: true, message: '请填写样本名称', trigger: 'blur' }
        ],
        code: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        phone: [
          // { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          // { validator: validateEmail, trigger: 'blur' }
        ],
      },
      marryList: [
        {
          label: '未知',
          value: '未知'
        },
        {
          label: '未婚',
          value: '未婚'
        },
        {
          label: '已婚',
          value: '已婚'
        },
        {
          label: '再婚',
          value: '再婚'
        },
        {
          label: '离异',
          value: '离异'
        },
        {
          label: '丧偶',
          value: '丧偶'
        }
      ],
      educationList: [
        {
          label: '未知',
          value: '未知'
        },
        {
          label: '没上过学',
          value: '没上过学'
        },
        {
          label: '小学',
          value: '小学'
        },
        {
          label: '初中',
          value: '初中'
        },
        {
          label: '高中',
          value: '高中'
        },
        {
          label: '大学专科',
          value: '大学专科'
        },
        {
          label: '大学本科',
          value: '大学本科'
        },
        {
          label: '研究生及以上',
          value: '研究生及以上'
        }
      ],
      polityList: [
        {
          label: '未知',
          value: '未知'
        },
        {
          label: '群众',
          value: '群众'
        },
        {
          label: '中共党员',
          value: '中共党员'
        },
        {
          label: '民主党派',
          value: '民主党派'
        },
        {
          label: '其他',
          value: '其他'
        }
      ],
      occupationList: [
        {
          label: '教师',
          value: '教师'
        },
      ],
      nationalityList: [
        {
          label: '中国',
          value: '中国'
        },
        {
          label: '美国',
          value: '美国'
        },
        {
          label: '英国',
          value: '英国'
        },
        {
          label: '法国',
          value: '法国'
        },
        {
          label: '日本',
          value: '日本'
        },
        {
          label: '其他外国',
          value: '其他外国'
        },
        {
          label: '未知',
          value: '未知'
        }
      ],
      religionList: [
        {
          label: '未知',
          value: '未知'
        },
        {
          label: '无宗教信仰',
          value: '无宗教信仰'
        },
        {
          label: '佛教',
          value: '佛教'
        },
        {
          label: '基督教',
          value: '基督教'
        },
        {
          label: '伊斯兰教',
          value: '伊斯兰教'
        },
        {
          label: '其他',
          value: '其他'
        }
      ],
      languageList: [
        {
          label: '中文',
          value: '中文'
        },
        {
          label: '英语',
          value: '英语'
        },
        {
          label: '日语',
          value: '日语'
        },
        {
          label: '法语',
          value: '法语'
        },
        {
          label: '德语',
          value: '德语'
        },
        {
          label: '西班牙语',
          value: '西班牙语'
        },
        {
          label: '葡萄牙语',
          value: '葡萄牙语'
        },
        {
          label: '维吾尔语',
          value: '维吾尔语'
        },
        {
          label: '蒙古语',
          value: '蒙古语'
        },
        {
          label: '其他语言',
          value: '其他语言'
        }
      ],
      dialectList: [
        {
          label: '普通话',
          value: '普通话'
        },
        {
          label: '四川话',
          value: '四川话'
        },
        {
          label: '扬州话',
          value: '扬州话'
        },
        {
          label: '上海话',
          value: '上海话'
        },
        {
          label: '其他',
          value: '其他'
        }
      ],
      customName1: null,
      customName2: null,
      customName3: null,
      customName4: null,
      customName5: null,
      provinces: p._parray,
      cities: [],
      dists: [],
      towns: [],
      operation: null,
      useProperty: null,
      fullscreenLoading: true
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
    if (this.$route.query.type) {
      if (this.$route.query.type == 'v') {
        this.operation = 1 //查看状态
      }
      if (this.$route.query.type == 'e') {
        this.operation = 2 // 编辑状态
        this.form.id = this.$route.query.sId
      }
    }
    setTimeout(() => {
      this.fullscreenLoading = false
    }, 1000)
    this.getPropertyCheck()
  },
  computed: {
    ...mapState(['allProperty'])
  },
  methods: {
    getCities(pro) {
      this.form.city = ''
      this.form.district = ''
      this.form.town = ''
      this.dists = []
      this.towns = []
      this.cities = p._data[pro][0]
    },

    getDists(city) {
      this.form.district = ''
      this.form.town = ''
      this.towns = []
      let index = p._data[this.form.province][0].indexOf(city);
      this.dists = p._data[this.form.province][1][index];
    },

    getTowns() {
      this.form.town = ''
      this.towns = []
      this.httpPost(`/sample/get/town`, {
        projectId: this.projectId,
        provinceName: this.form.province,
        cityName: this.form.city,
        distName: this.form.district
      }).then(res => {
        if (res.code == 0) {
          this.towns = res.data;
        }
      })

    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.projectId = this.$route.query.id
          this.form.id = this.$route.query.sId
          this.httpPost('/sample/save', this.form).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.$router.push(`/sample?id=${this.projectId}`)
            } else {
              // this.$message({
              //   type: 'info',
              //   message: res.message
              // })
            }
          })
        } else {
          return false;
        }
      })
    },
    getSample () {
      let param = {
        id: this.$route.query.sId,
        projectId: +this.$route.query.id
      }
      this.httpPost('/sample/detail',param).then(res => {
        if (res.code == 0) {
          if (res.data != null) {
            this.form = res.data
            this.interviewList = this.form.interviewList
          }
        }
      })
    },
    //获取属性管理自定义的来展示表头
    getPropertyCheck () {
      this.httpPost(`/sample/property/check/${this.projectId}`).then(res => {
        if (res.code == 0) {
          this.useProperty = JSON.parse(res.data.useProperty)
          this.allProperty.forEach(item => {
            if (item.key == 'custom1') {
              this.customName1 = item.label + ':'
            } else if (item.key == 'custom2') {
              this.customName2 = item.label + ':'
            } else if (item.key == 'custom3') {
              this.customName3 = item.label + ':'
            } else if (item.key == 'custom4') {
              this.customName4 = item.label + ':'
            } else if (item.key == 'custom5') {
              this.customName5 = item.label + ':'
            }
          })
          if (this.$route.query.type) {
            this.getSample()
          }
        } else {
          this.$message({type: 'error', message: res.message})
        }
      }).catch(error => {
        this.$message({type: 'error', message: error})
      })
    },
    //通过选定的出生日期来计算年龄
    birthChange (e) {
      if (e) {
        let birthYear = Number(e.substring(0,4))
        let currentYear = new Date
        this.form.age = currentYear.getFullYear()-birthYear
      } else {
        this.form.age = ''
      }
    }
  }
}
</script>
<style scoped>
  #sampleAdd >>> .el-form-item--mini .el-form-item__label {
    line-height: 28px;
    font-size: 12px !important;
  }
  #sampleAdd >>> .el-loading-spinner {
    top: 20% !important;
  }
</style>
<style lang='scss' scoped>
  #sampleAdd {
    overflow: hidden;
    div{
      overflow: hidden;
    }
    .box{
      background-color: #f4f4f4;
      border: 1px solid #ccc;
      padding: 10px 10px 0;
      width: 100%;
      margin: 0px 0 20px;
    }
    .wen1{
      color: #EA7272;
    }
    .wen2{
      color: #2e83d3;
    }
    .wen3{
      color: #ED6C11;
    }
    .col{
      color: #2e83d3;
      padding-right: 3px;
      vertical-align: bottom;
    }
    .cc{
      color: #8b8b8b;
      padding-right: 3px;
      vertical-align: baseline;
      font-size: 14px;
    }
    .tit{
      color: #555;
    }
    p {
      font-size: 14px;
      margin-bottom: 20px;
      color: #2e83d3;
      font-weight: bold;
    }
    .txt {
      font-size: 12px;
      color: #606266;
    }
    .select-wid {
      width: 185px;
    }
    .select-wid-add {
      width: 70%;
    }
  }
</style>
