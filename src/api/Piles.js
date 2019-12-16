import Vue from 'vue'
import axios from 'axios'


var instance = axios.create({
    //  baseURL: 'http://116.62.116.120:8004'
    // 正式服务器地址

    baseURL: 'http://192.168.0.18:8004'
    // 测试服务器地址

    // baseURL: 'http://112.17.126.252:8011'
    // 外网
});
var payment = axios.create({
    baseURL: 'http://gate.statesky.cn'
});
var sendMsg = axios.create({
    baseURL: 'http://gate.statesky.cn'
});
export default {
    //运营商端
    //区域管理
    async GetCityInfo(params) {
        let res = await instance.get('service/archivesservice/WeiXinService/getCityInfo', {params: params});
        return res.data;
    },
    async GetAreaInfo(params) {
        let res = await instance.get('service/archivesservice/WeiXinService/getAreaInfo', {params: params});
        return res.data;
    },
    async OptAreaInfo(params) {
        let res = await instance.post('service/archivesservice/WeiXinService/optAreaInfo', params);
        return res.data;
    },
    //设备管理
    async GetDcuWebChatInfo(params) {
        let res = await instance.get('service/weixin/ChargingService/getDcuWebChatInfo', {params: params});
        return res.data;
    },
    async GetPointWebChatInfo(params) {
        let res = await instance.get('service/weixin/ChargingService/getPointWebChatInfo', {params: params});
        return res.data;
    },


    async getAreaAuthInfo(params) {
        let res = await instance.get('service/archivesservice/WeiXinService/getAreaAuthInfo', {params: params});
        return res.data;
    },
    async getSatations(params) {
        let res = await instance.get('service/weixin/ChargingService/rtuAuthinfo', {params: params});
        return res.data;
    },
    async getSockets(params) {
        let res = await instance.get('service/weixin/ChargingService/plugAuthinfo', {params: params});
        return res.data;
    },
    async queryChargingInfo(params) {
        let res = await instance.get('service/weixin/AppStatisticsService/queryChargingInfo', {params: params});
        return res.data;
    },
    async OptStation(params) {
        let res = await instance.post('service/archivesservice/WeiXinService/optRtuInfo', params);
        return res.data;
    },
    async OptSocket(params) {
        let res = await instance.post('service/archivesservice/WeiXinService/optMeterInfo', params);
        return res.data;
    },

    async ManageAccountInfo(params) {
        let res = await instance.get('service/weixin/ChargingService/manageAccountInfo', {
            params: params
        });
        return res.data;
    },
    async UpdateAccountInfo(params) {
        let res = await instance.post('service/weixin/ChargingService/updateAccountInfo', params);
        return res.data;
    },
    async UpdatePassword(params) {
        let res = await instance.post('service/weixin/ChargingService/updatePassWordInfo', params);
        return res.data;
    },
    async UpdateDealStatus(params) {
        let res = await instance.post('service/analysisservice/EventDataService/updatePointAlarmDealStatus', params);
        return res.data;
    },
    async GetEventList(params) {
        let res = await instance.get('service/analysisservice/EventDataService/queryLampEventDatas', {
            params: params
        });
        return res.data;
    },
    async IncomingData(params) {
        let res = await instance.post('service/weixin/AppAdminService/calIncoming', params);
        return res.data;
    },
    async IncomingNewData(params) {
        let res = await instance.post('service/weixin/AppAdminService/calNewIncoming', params);
        return res.data;
    },
    async OperatorLogin(params) {
        let res = await instance.post('service/authservice/AuthService/loginIn', params);
        return res.data;
    },
    async GetHomeIncoming(params) {
        let res = await instance.get('service/weixin/AppAdminService/calTotalIncoming', {
            params: params
        });
        return res.data;
    },
    async GetHomeNewIncoming(params) {
        let res = await instance.get('service/weixin/AppAdminService/calNewTotalIncoming', {
            params: params
        });
        return res.data;
    },
    async GetHomeData(params) {
        let res = await instance.get('service/weixin/AppAdminService/getCalData', {
            params: params
        });
        return res.data;
    },
    async GetHomeNewData(params) {
        let res = await instance.get('service/weixin/AppAdminService/getNewCalData', {
            params: params
        });
        return res.data;
    },
    async GetHomeEvent(params) {
        let res = await instance.get('service/weixin/AppAdminService/calEvent', {
            params: params
        });
        return res.data;
    },
    //用户端
    async GetShowInfo(params) {
        let res = await instance.get('service/weixin/ChargingService/getShowInfo', {
            params: params
        });
        return res.data;
    },
    async GetUserCharging(params) {
        let res = await instance.get('service/weixin/AppChargingRecordService/queryUserCharging', {
            params: params
        });
        return res.data;
    },
    // async AddCharging(params)
    async AddBatteryCharging(params) {
        let res = await instance.get('service/weixin/AppTradingRecordService/addAppBatteryCharging', {
            params: params
        });
        return res.data;
    },
    async AddRecharge(params) {
        let res = await instance.get('service/weixin/AppRechargeRecordService/addAppRechargeRecord', {
            params: params
        });
        return res.data;
    },
    async RechargeRecord(params) {
        let res = await instance.get('service/weixin/AppRechargeRecordService/queryAppRechargeRecord', {
            params: params
        });
        return res.data;
    },
    async ChargeRecord(params) {
        let res = await instance.get('service/weixin/AppChargingRecordService/queryAppChargingRecord', {
            params: params
        });
        return res.data;
    },
    async QueryChargeRecord(params) {
        let res = await instance.get('service/weixin/AppChargingRecordService/queryBatteryChargingRd', {
            params: params
        });
        return res.data;
    },
    // 查找某一条记录详情
    async GetBatteryChargingRd(params) {
        let res = await instance.get('service/weixin/AppChargingRecordService/getBatteryChargingRd', {
            params: params
        });
        return res.data;
    },
    async GetUserInfo(params) {
        let res = await instance.get('service/weixin/PobWxchatInfoService/getPobWxchatInfo', {
            params: params
        });
        return res.data;
    },
    async UpdateUserInfo(params) {
        let res = await instance.get('service/weixin/PobWxchatInfoService/updatePobWxchatInfo', {
            params: params
        });
        return res.data;
    },
    async UpdateRecharge(params) {
        let res = await instance.get('service/weixin/AppChargingRecordService/updateAppChargingRecord', {
            params: params
        });
        return res.data;
    },
    async SendCharing(params) {
        let res = await instance.post('service/protocolservice/SendMessageService/sendData', params);
        return res.data;
    },
    async ReceiveCharing(params) {
        let res = await instance.post('service/protocolservice/ReceiveMessageService/receiveData', params);
        return res.data;
    },
    async SinglePluginfo(params) {
        let res = await instance.get('service/weixin/ChargingService/singlePluginfo', {
            params: params
        });
        return res.data;
    },
    async PrePay(params) {
        let res = await payment.post('wxqn/wxPayment/prePay', params);
        return res.data;
    },
    async SendWaringMsg(params) {
        let res = await sendMsg.post('wxqn/wxMessage/sendTemplateMsg', params);
        return res.data;
    },
    async GetcheckBandStatus(params) {
        let res = await instance.post('service/weixin/VendingService/checkBandStatus', params);
        return res.data;
    },
    async GetbandDeviceInfo(params) {
        let res = await instance.post('service/weixin/VendingService/bandDeviceInfo', params);
        return res.data;
    },
    async GetChatBandInfo(params) {
        let res = await instance.post('service/weixin/VendingService/getChatBandInfo', params);
        return res.data;
    },
    async GetPriceNotesList(params) {
        let res = await instance.post('service/weixin/VendingService/getPriceNotesList', params);
        return res.data;
    },
    async GetChatVendingRecordDeafut(params) {
        let res = await instance.post('service/weixin/VendingService/getChatVendingRecordDeafutMore', params);
        return res.data;
    },
    async GetaddVendingRecord(params) {
        let res = await instance.post('service/weixin/VendingService/getChatVendingRecord', params);
        return res.data;
    },
    async GetaddPryPayRecord(params) {
        let res = await instance.post('service/weixin/AppTradingRecordService/addPryPayRecord', params);
        return res.data;
    },
    // 剩余电量
    async GetChatEnergyData(params) {
        let res = await instance.post('service/weixin/VendingService/getChatEnergyDataMore', params);
        return res.data;
    },
    async GetEventTypeList(params) {
        let res = await instance.post('service/weixin/AppAdminService/getManyEventItem');
        return res.data;
    },
    async QueryUserBtCharging(params) {
        let res = await instance.get('service/weixin/AppChargingRecordService/queryUserBtCharging', {
            params: params
        });
        return res.data;
    },
    // 判断是否绑定微信账号状态
    async CheckAdminBandStatus(params) {
        let res = await instance.get('service/weixin/VendingService/checkAdminBandStatus', {
            params: params
        });
        return res.data;
    },
    // 绑定管理员
    async BandAccountInfo(params) {
        let res = await instance.get('service/weixin/VendingService/bandAccountInfo', {
            params: params
        });
        return res.data;
    },
    // 获取首页收入总汇
    async GetCalProfit(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/calProfit', params);
        return res.data
    },
    async GetCalNewProfit(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/calNewProfit', params);
        return res.data
    },
    async statisticsIndex(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/statisticsIndex', params);
        return res.data
    },
    // 获取首页收入详情
    async GetRecordDetail(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/queryRecordDetail', params);
        return res.data
    },
    async GetRecordNewDetail(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/queryNewRecordDetail', params);
        return res.data
    },
    // 获取首页用户数量
    async GetCalUsers(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/calUsers', params);
        return res.data
    },
    // 剩余电量告警列表
    async GetAlarmEnergyRecord(params) {
        let res = await instance.post('service/weixin/VendingService/getAlarmEnergyRecord', params);
        return res.data
    },
    // 设备异常统计
    async GetDevStatus(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/selectDevByStatus', params);
        return res.data
    },
    // 获取房东账号信息
    async GetMyCalData(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/getMyCalData', params);
        return res.data
    },
    // 获取是否解除绑定后台房东信息
    async unbandAccountInfo(params) {
        let res = await instance.post('service/weixin/VendingService/unbandAccountInfo', params);
        return res.data
    },
    // 增加设备信息
    async addDevInfo(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/addDevInfo', params);
        return res.data
    },
    // 获取电价列表
    async GetPriceList(params) {
        let res = await instance.post('service/weixin/AppPriceService/getSinglePriceList', params);
        return res.data
    },
    // 获取充电桩电价列表
    async GetchargingPriceList(params) {
        let res = await instance.post('service/weixin/AppPriceService/getAuthAreaPrice', params);
        return res.data
    },
    // 更新设备信息
    async updateDevInfo(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/updateDevInfo', params);
        return res.data
    },
    // 电价维护(更改)
    async PriceInfo(params) {
        let res = await instance.post('service/weixin/AppPriceService/optSinglePriceInfo', params);
        return res.data
    },
     // 充电桩电价维护(更改)
    async CharingPriceInfo(params) {
        let res = await instance.post('service/weixin/AppPriceService/optCharingPrice', params);
        return res.data
    },
    // 异常告警
    async GetAlarm(params) {
        let res = await instance.post('service/analysisservice/EventDataService/queryDcuEventData', params);
        return res.data
    },
    // 异常处理
    async GetAlarmStatus(params) {
        let res = await instance.post('service/analysisservice/EventDataService/updateDcuAlarmDealStatus', params);
        return res.data
    },
    // 设备管理
    // async GetDevInfo(params) {
    //     let res = await instance.post('service/weixin/AppStatisticsService/queryDevInfo', params);
    //     return res.data
    // },
    // 删除设备
    async DeleteDevInfo(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/deleteDevInfo', params);
        return res.data
    },
    // 获取token
    async GetToken(params) {
        let res = await instance.post('service/protocolservice/SendMessageService/getToken', params);
        return res.data
    },
    // 添加充电记录
    async AddVendRecord(params) {
        let res = await instance.post('service/weixin/VendingService/addVendingRecord', params);
        return res.data
    },
    // 添加退费记录
    async AddReturnRecord(params) {
        let res = await instance.post('service/weixin/AppStatisticsService/addReturnRecord', params);
        return res.data
    },
    // 插入充值记录
    async AddRechargeRecord(params) {
        let res = await instance.post('service/weixin/AppRechargeRecordService/addAppRechargeRecord', params);
        return res.data
    },
    // 修改微信用户余额记录
    async UpdatechatInfo(params) {
        let res = await instance.post('service/weixin/PobWxchatInfoService/updatePobWxchatInfo', params);
        return res.data
    },
    // 账单记录默认
    async GetChargingRecordDeafut(params) {
        let res = await instance.post('service/weixin/VendingService/getChargingRecordDeafut', params);
        return res.data
    },
    // 微信充值改变个人账户金钱更新
    async AddAppWxChatRecharge(params) {
        let res = await instance.post('service/weixin/AppTradingRecordService/addAppWxChatRecharge', params);
        return res.data
    },
    async GetChatTransActionsDeafut(params) {
        let res = await instance.post('service/weixin/AppTradingRecordService/getChatTransActionsDeafut', params);
        return res.data
    },
    async GetChargingRecord(params) {
        let res = await instance.post('service/weixin/VendingService/getChargingRecord', params);
        return res.data
    },
    async GetChatTransActions(params) {
        let res = await instance.post('service/weixin/AppTradingRecordService/getChatTransActions', params);
        return res.data
    },
    // 提现到银行卡，微信或者支付宝
    async AddAppWithdRawLog(params) {
        let res = await instance.post('service/weixin/AppWithdRawLogService/addAppWithdRawLog', params);
        return res.data
    },
    // 提现详情
    async querySingleWithdRawLog(params) {
        let res = await instance.post('service/weixin/AppWithdRawLogService/querySingleWithdRawLog', params);
        return res.data
    },
    // 提现记录
    async QueryAppWithdRawLog(params) {
        let res = await instance.post('service/weixin/AppWithdRawLogService/queryAppWithdRawLog', params);
        return res.data
    },
    async registerWebChat(params) {
        let res = await instance.post('service/archivesservice/WeiXinService/registerWebChat', params);
       return res.data
    },
    async sendMessageCode(params) {
        let res = await instance.post('service/archivesservice/WeiXinService/sendMessageCode', params);
       return res.data
    },
    async registerStatus(params) {
        let res = await instance.post('service/archivesservice/WeiXinService/registerStatus', params);
       return res.data
    },
    async insertChargeLog(params) {
        let res = await instance.post('service/archivesservice/WeiXinService/insertChargeLog', params);
       return res.data
    },
    // 扫码获取设备信息
    async getBeeQrcodeInfo(params) {
        let res = await instance.post('service/archivesservice/WeiXinService/getBeeQrcodeInfo', params);
       return res.data
    },
    // 获问题反馈
    async getFeedBackChatInfo(params) {
        let res = await instance.post('service/weixin/AppFeedBackSerivice/getFeedBackChatInfo', params);
       return res.data
    },
    // 问题反馈提交
    async optFeedBackChatInfo(params) {
        let res = await instance.post('service/weixin/AppFeedBackSerivice/optFeedBackChatInfo', params);
       return res.data
    },
    // 扫描判断状态
    async getQroceStatus(params) {
        let res = await instance.post('service/weixin/PobWxchatInfoService/getQroceStatus', params);
       return res.data
    },
    // 获取管理单位
    async getUnitList(params) {
        let res = await instance.post('service/weixin/PropertyService/getUnitList', params);
       return res.data
    },
    // 管理单位新增修改删除
    async optUnit(params) {
        let res = await instance.post('service/weixin/PropertyService/optUnit', params);
       return res.data
    },
    // 管理单位下WIFI表新增
    async addWifiDevInfo(params) {
        let res = await instance.post('service/weixin/PropertyService/addDevInfo', params);
       return res.data
    },
    // 管理单位下WIFI表列表
    async getDevInfo(params) {
        let res = await instance.post('service/weixin/PropertyService/getDevInfo', params);
       return res.data
    },
    // 房租配置列表
    async getRoomConfiguration(params) {
        let res = await instance.post('service/weixin/PropertyService/getRoomConfiguration', params);
       return res.data
    },
    // 编辑房租配置
    async optRoomConfiguration(params) {
        let res = await instance.post('service/weixin/PropertyService/optRoomConfiguration', params);
       return res.data
    },
    // 查询租客(未租房的电充蜂用户)
    async selectTenantInfo(params) {
        let res = await instance.post('service/weixin/PropertyService/selectTenantInfo', params);
       return res.data
    },
    // 查询租客未缴纳账单
    async getFailurePay(params) {
        let res = await instance.post('service/weixin/PropertyService/getFailurePay', params);
       return res.data
    },
    // 查询月账单
    async rentUserBill(params) {
        let res = await instance.post('service/weixin/PropertyService/rentUserBill', params);
       return res.data
    },
    // 月账单缴纳
    async payRentBill(params) {
        let res = await instance.post('service/weixin/PropertyService/payRentBill', params);
       return res.data
    },
    // 月账单缴纳
    async selectAllDev(params) {
        let res = await instance.post('service/weixin/PropertyService/selectAllDev', params);
       return res.data
    },
}
