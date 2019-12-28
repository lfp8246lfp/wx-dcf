import Vue from 'vue'
import * as types from './mutation-types'

export default {
  [types.UPDATE_TOAST] (state, msg) {
    // alert(msg)
    if (msg!=null) {
      Vue.$vux.toast.show({
        type: 'text',
        text: msg,
        position: 'center',
        width: '15em',
        time: '3000',
      })
    } else {
      Vue.$vux.toast.hide()
    }
  },

  [types.UPDATE_LOADING] (state, isLoading) {
    if (isLoading) {
      Vue.$vux.loading.show({
        text: '正在加载中'
      })
    } else {
      Vue.$vux.loading.hide()
    }
  },
  [types.GET_NEW_DATA] (state, { code, data, msg }) {

  },

  [types.NEXT_STEP] (state) {
    state.step += 1
  },

  UPDATE_STEP (state, step) {
    state.step = step
  },

  PREV_STEP (state) {
    state.step -= 1
  },

  [types.CLEAR_STEP] (state) {
    state.step = 0
  },

  [types.UPDATE_TOKEN] (state, token) {
    state.token = token
  },

  [types.UPDATE_USER_FROM_WECHAT] (state, params) {
    state.userFromWechat = params
  },

  balanceChange (state, params) {
    state.balance = params
  },

  changeRoom (state, params) {
    state.roomid = params
  }
}
