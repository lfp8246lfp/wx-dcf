import * as types from '../mutation-types'
import api from '../../api/Piles'
try {
    if (localStorage.getItem('selectAlarmItem')) {
        var defaultSelectAlarmItem = JSON.parse(localStorage.getItem('selectAlarmItem'))
    }
    if (localStorage.getItem('operatorUserItem')) {
        var defaultOperatorUserItem = JSON.parse(localStorage.getItem('operatorUserItem'))
    }
    if (localStorage.getItem('alarmInfo')) {
        var defaultAlarmInfo = JSON.parse(localStorage.getItem('alarmInfo'))
    }
} catch (e) {}
const state = {
    selectAlarmItem : defaultSelectAlarmItem || {},
    operatorUserItem: defaultOperatorUserItem || {
        accountid: "",
        password : null
    },
    alarmInfo: defaultAlarmInfo || {
        starttime  : "",
        endtime    : "",
        eventitemid: 0
    }
}
const getters = {
    selectAlarmItem : state => state.selectAlarmItem,
    operatorUserItem: state => state.operatorUserItem,
    alarmInfo       : state => state.alarmInfo
}
const mutations = {
    UPDATE_AlarmInfo(state, payload) {
        state.alarmInfo = payload
        try {
            localStorage.setItem('alarmInfo', JSON.stringify(payload))
        } catch (e) {}
    },
    UPDATE_SelectAlarmItem(state, payload) {
        state.selectAlarmItem = payload
        try {
            localStorage.setItem('selectAlarmItem', JSON.stringify(payload))
        } catch (e) {}
    },
    UPDATE_OperatorUserItem(state, payload) {
        state.operatorUserItem = payload
        try {
            localStorage.setItem('operatorUserItem', JSON.stringify(payload))
        } catch (e) {}

    }


}
const actions = {
    async AC_OperatorLogin({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.OperatorLogin(params)
            .then(res => {
                if (res.data.success == "1") {
                        localStorage.setItem("operatorUserItem", JSON.stringify(res.data));
                        commit(types.UPDATE_TOAST, "授权成功")
                } else if (res.data.success == "0") {
                    commit(types.UPDATE_TOAST, "账号不存在")
                } else {
                    commit(types.UPDATE_TOAST, "密码错误")
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
    
    async AC_OperatorLoginChange({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.OperatorLogin(params)
            .then(res => {
                if (res.data.success == "1") {
                    localStorage.setItem("operatorData", JSON.stringify(res.data));
                } else if (res.data.success == "0") {
                    commit(types.UPDATE_TOAST, "账号不存在")
                } else {
                    commit(types.UPDATE_TOAST, "密码错误")
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

    async AC_GetHomeIncoming({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.GetHomeIncoming(params)
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
    async AC_GetHomeNewIncoming({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.GetHomeNewIncoming(params)
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
    async AC_GetHomeData({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.GetHomeData(params)
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
    async AC_GetHomeNewData({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.GetHomeNewData(params)
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
    async AC_GetHomeEvent({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.GetHomeEvent(params)
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
    async AC_IncomingData({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.IncomingData(params)
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
    async AC_IncomingNewData({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.IncomingNewData(params)
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
    async AC_GetEventList({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.GetEventList(params)
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
    async AC_GetEventTypeList({
        dispatch,
        commit
    }) {

        return api.GetEventTypeList()
            .then(res => {
                return res
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err)
            })
            .finally(() => {

            })
    },
    async AC_UpdateDealStatus({
        dispatch,
        commit
    }, params) {

        return api.UpdateDealStatus(params)
            .then(res => {
                if (res.data.returnResult == 1) {
                    commit("UPDATE_TOAST", "处理成功");
                    return res
                } else {
                    commit("UPDATE_TOAST", "处理失败");
                }


            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err)
            })
            .finally(() => {

            })
    },
    async AC_ManageAccountInfo({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.ManageAccountInfo(params)
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
    async AC_UpdatePassword({
        dispatch,
        commit
    }, params) {

        return api.UpdatePassword(params)
            .then(res => {
                return res

            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err)
            })
            .finally(() => {

            })
    },
    async AC_UpdateAccountInfo({
        dispatch,
        commit
    }, params) {

        return api.UpdateAccountInfo(params)
            .then(res => {
                return res

            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err)
            })
            .finally(() => {

            })
    },
    //区域管理
    async AC_GetCityInfo({
        dispatch,
        commit
    }, params) {

        return api.GetCityInfo(params)
            .then(res => {
                return res

            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err)
            })
            .finally(() => {

            })
    },
    async AC_GetAreaInfo({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.GetAreaInfo(params)
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
    async AC_OptAreaInfo({
        dispatch,
        commit
    }, params) {

        return api.OptAreaInfo(params)
            .then(res => {
                return res

            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err)
            })
            .finally(() => {

            })
    },
    //设备管理
    async AC_OptStation({
        dispatch,
        commit
    }, params) {

        return api.OptStation(params)
            .then(res => {
                return res
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err)
            })
            .finally(() => {

            })
    },
    async AC_queryDevInfo({
        dispatch,
        commit
    }, params) {

        return api.queryDevInfo(params)
            .then(res => {
                return res
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err)
            })
            .finally(() => {

            })
    },
    async AC_OptSocket({
        dispatch,
        commit
    }, params) {

        return api.OptSocket(params)
            .then(res => {
                return res

            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err)
            })
            .finally(() => {

            })
    },
    async AC_getSatations({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.getSatations(params)
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
    async AC_getSockets({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true)
        return api.getSockets(params)
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
    async AC_getAreaAuthInfo({
        dispatch,
        commit
    }, params) {
        return api.getAreaAuthInfo(params)
            .then(res => {
                return res

            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err)
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
