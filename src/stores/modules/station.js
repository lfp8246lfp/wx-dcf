import * as types from '../mutation-types'
import * as api from '../../api'
import Api from '../../api/Piles'
try {
  if (localStorage.getItem('selectStation')) {
    var defaultSelectStation = JSON.parse(localStorage.getItem('selectStation'))
  }
  if (localStorage.getItem('selectScoket')) {
    var defaultSelectScoket = JSON.parse(localStorage.getItem('selectScoket'))
  }
  if (localStorage.getItem('priceList')) {
    var defaultPriceList = JSON.parse(localStorage.getItem('priceList'))
  }
} catch (e) { }
const state = {

  stationInfo: {
    areaname: ["浙江省", "杭州市"],
    chargingName:'',
    pageNum: 1,
    pageSize: 6
  },
  stationList: [],
  selectStation: defaultSelectStation || {},
  socketInfo: {
    objectid: null
  },
  socketList: [],
  selectScoket: defaultSelectScoket || {},
  priceInfo: {
    objectid: null
  },
  priceList: defaultPriceList || [],



}
const getters = {
  stationInfo: state => {
    let stationInfo = {
      areaname: state.stationInfo.areaname[1],
      chargingName:state.stationInfo.chargingName,
      pageNum: state.stationInfo.pageNum,
      pageSize: state.stationInfo.pageSize
    }
    return stationInfo
  },
  stationList: state => state.stationList,
  selectStation: state => state.selectStation,
  socketInfo: state => state.socketInfo,
  socketList: state => state.socketList,
  selectScoket: state => state.selectScoket,
  priceInfo: state => state.priceInfo,
  priceList: state => state.priceList,

}
const mutations = {
  Update_city(state, payload) {
    state.stationInfo.areaname = payload
  },
  Update_chargingName(state, name) {
    console.log(name);
    state.stationInfo.chargingName = name
  },
  Clear_StationPageNum(state) {
    state.stationInfo.pageNum = 1
  },
  UPDATE_StationPageNum(state) {
    state.stationInfo.pageNum++
  },
  UPDATE_StationList(state, payload) {
    if (payload) {
      if (state.stationInfo.pageNum == 1) {
        state.stationList = payload.map(val => {
          return val
        })
      } else {
        state.stationList = state.stationList.concat(payload)
      }
    } else {
      state.stationList = []
    }
  },
  UPDATE_SelectStation(state, payload) {
    state.selectStation = payload
    try {
      localStorage.setItem('selectStation', JSON.stringify(payload))
    } catch (e) { }
  },
  UPDATE_SelectScoket(state, payload) {
    state.selectScoket = payload
    try {
      localStorage.setItem('selectScoket', JSON.stringify(payload))
    } catch (e) { }

  },
  UPDATE_SocketList(state, payload) {
    if (payload) {
      state.socketList = payload.map(val => {
        return val
      })
    } else {
      state.socketList = []
    }

  },
  UPDATE_PriceList(state, payload) {
    if (payload) {
      state.priceList = payload.map(val => {
        return val
      })
    } else {
      state.priceList = []
    }
    try {
      localStorage.setItem('priceList', JSON.stringify(payload))
    } catch (e) { }


  },

}
const actions = {
  async AC_GetShowInfo({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return Api.GetShowInfo(params)
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
  async AC_GetStationList({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetStationList(params)
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
  async AC_GetSocketList({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetSocketList(params)
      .then(res => {
        commit('UPDATE_SocketList', res.listitem)
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },async AC_GetSocketList2({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetSocketList(params)
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
  async AC_GetPriceList({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetPriceList(params)
      .then(res => {
        commit('UPDATE_PriceList', res.listitem)
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_GetCharging({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetCharging(params)
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
  async AC_SinglePluginfo({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return Api.SinglePluginfo(params)
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
  async AC_GetInfo({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return Api.GetChatBandInfo(params)
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

}
export default {
  state,
  getters,
  actions,
  mutations
}