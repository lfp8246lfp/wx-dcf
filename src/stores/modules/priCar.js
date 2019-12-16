import * as types from '../mutation-types'
import * as api from '../../api'

const state = {
  errorMessage: '',
  data: {
    selectInsType: '8,9,2,194,4,197',  // 已选险种列表id
    selectCom: '',      // 自动报价选择的报价公司
    checkPrice: '',     // 续保车辆信息
    companyPrice: '',   // 未知，检测之后无用可删除
    returnCode: ''      // post和get获取到的成功信息。
  }
}

const getters = {
  selectInsType: state => state.data.selectInsType,
  selectCom: state => state.data.selectCom,
  checkPrice: state => state.data.checkPrice,
  errorMessage: state => state.errorMessage,
  companyPrice: state => state.companyPrice,
  returnCode: state => state.data.returnCode
}

const mutations = {
  SELECT_INSR_TYPE (state, payload) {
    state.data.selectInsType = payload
  },
  UPDATE_INSR_TYPE (state, payload) {
    state.data.selectInsType = state.data.selectInsType.replace('8,9,', '')
  },
  SELECT_COM (state, payload) {
    state.data.selectCom = payload
  },
  UPDATE_INSURANCE (state, payload) {
    state.data.checkPrice = payload
  },
  UPDATE_COMPANYPRICE (state, payload) {
    state.data.companyPrice = payload
  },
  UPDATE_CODE (state, payload) {
    state.data.returnCode = payload
  },
  UPDATE_ERROR_DIALOG (state, payload) {
    state.errorMessage = payload
  },
  DELItE_ERROR_DIALOG (state, payload) {
    state.errorMessage = ''
  }
}

const actions = {

  async AC_QueryBihuCityCode ({
    dispatch,
    commit,
    state
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.QueryBihuCityCode(params)
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  // 异步获取续保信息
  async AC_GetReinfo ({
    dispatch,
    commit,
    state
  }, params) {
    commit(types.UPDATE_LOADING, false)
    return api.GetReinfo(params).then(res => {
      return dispatch('AC_GetAsyncResult', { taskId: res.taskId })
    })
  },

  // 获取续保信息结果
  async AC_GetAsyncResult ({
    dispatch,
    commit,
    state
  }, params) {
    return api.GetAsyncResult(params).then(res => {
      if (res.returnCode == 'executing') {
        setTimeout(() => {
          dispatch('AC_GetAsyncResult', params)
        }, 2000)
      } else if (res.returnCode == 'error') {
        commit('UPDATE_ERROR_DIALOG', res.errorMsg)
        commit(types.UPDATE_LOADING, false)
      } else {
        commit('UPDATE_INSURANCE', res)
        commit(types.UPDATE_LOADING, false)
      }
    }).catch(err => {
      alert(err)
    })
  },

  // 异步提交报价请求
  async AC_PostPrice ({
    dispatch,
    commit,
    state
  }, params) {
    commit(types.UPDATE_LOADING, false)
    return api.PostPrice(params).then(res => {
      return dispatch('AC_PostAsyncPrice', { taskId: res.taskId })
    })
  },

  // 异步获取AC_PostPrice结果。
  async AC_PostAsyncPrice ({
    dispatch,
    commit,
    state
  }, params) {
    return api.GetAsyncResult(params).then(res => {
      if (res.returnCode == 'executing') {
        setTimeout(() => {
          dispatch('AC_PostAsyncPrice', params)
        }, 1000)
      } else if (res.returnCode == 'success') {
        commit('UPDATE_CODE', res)
      } else if (res.returnCode == 'error') {
        commit('UPDATE_ERROR_DIALOG', res.errorMsg)
        commit(types.UPDATE_LOADING, false)
      }
    }).catch(err => {
      alert(err)
    })
  },

  // 异步获取每个保险公司的异步请求
  async AC_GetPrice ({
    dispatch,
    commit,
    state
  }, params) {
    commit(types.UPDATE_LOADING, false)
    return api.GetPrice(params).then(res => {
      return dispatch('AC_GetAsyncPrice', { taskId: res.taskId })
    })
  },

  // 异步获取AC_GetPrice结果。
  async AC_GetAsyncPrice ({
    dispatch,
    commit,
    state
  }, params) {
    return api.GetAsyncResult(params).then(res => {
      if (res.returnCode == 'executing') {
        setTimeout(() => {
          dispatch('AC_GetAsyncPrice', params)
        }, 4000)
      } else if (res.returnCode == 'success') {
        commit('UPDATE_CODE', res)
      }
    }).catch(err => {
      alert(err)
    })
  }

}

export default {
  state,
  getters,
  mutations,
  actions
}
