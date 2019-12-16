import * as types from '../mutation-types'
import * as api from '../../api'
let defaultCity = '杭州'
try {
    if (localStorage.city) {
        defaultCity = localStorage.city
    }
} catch (e) {

}
const state = {
    city: defaultCity,
    userList:{}
}
const getters = {
    cityList: state => state.city+""+state.city
}
const actions = {
    changeCity(ctx, city) {
        // ctx.commit(types.UPDATE_LOADING, true)
        // ctx.commit(types.UPDATE_TOAST, '成功')
        ctx.commit('changeCity', city)
    },
    async AC_GetTest2({ dispatch, commit }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.GetTest2(params)
          .then(res => {  
            commit('UPDATE_USERLIST', res)
          })
          .catch(err => {
            commit(types.UPDATE_TOAST, err)
          })
          .finally(() => {
            commit(types.UPDATE_LOADING, false)
          })
      },
}
const mutations = {
    changeCity(state, city) {
        state.city = city
        try {
            localStorage.city = city
        } catch (e) {
        }
    },
    UPDATE_USERLIST(state, payload) {
        state.userList = payload
      },
}
export default {
    state,
    getters,
    actions,
    mutations
}