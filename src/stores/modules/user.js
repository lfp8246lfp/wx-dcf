import * as types from '../mutation-types'
import * as api from '../../api'
import car from './car'
import address from './address'

// 所有使用到的属性必须进行声明，否则可能无法触发新增字段的变化
const state = {
  selectCard: {},
  data: {
    id: null,
    userId: null,
    idCardPhoto: null,        // 身份证正面
    idCardBackPhoto: null,    // 身份证反面
    bankCardPhoto: null,      // 银行卡照片
    anchoredContractPhoto: null,    // 挂靠协议照片
    inviterQRCode: null, // 我的邀请码
    channelId: null, // 渠道号
    interest: null, // 适用利率
    bankList: null, //
    lisencePhoto: null// 营业执照照片
  }
}

const getters = {
  user: state => state.data,
  idCardPhoto: state => state.data.idCardPhoto,
  idCardBackPhoto: state => state.data.idCardBackPhoto,
  bankCard: state => state.data.bankCardPhoto,
  lisencePhoto: state => state.data.lisencePhoto,
  anchProt: state => state.data.anchoredContractPhoto,
  inviterQRCode: state => state.data.inviterQRCode,
  bankList: state => state.data.bankList,
  selectCard: state => state.selectCard
}

const mutations = {
  [types.UPDATE_USER] (state, payload) {
    // 此处必须通过浅拷贝进行赋值，因为vuex无法触发新增的属性
    for (var key in payload) {
      state.data[key] = payload[key]
    }
  },
  [types.UPDATE_IDCARD] (state, payload) {
    state.data.idCardPhoto = 'http://omjfwddyl.bkt.clouddn.com/' + payload
  },
  UPDATE_IDCARD_BACK (state, payload) {
    state.data.idCardBackPhoto = 'http://omjfwddyl.bkt.clouddn.com/' + payload
  },
  [types.UPDATE_BANKCARD] (state, payload) {
    state.data.bankCardPhoto = 'http://omjfwddyl.bkt.clouddn.com/' + payload
  },
  [types.UPDATE_LISENCE] (state, payload) {
    state.data.lisencePhoto = 'http://omjfwddyl.bkt.clouddn.com/' + payload
  },
  [types.UPDATE_PROTOCOL] (state, payload) {
    state.data.anchoredContractPhoto = 'http://omjfwddyl.bkt.clouddn.com/' + payload
  },
  UPDATE_INVITER_QRCODE (state, payload) {
    state.data.inviterQRCode = payload
  },

  UPDATE_CHANNEL (state, payload) {
    state.data.channelId = payload
  },
  UPDATE_BANK_CARD_LIST (state, payload) {
    state.data.bankList = payload
  },
  UPDATE_SELECT_BANK_CARD (state, payload) {
    state.selectCard = payload
  }
}

