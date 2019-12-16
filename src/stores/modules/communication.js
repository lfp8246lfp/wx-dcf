import api from '../../api/Piles'
const state = {}

const getters = {}

const mutations = {}

const actions = {
    async AC_SendCharing({ dispatch, commit }, params) {
        return api.SendCharing(params)
            .then(res => {
                return res
            })
            .catch(err => {
            })
            .finally(() => {
            })
    },
    async AC_ReceiveCharing({ dispatch, commit }, params) {
        return api.ReceiveCharing(params)
            .then(res => {
                return res
            })
            .catch(err => {
            })
            .finally(() => {
            })
    },

}
export default {
    state,
    getters,
    actions,
    mutations
}