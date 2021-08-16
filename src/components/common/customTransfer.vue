<template>
  <div class="shuttle">
    <!-- 全部属性 -->
    <div class="shuttle_item">
      <div class="shuttle_title">
        <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="checkAllProperty">全部属性</el-checkbox>
      </div>
      <div class="shuttle_group">
        <el-checkbox-group v-model="propertyNames" @change="handleCheckedProperty">
          <el-checkbox v-for="(item, index) in allProperty" :label="item.key" :key="'all'+index" :disabled="item.disabled" :checked="false"> {{item.label}} </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <!-- 项目使用属性 -->
    <div class="shuttle_item">
      <div class="shuttle_title">
        <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="checkAllProject">项目使用属性</el-checkbox>
      </div>
      <div class="shuttle_group">
        <el-checkbox-group v-model="teamName" @change="handleCheckedProject">
          <el-checkbox  v-for="item in allTeam" :label="item.key" :key="item.key" :disabled="item.disabled" :checked="item.checked">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <!-- 列表显示属性 -->
    <div class="shuttle_item">
      <div class="shuttle_title">
        <el-checkbox :indeterminate="isIndeterminate3" v-model="checkAll3" @change="checkAllList">列表显示属性</el-checkbox>
      </div>
      <div class="shuttle_group">
        <el-checkbox-group v-model="teamLeader" @change="handleCheckedList">
          <el-checkbox v-for="item in leader" :label="item.key" :key="item.key" :disabled="item.disabled" :checked="item.checked">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <!-- 样本标识 -->
    <div class="shuttle_item">
      <div class="shuttle_title">
        <el-checkbox :indeterminate="isIndeterminate4" v-model="checkAll4" @change="checkAllSample">样本标识</el-checkbox>
      </div>
      <div class="shuttle_group">
        <el-checkbox-group v-model="sampleName" @change="handleCheckedSample">
          <el-checkbox v-for="item in sampleIdentify" :label="item.key" :key="item.key" :disabled="item.disabled" :checked="item.checked">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    name: "shuttle",
    data() {
      return {
        // allProperty: [], //全部属性
        allTeam: [
          { key: 'name', label: '样本名称', disabled: true, checked: true },
          { key: 'code', label: '研究编号', disabled: true, checked: true },
        ],  //项目使用属性
        leader:[
          { key: 'name', label: '样本名称', disabled: true, checked: true },
          { key: 'code', label: '研究编号', disabled: true, checked: true },
        ],// 列表显示属性
        sampleIdentify: [
          { key: 'name', label: '样本名称', disabled: true, checked: true },
          { key: 'code', label: '研究编号', disabled: true, checked: true },
        ], //样本标识
        propertyNames: [],   //全部属性 选中的
        teamName: [],   //项目使用属性  选中的
        teamLeader: [],   //列表显示属性  选中的
        sampleName: [], //样本标识  选中的
        checkAll1: false,         //全部属性 全选
        isIndeterminate1: true,   //全部属性 全选
        checkAll2: false,         //项目使用属性 全选
        isIndeterminate2: true,   //项目使用属性 全选
        checkAll3: false,         //列表显示属性 全选
        isIndeterminate3: true,   //列表显示属性 全选
        checkAll4: false,         //样本标识 全选
        isIndeterminate4: true    //样本标识 全选
      }
    },
    created() {
    },
    computed: {
      ...mapState(['allProperty']),
    },
    mounted() {

    },
    watch: {
      allTeam () {
        this.toRightLeader()
      },
      leader () {
        this.toRightSample()
      }
    },
    methods: {
      getResult(data) {
        if (data != null && data.useProperty != null) {
          let useArr = JSON.parse(data.useProperty)
          let obj = ['name', 'code']
          this.propertyNames = useArr
          this.allTeam = this.allProperty.filter(item => {
            return useArr.indexOf(item.key) != -1
          })
          let listArr = JSON.parse(data.listProperty)
          this.teamName = obj.concat(listArr)
          this.leader = this.allProperty.filter(item => {
            return listArr.indexOf(item.key) != -1
          })

          let markArr = JSON.parse(data.markProperty)
          this.teamLeader = obj.concat(markArr)
          this.sampleIdentify = this.allProperty.filter(item => {
            return markArr.indexOf(item.key) != -1
          })
        }

      },

      // 全部 -> 项目
      async toRightTeam() {
        let selArr = await this.handleSelArr(this.propertyNames)
        let list = await this.matching(this.allProperty, selArr)
        let defaultList = [
          { key: 'name', label: '样本名称', disabled: true, checked: true },
          { key: 'code', label: '样本编号', disabled: true, checked: true },
        ]
        this.allTeam = defaultList.concat(list)
        this.putParentList()
      },
      //项目 -> 列表
      async toRightLeader() {
        let selArr = await this.handleSelArr(this.teamName)
        let list = await this.matching(this.allTeam, selArr)
        let defaultList = [
          { key: 'name', label: '样本名称', disabled: true, checked: true },
          { key: 'code', label: '样本编号', disabled: true, checked: true },
        ]
        this.leader = defaultList.concat(list)
        this.putParentList()
      },
      // 列表 -> 样本
      async toRightSample() {
        let selArr = await this.handleSelArr(this.teamLeader)
        let list = await this.matching(this.leader, selArr)
        let defaultList = [
          { key: 'name', label: '样本名称', disabled: true, checked: true },
          { key: 'code', label: '样本编号', disabled: true, checked: true },
        ]
        this.sampleIdentify = defaultList.concat(list)
        this.putParentList()
      },
      //  匹配 移动的 选项
      matching(allArr, matchArr) {
        let matArr = [];
        for (let i = 0; i < allArr.length; i++) {
          for (let j = 0; j < matchArr.length; j++) {
            if (allArr[i].key == matchArr[j]) {
              matArr.push(allArr[i])
            }
          }
        }
        return matArr
      },
      //去重
      unique (arr) {
        let newArr = [];
        for(let i = 0; i < arr.length; i++){
          if(newArr.indexOf(arr[i]) == -1){
            newArr.push(arr[i])
          }
        }
        return newArr
      },

      //处理禁用选中数组
      async handleSelArr (selArr) {
        let arr = ['name', 'code']
        let list = []
        await selArr.forEach(item => {
          if (arr.indexOf(item) == -1) {
            list.push(item)
          }
        })
        return list
      },

      // 处理 取消前一个数组中checkbox时后一个数组中如果checkbox选中了则取消
      handleCheckedArr (list1, list2) {
        let obj = []
        for (let i = 0; i < list2.length; i++) {
          for (let j = 0; j < list1.length; j++) {
            if (list2[i] == list1[j]) {
              obj.push(list2[i])
            }
          }
        }
        return obj
      },
      // 全部属性 check操作
      async checkAllProperty(val) {
        if (val) {
          let _this = this
          this.allProperty.forEach(item => {
            if (!item.disabled) {
              _this.propertyNames.push(item.key)
              _this.propertyNames = _this.unique(_this.propertyNames)
            }
          })
        } else {
          this.propertyNames = ['name', 'code']
        }
        this.isIndeterminate = false
        this.teamName = await this.handleCheckedArr(this.propertyNames, this.teamName)
        this.toRightTeam()
      },
      async handleCheckedProperty(value) {
        let checkedCount = value.length;
        this.checkAll1 = checkedCount === this.allProperty.length;
        this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.allProperty.length
        this.teamName = await this.handleCheckedArr(value, this.teamName)
        this.toRightTeam()
      },
      //项目使用 check操作
      async checkAllProject (val) {
        if (val) {
          let _this = this
          this.allTeam.forEach(item => {
          _this.teamName.push(item.key)
          _this.teamName = _this.unique(_this.teamName)
        })
        } else {
          this.teamName = ['name', 'code']
        }
        this.isIndeterminate2 = false
        this.teamLeader = await this.handleCheckedArr(this.teamName, this.teamLeader)
        this.toRightLeader()
      },
      async handleCheckedProject(value) {
        let checkedCount = value.length
        this.checkAll2 = checkedCount === this.allTeam.length
        this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.allTeam.length
        this.teamLeader = await this.handleCheckedArr(value, this.teamLeader)
        this.toRightLeader()
      },
      //列表显示属性 check操作
      async checkAllList (val) {
        if (val) {
          let _this = this
          this.leader.forEach(item => {
           _this.teamLeader.push(item.key)
           _this.teamLeader = _this.unique(_this.teamLeader)
        })
        } else {
          this.teamLeader = []
        }
        this.isIndeterminate3 = false
        this.sampleName = await this.handleCheckedArr(this.teamLeader, this.sampleName)
        this.toRightSample()
      },
      async handleCheckedList(value) {
        let checkedCount = value.length;
        this.checkAll3 = checkedCount === this.leader.length;
        this.isIndeterminate3 = checkedCount > 0 && checkedCount < this.leader.length
        this.sampleName = await this.handleCheckedArr(value, this.sampleName)
        this.toRightSample()
      },
      async putParentList () {
        this.$emit('saveLists', this.allTeam, this.leader, this.sampleIdentify)
      },
      //样本标识 check操作
      checkAllSample (val) {
        if (val) {
          let _this = this
          this.sampleIdentify.forEach(item => {
           _this.sampleName.push(item.key)
        })
        } else {
          this.sampleName = []
        }
        this.isIndeterminate4 = false;
      },
      handleCheckedSample(value) {
        let checkedCount = value.length;
        this.checkAll4 = checkedCount === this.sampleIdentify.length;
        this.isIndeterminate4 = checkedCount > 0 && checkedCount < this.sampleIdentify.length;
      },
    },

  }
</script>
<style scoped>
.shuttle >>> span.el-checkbox__label {
  font-size: 12px !important;
  margin-bottom: 5px;
}
.shuttle >>> label.el-checkbox {
  display: block !important;
}
</style>
<style lang="scss" scoped>

  .shuttle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .shuttle_title {
      padding: 10px 0 10px 10px;
      background-color: #f5f7fa;
      border-radius: 5px 5px 0 0;
      font-size: 13px;
    }
    .shuttle_item {
      width: 20%;

      span {
        font-size: 16px;
        margin-left: 50px;
      }
    }

    .shuttle_arrow {
      width: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 30px 0 20px;

      .go_left {
        margin-left: 0;
      }
    }

    .shuttle_group {
      border: 1px solid #F1F1F1;
      padding: 0 10px;
      border-radius:0 0 5px 5px;
      height: 250px;
      overflow-y: auto;
      label{
        font-size: 12px !important;
        color: #606266;
      }
      li {
        padding-top: 10px;
      }
    }
  }
</style>
