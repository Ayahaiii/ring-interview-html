/* eslint-disable */
const mutations = {
  setPermission (state, payload) {
    state.permission[payload.id] = payload.permission
  },
  setState (state, payload) {
    state.permission = payload.permission
  },
  setAllProperty (state, payload) {
    state.allProperty = payload.allProperty
  },
  setLoginStatus(state, payload) {
    state.isLogin = payload.status
  }
}

export default mutations
