import * as types from '../mutation-types'
import * as api from '../../api'

const state = {
  data: {
    id: null, // 车辆id
    viPhoto: null // 行驶证照片
  }
}

const getters = {
  car: state => state.data,
  drivCard: state => state.data.viPhoto
}

const mutations = {
  [types.UPDATE_CAR] (state, payload) {
    // 此处必须通过浅拷贝进行赋值，因为vuex无法触发新增的属性
    for (var key in payload) {
      state.data[key] = payload[key]
    }
  },
  [types.UPDATE_DRIVE_CARD] (state, payload) {
    state.data.viPhoto = 'http://omjfwddyl.bkt.clouddn.com/' + payload
  }
}

const actions = {
  // 提交车辆表单，区分创建还是修改逻辑
  async AC_SubmitCarInfo ({ dispatch, commit }, params) {
    if (state.data.id) { // 有id说明getCar取得了数据，此时应调用编辑接口
      params.id = state.data.id
      return dispatch('AC_ModifyCarInfo', params)
    } else { // 无id说明无数据，此时应调用创建接口
      return dispatch('AC_CreateCarInfo', params)
    }
  },
  // 创建车辆信息
  async AC_CreateCarInfo ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.CreateCarInfo(params)
      .then(res => {
        commit(types.UPDATE_CAR, res.carInfo)
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 修改车辆信息
  async AC_ModifyCarInfo ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.ModifyCarInfo(params)// 后端未返更改完数据，为保证修改的表单与后端存储一致，修改完不触动UPDATE_USER，触动重新获取用户数据行为，注意此处可能会存在不一致的bug
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 获取车辆信息
  async AC_GetCarInfo ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetCarInfo(params)
      .then(res => {
        // 一人能有多辆车，查询返回的是数组，但是这里更新数据，选择数组第一个用于测试
        if (res.carInfos && res.carInfos.length === 1) {
          commit(types.UPDATE_CAR, res.carInfos[0])
        }
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 上传行驶证
  async AC_UploadDriveCard ({ dispatch, commit }, params) {
    return dispatch('AC_ChooseAndUploadSingleImage', params).then(res => {
      let targetName = res.success
      commit(types.UPDATE_DRIVE_CARD, targetName)
    })
  }

}

export default {
  state,
  getters,
  mutations,
  actions
}
