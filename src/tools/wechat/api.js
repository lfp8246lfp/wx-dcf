import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
const baseUrl = 'http://gate.statesky.cn/'
const requestUrl = 'http://116.62.116.120:8004/'
export const GetTicket = (appid) => {
  return Vue.http.post(baseUrl + 'wxqn/mpUserService/getTick',{appid:appid})
    .then((data) => {
      if (data.status === 200) {
        return data.body
      } else {
        return Promise.reject('网络请求错误请稍候再试')
      }
    }).then(({ code, data, msg }) => {
      if (code === 200) {
        return data
      } else if (msg) {
        return Promise.reject(msg)
      }
    })
}

export const FetchWx2Qiniu = (params) => {
  return Vue.http.get(baseUrl + 'service/weixin/QIniu/fetch', { params: params })
    .then((data) => {
      if (data.status === 200) {
        return data.body
      } else {
        return Promise.reject('网络请求错误请稍候再试')
      }
    }).then(({ code, data, msg }) => {
      if (code === 200) {
        return data
      } else if (msg) {
        return Promise.reject(msg)
      }
    })
}

export const GetOpenIdByCode = (params) => {
    return Vue.http.post(baseUrl + 'wxqn/mpUserService/getOpenIdByCode', params )
      .then((data) => {
        if (data.status === 200) {
          return data.body
        } else {
          return Promise.reject('网络请求错误请稍候再试')
        }
      }).then(({ code, data, msg }) => {
        if (code === 200) {
          return data
        } else if (msg) {
          return Promise.reject(msg)
        }
      })
  }
  export const getSubscribeByOpenId = (params) => {
    return Vue.http.post(baseUrl + 'wxqn/mpUserService/getSubscribeByOpenId', params )
      .then((data) => {
        if (data.status === 200) {
          return data.body
        } else {
          return Promise.reject('网络请求错误请稍候再试')
        }
      }).then(({ code, data, msg }) => {
        if (code === 200) {
          return data
        } else if (msg) {
          return Promise.reject(msg)
        }
      })
  }
  
  
  export const GetUserInfoFromWechat = (params) => {
    return Vue.http.get(baseUrl + 'service/weixin/WxAuth/getUserInfo', { params: params })
      .then((data) => {
        if (data.status === 200) {
          return data.body
        } else {
          return Promise.reject('网络请求错误请稍候再试')
        }
      }).then(({ code, data, msg }) => {
        if (code === 200) {
          return data
        } else if (msg) {
          return Promise.reject(msg)
        }
      })
  }
  export const AddUserInfo = (params) => {
    return Vue.http.get(requestUrl + 'service/weixin/PobWxchatInfoService/addPobWxchatInfo', { params: params })
      .then((data) => {
        if (data.status === 200) {
          return data.body
        } else {
          return Promise.reject('网络请求错误请稍候再试')
        }
      }).then(({ code, data, msg }) => {
        if (code === 200) {
          return data
        } else if (msg) {
          return Promise.reject(msg)
        }
      })
  }

  