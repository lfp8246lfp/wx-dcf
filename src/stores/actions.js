import wechat from '../tools/wechat'

// 获取微信的token
export const AC_GetTokenFromWechat = ({ dispatch, commit, state }) => {
  if (state.token.openid) { // 内存中存在，取内存
    console.log('get token from 内存!')
    return Promise.resolve(state.token)
  } else { // 内存不存在，取网络
    console.log('get token from 网络!')
    return wechat.getOpenId().then(res => {
      commit('UPDATE_TOKEN', res)
      alert(JSON.stringify(res))
      return Promise.resolve(res)
    })
  }
}

// 获取微信用户信息
export const AC_GetUserInfoFromWechat = ({ dispatch, commit }) => {
  return dispatch('AC_GetTokenFromWechat').then((token) => {
    return wechat.getUserInfo(token)
  }).then((res) => {
    commit('UPDATE_USER_FROM_WECHAT', res)
    return Promise.resolve(res)
  }).catch(err => {
    console.log('wechat/index.js出错-----', err)
  })
}
// jssdk预览照片
export const AC_PreviewImage = ({ dispatch, commit }, params) => {
  return wechat.previewImg(params)
}
// jssdk选择照片
export const AC_ChooseImage = ({ dispatch, commit }, params) => {
  return wechat.chooseImg(params)
}
// jssdk上传照片
export const AC_UploadImage = ({ dispatch, commit }, params) => {
  return wechat.uploadImg(params)
}
// 选择上传照片并抓区资源
export const AC_ChooseAndUploadSingleImage = ({ dispatch, commit }, params) => {
  return dispatch('AC_ChooseImage', {// 选择图片，单图
    count: 1,
    sizeType: ['original'],
    sourceType: ['album', 'camera']
  }).then(res => {
    let localId = res.localIds.toString()
    return dispatch('AC_UploadImage', {// 上传图片，单图
      localId: localId,
      isShowProgressTips: 1
    })
  })
}

// 选择上传多张照片并抓取资源
export const AC_ChooseAndUploadMultiImage = ({ dispatch, commit }, params) => {
  return dispatch('AC_ChooseImage', {// 选择图片，单图
    count: 9,
    sizeType: ['original'],
    sourceType: ['album', 'camera']
  }).then(res => {
    let localIds = res.localIds
    for (let i = 0; i < localIds.length; i++) {
      return dispatch('AC_UploadImage', {// 上传图片，单图
        localId: localIds[i],
        isShowProgressTips: 0
      })
    }
  })
}
