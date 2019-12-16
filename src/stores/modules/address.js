import * as types from '../mutation-types'
import * as api from '../../api'

const state = {
  selectAddress: {},
  data: {
    deliveryAddresss: [],
    address: {}
  }
}

const getters = {
  selectAddress: state => state.selectAddress,
  deliveryAddresss: state => state.data.deliveryAddresss,
  currentAddress: state => state.data.address
}

const mutations = {
  UPDATE_ADDRESS (state, payload) {
    state.data.address = payload
  },
  UPDATE_ADDRESS_USERNAME (state, payload) {
    state.data.address.peopleName = payload
  },
  UPDATE_ADDRESS_PHONENUM (state, payload) {
    state.data.address.contactMobile = payload
  },
  UPDATE_ADDRESS_ADDRESS (state, payload) {
    state.data.address.city = payload
  },
  UPDATE_ADDRESS_DETAIL (state, payload) {
    state.data.address.address = payload
  },
  UPDATE_DELIVERY_LIST (state, payload) {
    if (payload) {
      state.data.deliveryAddresss = payload.map(val => {
        val.isDefault = val.isDefault == 'true'
        return val
      })
    } else {
      state.data.deliveryAddresss = []
    }
  },
  UPDATE_SELECT_ADDRESS (state, payload) {
    if (payload) state.selectAddress = payload
  }
}

const actions = {
  async AC_GetDeliveryAddress ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetDeliveryAddress(params)
      .then(res => {
        commit('UPDATE_DELIVERY_LIST', res.deliveryAddresss)
        return res.deliveryAddresss
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_AddDeliveryAddress ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.AddDeliveryAddress(params)
      .then(res => {
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_DeleteDeliveryAddress ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.DeleteDeliveryAddress(params)
      .then(res => {
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_SelectDeliveryAddress ({ dispatch, commit, state }, index) {
    let address = state.data.deliveryAddresss
    for (var i = 0; i < address.length; i++) {
      let item = address[i]
      if (i == index) {
        dispatch('AC_UpdateDeliveryAddress', { id: item.id, isDefault: true })
      } else {
        dispatch('AC_UpdateDeliveryAddress', { id: item.id, isDefault: false })
      }
    }
  },
  async AC_GetSelectAddress ({ dispatch, commit }, params) {
    return dispatch('AC_GetDeliveryAddress', params)
      .then(res => {
        let ret
        if (res) {
          res.forEach(val => {
            if (val.isDefault) {
              ret = val
            }
          })
        }
        commit('UPDATE_SELECT_ADDRESS', ret)
        return ret
      })
  },
  async AC_UpdateDeliveryAddress ({ dispatch, commit, state }, params) {
    // commit('TOGGLE_ADDRESS', params.index)
    commit(types.UPDATE_LOADING, true)
    return api.UpdateDeliveryAddress(params)
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_GetAddress ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetAddress(params)
      .then(res => {
        commit('UPDATE_ADDRESS', res.deliveryAddress)
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
