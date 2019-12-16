import * as types from '../mutation-types'
import * as api from '../../api'
const state = {
  chooseCompany: '',    // 人工报价选中的公司。
  chooseInsurance: '',  // 保险类型的id
  data: {
    productList: [],    // 险种列表
    companyList: [],    // 公司列表
    insuranceTypes: [] // 获取险种类型：全额险，商业险
  }
}

const getters = {
  chooseCompany: state => state.chooseCompany,
  chooseInsurance: state => state.chooseInsurance,
  products: state => {
    return state.data.productList
  },
  companys: state => state.data.companyList.map(val => {
    return val.name
  }),
  insuranceTypes: state => state.data.insuranceTypes.map(val => {
    return val.name
  })
}

const mutations = {
  UPDATE_COMPANY_LIST (state, payload) {
    state.data.companyList = payload
  },
  UPDATE_PRODUCT_LIST (state, payload) {
    state.data.productList = payload
  },
  UPDATE_INSURANCE_TYPE (state, payload) {
    state.data.insuranceTypes = payload
  },
  UPDATE_CHOOSE_COMPANY (state, payload) {
    state.chooseCompany = payload
  },
  UPDATE_CHOOSE_INSURANCE (state, payload) {
    state.chooseInsurance = payload
  }
}

const actions = {
  // 批量下单
  async AC_SubmitBatchProduct ({ dispatch, commit, state }, params) {
    return dispatch('AC_GetInsuranceId', params.insuranceType).then(insuranceId => {
      return dispatch('AC_GetCompanyId', params.company).then(companyId => {
        return {
          userId: params.userId,
          insCorp: companyId,
          insProduct: insuranceId,
          insTypeList: params.productIds,
          carType: params.carType,
          lisencePhoto: params.lisencePhoto,
          viPhotos: params.viPhotos,
          idCardPhoto: params.idCardPhoto,
          idCardBackPhoto: params.idCardBackPhoto
        }
      })
    }).then(res => {
      return dispatch('AC_QueryUserChannel', { userOpenid: params.userId }).then(ret => {
        if (ret && ret.userChannels) {
          let channel = ret.userChannels[0]
          if (channel && channel.channelId) {
            res.distributeId = channel.channelId
          }
        }
        return res
      })
    }).then(params => {
      return dispatch('AC_PlaceBatchOrder', params)
    })
  },

  // 报价下单
  async AC_SubmitProduct ({ dispatch, commit, state }, params) {
    return dispatch('AC_GetInsuranceId', params.insuranceType).then(insuranceId => {
      return dispatch('AC_GetCompanyId', params.company).then(companyId => {
        return {
          userId: params.userId,
          carId: params.carId,
          insCorp: companyId,
          insProduct: insuranceId,
          insTypeList: params.productIds,
          carType: params.carType,
          lisencePhoto: params.lisencePhoto,
          viPhoto: params.viPhoto,
          idCardPhoto: params.idCardPhoto,
          idCardBackPhoto: params.idCardBackPhoto
        }
      })
    })
      .then(res => {
        return dispatch('AC_QueryUserChannel', { userOpenid: params.userId }).then(ret => {
          if (ret && ret.userChannels) {
            let channel = ret.userChannels[0]
            if (channel && channel.channelId) {
              res.distributeId = channel.channelId
            }
          }
          return res
        })
      })
      .then(params => {
        return dispatch('AC_PlaceOrder', params)
      })
  },
  // 获取保险公司的id
  async AC_GetCompanyId ({ dispatch, commit, state }, params) {
    let id = ''
    let list = state.data.companyList
    for (var i = 0; i < list.length; i++) {
      let item = list[i]
      if (item.name !== params) {
        continue
      } else {
        id = item.id
      }
    }
    if (id) {
      commit('UPDATE_CHOOSE_COMPANY', params)
      return Promise.resolve(id)
    } else {
      return Promise.reject('请选择保险公司')
    }
  },
  // 获取商业险分期或者全额险的id
  async AC_GetInsuranceId ({ dispatch, commit, state }, params) {
    let id = ''
    let list = state.data.insuranceTypes
    list.forEach((item) => {
      if (item.name == params) id = item.id
    })
    commit('UPDATE_CHOOSE_INSURANCE', params)
    return Promise.resolve(id)
  },
  // 报价下单api
  async AC_PlaceOrder ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.PlaceOrder(params)
      .then(res => {
        // commit('UPDATE_INSURANCE_TYPE', res.insPros)
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 批量下单api
  async AC_PlaceBatchOrder ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.PlaceBatchOrder(params)
      .then(res => {
        return res
      }).catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_LoanOrder ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.LoanOrder(params)
      .then(res => {
        // commit('UPDATE_INSURANCE_TYPE', res.insPros)
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 获取渠道id
  async AC_QueryUserChannel ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.QueryUserChannel(params)
      .then(res => {
        // commit('UPDATE_INSURANCE_TYPE', res.insPros)
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_GetProductValueList ({ dispatch, commit, state }, params) {
    let res = state.data.productList.reduce((total, current) => {
      if (current.name === params) {
        total.push(current)
      }
      return total
    }, [])
    return res
  },
  async AC_GetInsuranceType ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetInsuranceType(params)
      .then(res => {
        commit('UPDATE_INSURANCE_TYPE', res.insPros)
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_GetCompanyList ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetCompanyList(params)
      .then(res => {
        commit('UPDATE_COMPANY_LIST', res.insuranceCorps)
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_GetProductList ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetProductList(params)
      .then(res => {
        commit('UPDATE_PRODUCT_LIST', res.insuranceTypes)
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
