import * as types from '../mutation-types'
import * as api from '../../api'
import {
  SetOrderStatus,
  UpdateOrder
} from '../../api/index'

const state = {
  order: '',
  term: '',
  termPrice: '',
  bindInfo: {
    idHolder: '',
    idCard: '',
    card: '',
    bankId: '',
    mobile: ''
  },
  orderDetailItems: [],
  batchOrderList: [],
  data: {
    orderList: [],
    bankList: []
  }
}

const getters = {
  order: state => state.order,
  term: state => state.term,
  orders: state => state.data.orderList,
  bankTypeList: state => state.data.bankList,
  bindInfo: state => state.bindInfo,
  termPrice: state => state.termPrice,
  batchOrderList: state => state.batchOrderList,
  orderDetailItems: state => {
    if (state.orderDetailItems) {
      return state.orderDetailItems
    }
  }
}

const mutations = {
  [types.UPDATE_ORDER] (state, payload) {
    state.order = payload
  },
  [types.UPDATE_ORDER_LIST] (state, payload) {
    state.data.orderList = payload
  },
  UPDATE_ORDER_DETAIL_ITEM (state, payload) {
    if (payload) {
      state.orderDetailItems = payload.filter(res => {
        return res.productId
      })
    }
  },
  UPDATE_BANK_INFO_0 (state, payload) {
    state.bindInfo.idHolder = payload.name
    state.bindInfo.idCard = payload.idCard
    state.bindInfo.card = payload.bankCard
  },
  UPDATE_BANK_INFO_1 (state, payload) {
    console.log('payload', payload)
    state.bindInfo.bankId = payload.bankId
    state.bindInfo.mobile = payload.mobile
    // state.smsVerify = payload.smsVerify
  },
  UPDATE_BANK_LIST (state, payload) {
    state.data.bankList = payload
  },
  UPDATE_TERM_LIST (state, payload) {
    state.term = payload
  },
  UPDATE_BATCH_ORDER_LIST (state, payload) {
    let list = []
    payload.forEach(item => {
      if (item.select) list.push(item)
    })
    state.batchOrderList = list
  }
}

const actions = {
  // CRUD
  async AC_SubmitOrderInfo ({
    dispatch,
    commit
  }, params) {
    return dispatch('AC_CreateOrderInfo', params).then(res => {
      params.productList.forEach(val => {
        dispatch('AC_CreateOrderItem', {
          orderId: res.order.id,
          productName: val
        })
      })
    })
  },
  async AC_CreateOrderInfo ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.CreateOrder(params)
      .then(res => {
        commit(types.UPDATE_ORDER, res)
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_CreateOrderItem ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.CreateOrderItem(params)
      .then(res => {
        commit(types.UPDATE_ORDER, res)
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_SetTerm ({
    dispatch,
    commit
  }, params) {
    // commit(types.UPDATE_LOADING, true)
    return api.setTerm(params)
      .then(res => {
        commit('UPDATE_TERM_LIST', params.term)
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // async AC_GetOrderList ({
  //   dispatch,
  //   commit
  // }, params) {
  //   commit(types.UPDATE_LOADING, true)
  //   return api.GetOrderList(params)
  //     .then(res => {
  //       commit(types.UPDATE_ORDER_LIST, res.orders)
  //       commit('UPDATE_TERM_LIST', 6)
  //       return res
  //     })
  //     .catch(err => {
  //       commit(types.UPDATE_TOAST, err)
  //     })
  //     .finally(() => {
  //       commit(types.UPDATE_LOADING, false)
  //     })
  // },
  async AC_CalculateOrderPrice ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.CalculateOrderPrice(params)
      .then(res => {
        commit(types.UPDATE_LOADING, res.order)
        return res.order
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_CalculateRepay ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.CalculateRepay(params)
      .then(res => {
        commit(types.UPDATE_ORDER, res.order)
        return res.order
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // async AC_GetOrder ({
  //   dispatch,
  //   commit
  // }, params) {
  //   commit(types.UPDATE_LOADING, true)
  //   return api.GetOrder(params)
  //     .then(res => {
  //       commit(types.UPDATE_ORDER, res.order)
  //       return res.order
  //     })
  //     .catch(err => {
  //       commit(types.UPDATE_TOAST, err)
  //     })
  //     .finally(() => {
  //       commit(types.UPDATE_LOADING, false)
  //     })
  // },
  async AC_GetOrderDetailItem ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetOrderDetailItem(params)
      .then(res => {
        commit('UPDATE_ORDER_DETAIL_ITEM', res.orderDetailItems)
        return res.orderDetailItems
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_SetOrderStatus ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.SetOrderStatus(params)
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_BindCard ({
    dispatch,
    commit,
    state
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.BindCard(params)
      .then(res => {
        // "transId":"1496263161259"
        if (res.transId) {
          console.log('>>>>>>>>', res.transId)
          return res
        } else {
          return Promise.reject(res.respMsg)
        }
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_ConfirmBind ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.ConfirmBind(params)
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  async AC_FilterOrder ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.FilterOrder(params)
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  async AC_SendPayment ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.SendPayment(params)
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  async AC_SendBatchPayment ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.SendBatchPayment(params)
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  async AC_ConfirmPayment ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    console.log('>>>>>>>>>>>>>params', params)
    return api.ConfirmPayment(params)
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  async AC_ConfirmBatchPayment ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.ConfirmBatchPayment(params)
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  async GetBankList ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetBankList(params)
      .then(res => {
        commit('UPDATE_BANK_LIST', res.bankInfos)
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_CheckOrderStatus ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.CheckOrderStatus(params)
      .then(res => {
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_UpdateOrder ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.UpdateOrder(params)
      .then(res => {
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_SendSignPage ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.SendSignPage(params)
      .then(res => {
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 删除银行卡
  async AC_DeleteCard ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.DeleteCard(params)
      .then(res => {
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 绑定银行卡上传照片
  async AC_UpDateUserInfo ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.UpDateUserInfo(params)
      .then(res => {
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  // 短信跳转
  async AC_GetShortUrl ({
    dispatch,
    commit
  }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetShortUrl(params)
      .then(res => {
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
