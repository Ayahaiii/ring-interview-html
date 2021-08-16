import Cookies from 'vue-cookies'
const state = {
  isLogin: Cookies.get('tokenWeb') ? true : false,
  permission: {},
  allProperty: []
}

export default state
