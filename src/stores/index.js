import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'
import createLogger from 'vuex/dist/logger'
import user from './modules/user'
import order from './modules/order'
// import cart from './modules/cart'
import product from './modules/product'
import priCar from './modules/priCar'

import vxTest from './modules/vxTest'
import station from './modules/station'
import aboutMe from './modules/aboutMe'
import communication from './modules/communication'
import operator from './modules/operator'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  step: 0,
  token: {
    openid: 'guotianTEST'
  },
  userFromWechat: {
    nickname: '',
    city: '',
    province: '',
    headimgurl: ''
  },
  balance: 0,
    // 余额
  roomid: 0
    // 选择房间的roomid
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    user,
    order,
    product,
    priCar,
   
    vxTest,
    station,
    aboutMe,
    communication,
    operator

  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
