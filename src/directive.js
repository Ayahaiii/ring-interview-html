import Vue from 'vue'
import Constant from './utils/limit'
import store from './store'
import { httpPost } from './utils/httpService'

Vue.directive('permission', {
  async inserted (el, binding) {
    const permissionList = store.state.permission
    const projectId = binding.value.projectId
    const permissionId = binding.value.permissionId

    if (!permissionList[projectId]) {
      let targetProjectPermission = await getPermission(projectId)
      store.commit('setPermission', {
        id: projectId,
        permission: targetProjectPermission
      })
    }

    if (permissionList[projectId].indexOf(Constant.R_ALL) == -1 && permissionList[projectId].indexOf(permissionId) == -1) {
      el.remove()
    }
  }
})

Vue.directive('defaultSelect', {
  componentUpdated (el, bindings, vnode) {
    // values v-model 绑定值
    // options 下拉选项
    // prop 对应 options 中 的 value 属性
    // defaultProp 默认值判断属性
    // defaultValue 默认值判断值
    const [values, options, prop, defaultProp, defaultValue] = bindings.value
    // 需要隐藏的标签索引
    const indexs = []
    if (options.length > 0) {
      const tempData = values.map(a => options.find(op => op[prop] === a))
      tempData.forEach((a, index) => {
        if (a) {
          if (a[defaultProp] === defaultValue) indexs.push(index)
        }
      })
      const dealStyle = function (tags) {
        tags.forEach((el, index) => {
          if (indexs.includes(index) && ![...el.classList].includes('select-tag-close-none')) {
            el.classList.add('none')
          }
        })
      }
      // 设置样式 隐藏close icon
      const tags = el.querySelectorAll('.el-tag__close')
      if (tags.length === 0) {
        // 初始化tags为空处理
        setTimeout(() => {
          const tagTemp = el.querySelectorAll('.el-tag__close')
          dealStyle(tagTemp)
        })
      } else {
        dealStyle(tags)
      }
    }
  }
})

let getPermission = function(id) {
  // 调用接口获取项目权限,模拟获取数据
  return new Promise(resolve => {
    setTimeout(() => {
      let permissionList = []
      httpPost('/project/permission/' + id).then(res => {
        permissionList = res.data
        resolve(permissionList)
      })
    }, 500)
  })
}