const actions = {
  // 提交用户表单，这里区分创建还是修改逻辑
  async AC_SubmitUserInfo ({ dispatch, commit, state }, params) {
    if (state.data.id) { // 有id说明getUser取得了数据，此时应调用编辑接口
      params.id = state.data.id // 修改用户数据，多当前用户的id字段
      return dispatch('AC_ModifyUserInfo', params)
    } else { // 无id说明无数据，此时应调用创建接口
      return dispatch('AC_CreateUserInfo', params)
    }
  },
  // 创建用户信息
  async AC_CreateUserInfo ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.CreateUserInfo(params)
      .then(res => {
        commit(types.UPDATE_USER, res.userInfo)
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 修改用户信息
  async AC_ModifyUserInfo ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.ModifyUserInfo(params) // 后端未返更改完数据，为保证修改的表单与后端存储一致，修改完不触动UPDATE_USER，触动重新获取用户数据行为，注意此处可能会存在不一致的bug
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 修改用户信息
  async AC_BindMobile ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.BindMobile(params) // 后端未返更改完数据，为保证修改的表单与后端存储一致，修改完不触动UPDATE_USER，触动重新获取用户数据行为，注意此处可能会存在不一致的bug
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_GetUserSource ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetUserSource(params)
      .then(res => {
        commit('UPDATE_CHANNEL', res.channelId)
        return res.channelId
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  async AC_SendVerifyCode ({ dispatch, commit, state }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.SendVerifyCode(params) // 后端未返更改完数据，为保证修改的表单与后端存储一致，修改完不触动UPDATE_USER，触动重新获取用户数据行为，注意此处可能会存在不一致的bug
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 获取用户信息
  async AC_GetUserInfo ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetUserInfo(params)
      .then(res => {
        // 因为查询返回的是数组，所以这里更新数据，选择数组第一个
        if (res.userInfos && res.userInfos.length >= 1) {
          commit(types.UPDATE_USER, res.userInfos[0])
        }
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  // 获取银行卡信息
  async AC_CardUserInfo ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.CardUserInfo(params)
      .then(res => {
        commit('UPDATE_BANK_CARD_LIST', res.userInfos)
        return res
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },

  // 获取我的邀请码
  async AC_GetInviterQRCode ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetInviterQRCode(params)
      .then(res => {
        commit('UPDATE_INVITER_QRCODE', res.QRUrl)
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_GetInviterCode ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.GetInviterCode(params)
      .then(res => {
        return res.inviterCode
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_EnterInviterCode ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.EnterInviterCode(params)
      .then(res => {
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_AddAdditionalUserAtt ({ dispatch, commit }, params) {
    // commit(types.UPDATE_LOADING, true)
    return api.AddAdditionalUserAtt(params)
      .then(res => {
        return res.additionalUserAtt
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
    // .finally(() => {
    //   commit(types.UPDATE_LOADING, false)
    // })
  },
  async AC_DelAdditionalUserAtt ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.DelAdditionalUserAtt(params)
      .then(res => {
        return res.additionalUserAtts
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  async AC_QueryAdditionalUserAtt ({ dispatch, commit }, params) {
    commit(types.UPDATE_LOADING, true)
    return api.QueryAdditionalUserAtt(params)
      .then(res => {
        return res.additionalUserAtts
      })
      .catch(err => {
        commit(types.UPDATE_TOAST, err)
      })
      .finally(() => {
        commit(types.UPDATE_LOADING, false)
      })
  },
  // 上传身份证
  async AC_UploadIDCard ({ dispatch, commit }, params) {
    return dispatch('AC_ChooseAndUploadSingleImage', params).then(res => {
      let targetName = res.success
      commit(types.UPDATE_IDCARD, targetName)
    })
  },
  // 上传身份证反面
  async AC_UploadIDCardBack ({ dispatch, commit }, params) {
    return dispatch('AC_ChooseAndUploadSingleImage', params).then(res => {
      let targetName = res.success
      commit('UPDATE_IDCARD_BACK', targetName)
    })
  },
  // 上传银行卡
  async AC_UploadBankCard ({ dispatch, commit }, params) {
    return dispatch('AC_ChooseAndUploadSingleImage', params).then(res => {
      let targetName = res.success
      commit(types.UPDATE_BANKCARD, targetName)
    })
  },
  // 上传营业执照
  async AC_UploadBusinessLicence ({ dispatch, commit }, params) {
    return dispatch('AC_ChooseAndUploadSingleImage', params).then(res => {
      let targetName = res.success
      commit(types.UPDATE_LISENCE, targetName)
    })
  },
  // 上传银行卡
  async AC_UploadProtocol ({ dispatch, commit }, params) {
    return dispatch('AC_ChooseAndUploadSingleImage', params).then(res => {
      let targetName = res.success
      commit(types.UPDATE_PROTOCOL, targetName)
    })
  }

}

export default {
  state,
  getters,
  mutations,
  actions,
  modules: {
    car,
    address
  }
}
