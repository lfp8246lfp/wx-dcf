import * as types from "../mutation-types";
import api from "../../api/Piles";

try {
    if (localStorage.getItem("userInfos")) {
        var defaultUserInfos = JSON.parse(localStorage.getItem("userInfos"));
    }
    if (localStorage.getItem("orderNum")) {
        var defaultOrderNum = JSON.parse(localStorage.getItem("orderNum"));
    }
} catch (e) {}
const state = {
    userInfos          : defaultUserInfos || {},
    orderNum           : defaultOrderNum || "",
    getChatBandInfo    : {},
    getPriceNotesList  : {},
    getaddVendingRecord: {},
    getChatEnergyData  : {}
};

const getters = {
    userInfos: state => state.userInfos,
    orderNum : state => state.orderNum
};

const mutations = {
    UPDATE_UserInfos(state, payload) {
        state.userInfos = payload;
        try {
            localStorage.setItem("userInfos", JSON.stringify(payload));
        } catch (e) {}
    },
    getChatBandInfo(state, val) {
        state.getChatBandInfo = val;
    },
    getPriceNotesList(state, val) {
        state.getPriceNotesList = val;
    },
    UPDATE_orderNum(state, payload) {
        state.orderNum = payload;
        try {
            localStorage.setItem("orderNum", JSON.stringify(payload));
        } catch (e) {}
    }
};
const actions = {
    async AC_GetUserCharging({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .GetUserCharging(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_QueryUserBtCharging({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .QueryUserBtCharging(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_CheckAdminBandStatus({
        dispatch,
        commit
    }, params) {
        // commit(types.UPDATE_LOADING, true);
        return (
            api
            .CheckAdminBandStatus(params)
            // .then(res => {
            //     commit('checkBandStatus', res)
            //     // return res
            // })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            })
        );
    },
    async AC_BandAccountInfo({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        // commit(types.UPDATE_TOAST, "绑定成功")
        return (
            api
            .BandAccountInfo(params)
            .then(res => {
                return res
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            })
        );
    },
    async AC_AddCharging({
        dispatch,
        commit
    }, params) {
        return api
            .AddCharging(params)
            .then(res => {
                if (res.data.returnCode == 1) {
                    commit(types.UPDATE_TOAST, "充电成功");
                } else {
                    commit(types.UPDATE_TOAST, "充电失败");
                }
                return res;
            })
            .catch(err => {})
            .finally(() => {});
    },
    // 解除绑定后台账号
    async AC_unbandAccountInfo({
        dispatch,
        commit
    }, params) {
        return api
            .unbandAccountInfo(params)
            .then(res => {
                if (res.data.returnCode == 0) {
                    commit(types.UPDATE_TOAST, "解除失败");
                } else {
                    commit(types.UPDATE_TOAST, "解除成功");
                }
                return res;
            })
            .catch(err => {})
            .finally(() => {});
    },
    // 添加设备信息
    async AC_addDevInfo({
        dispatch,
        commit
    }, params) {
        return api
            .addDevInfo(params)
            .then(res => {
                // if (res.data.returncode == 1) {
                //     commit(types.UPDATE_TOAST, "新增成功");
                // } else {
                //     commit(types.UPDATE_TOAST, "增加失败");
                // }
                return res;
            })
            .catch(err => {})
            .finally(() => {});
    },
    // 删除设备信息
    async AC_DeleteDevInfo({
        dispatch,
        commit
    }, params) {
        return api
            .DeleteDevInfo(params)
            .then(res => {
                if (res.data.returncode == 1) {
                    commit(types.UPDATE_TOAST, "删除成功");
                } else {
                    commit(types.UPDATE_TOAST, "删除失败");
                }
                return res;
            })
            .catch(err => {})
            .finally(() => {});
    },
    // 跟新设备信息
    async AC_updateDevInfo({
        dispatch,
        commit
    }, params) {
        return api
            .updateDevInfo(params)
            .then(res => {
                if (res.data.returncode == 1) {
                    commit(types.UPDATE_TOAST, "更新成功");
                } else {
                    commit(types.UPDATE_TOAST, "更新失败");
                }
                return res;
            })
            .catch(err => {})
            .finally(() => {});
    },
    async AC_AddBatteryCharging({
        dispatch,
        commit
    }, params) {
        return api
            .AddBatteryCharging(params)
            .then(res => {
                if (res.data.returncode == 1) {
                    commit(types.UPDATE_TOAST, "充电成功");
                } else {
                    commit(types.UPDATE_TOAST, "充电失败111111");
                }
                return res;
            })
            .catch(err => {})
            .finally(() => {});
    },
    async AC_AddRecharge({
        dispatch,
        commit
    }, params) {
        return api
            .AddRecharge(params)
            .then(res => {
                if (res.data.returnCode == 1) {
                    // 充值成功
                    commit(types.UPDATE_TOAST, "");
                } else {
                    commit(types.UPDATE_TOAST, "充值失败");
                }
            })
            .catch(err => {})
            .finally(() => {});
    },

    async AC_AddAppWxChatRecharge({
        dispatch,
        commit
    }, params) {
        return api
            .AddAppWxChatRecharge(params)
            .then(res => {
                if (res.data.returncode == 1) {
                    commit(types.UPDATE_TOAST, "充值成功");
                } else {
                    commit(types.UPDATE_TOAST, "充值失败");
                }
            })
            .catch(err => {})
            .finally(() => {});
    },
    async AC_RechargeRecord({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .RechargeRecord(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_checkBandStatus({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return (
            api
            .GetcheckBandStatus(params)
            // .then(res => {
            //     commit('checkBandStatus', res)
            //     // return res
            // })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            })
        );
    },
    async AC_bandDeviceInfo({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .GetbandDeviceInfo(params)
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_GetChatBandInfo({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .GetChatBandInfo(params)
            .then(res => {
                commit("getChatBandInfo", res);
                // return res
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_GetPriceNotesList({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .GetPriceNotesList(params)
            .then(res => {
                commit("getPriceNotesList", res);
                // return res
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_GetChatVendingRecordDeafut({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .GetChatVendingRecordDeafut(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_GetaddVendingRecord({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .GetaddVendingRecord(params)
            .then(res => {
                // commit('getaddVendingRecord', res)
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    // 更新之后的插入充电记录的接口
    async AC_GetaddPryPayRecord({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .GetaddPryPayRecord(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_AddAppWithdRawLog({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .AddAppWithdRawLog(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_QueryAppWithdRawLog({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .QueryAppWithdRawLog(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_GetChatEnergyData({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .GetChatEnergyData(params)
            .then(res => {
                // commit('getChatEnergyData', res)
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_ChargeRecord({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .ChargeRecord(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_QueryChargeRecord({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .QueryChargeRecord(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_GetBatteryChargingRd({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .GetBatteryChargingRd(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_GetUserInfomation({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);
        return api
            .GetUserInfo(params)
            .then(res => {
                commit("UPDATE_UserInfos", res.data.pobWxchatInfoItem);
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },

    async AC_GetChargingRecordDeafut({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);

        return api
            .GetChargingRecordDeafut(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_getChatTransActionsDeafut({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);

        return api
            .GetChatTransActionsDeafut(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_GetChargingRecord({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);

        return api
            .GetChargingRecord(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },
    async AC_GetChatTransActions({
        dispatch,
        commit
    }, params) {
        commit(types.UPDATE_LOADING, true);

        return api
            .GetChatTransActions(params)
            .then(res => {
                return res;
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {
                commit(types.UPDATE_LOADING, false);
            });
    },



    async AC_UpdateUserInfo({
        dispatch,
        commit
    }, params) {
        return api
            .UpdateUserInfo(params)
            .then(res => {
                if (res.data.returnCode == 1) {
                    return res;
                } else {
                    commit(types.UPDATE_TOAST, "余额更新失败");
                }
            })
            .catch(err => {
                commit(types.UPDATE_TOAST, err);
            })
            .finally(() => {});
    },
    async AC_UpdateRecharge({
        dispatch,
        commit
    }, params) {
        return api
            .UpdateRecharge(params)
            .then(res => {
                return res;
            })
            .catch(err => {})
            .finally(() => {});
    },
    async AC_PrePay({
        dispatch,
        commit
    }, params) {
        return api
            .PrePay(params)
            .then(res => {
                return res;
            })
            .catch(err => {})
            .finally(() => {});
    },
    async AC_SendWaringMsg({
        dispatch,
        commit
    }, params) {
        return api
            .SendWaringMsg(params)
            .then(res => {
                return res
            })
            .catch(err => {
            })
            .finally(() => {});
    }
};
export default {
    state,
    getters,
    actions,
    mutations
};
