import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

// Vue.http.options.root = 'http://gate.hipland.net'
// Vue.http.options.root = 'https://apis.yuefenqu.com'
// Vue.http.options.root = 'http://116.62.116.120:8004'
// 正式
Vue.http.options.root = 'http://112.17.126.252:8011'
// 测试
//充电桩接口
export const GetStationList = (params) => {
    delete params.areaname;
    return Vue.http.get('service/weixin/ChargingService/rtuinfo', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (msg) {
                return Promise.reject(msg)
            }
        })
}

export const GetSocketList = (params) => {
    // return Vue.http.get('service/weixin/ChargingService/pluginfo', {
    //         params: params
    //     })
    return Vue.http.get('service/weixin/ChargingService/plugBtinfo', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (msg) {
                return Promise.reject(msg)
            }
        })
}

export const GetPriceList = (params) => {
    return Vue.http.get('service/weixin/ChargingService/priceinfo', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (msg) {
                return Promise.reject(msg)
            }
        })
}
export const GetCharging = (params) => {
    // return Vue.http.get('service/weixin/ChargingService/chargingdeviceinfo',
    return Vue.http.get('service/weixin/ChargingService/btchargingdeviceinfo', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (msg) {
                return Promise.reject(msg)
            }
        })
}


//测试接口
export const GetTest2 = (params) => {
    return Vue.http.get('api/test.json', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (msg) {
                return Promise.reject(msg)
            }
        })
}

//模板项目接口
export const GetTicket = () => {
    return Vue.http.get('service/weixin/WxAuth/getTickByCode')
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (msg) {
                return Promise.reject(msg)
            }
        })
}

export const FetchWx2Qiniu = (params) => {
    return Vue.http.get('service/weixin/QIniu/fetch', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (msg) {
                return Promise.reject(msg)
            }
        })
}

export const CreateUserInfo = (params) => {
    return Vue.http.post('service/insurancebiz/UserInfoService/addUserInfo', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const ModifyUserInfo = (params) => {
    return Vue.http.post('service/insurancebiz/UserInfoService/updateUserInfo', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const GetUserInfo = (params) => {
    return Vue.http.post('service/insurancebiz/UserInfoService/queryUserInfo', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const GetUserToken = (params) => {
    return Vue.http.post('mpUserService/getTokenByCode', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (msg) {
                return Promise.reject(msg)
            }
        })
}

export const GetUserInfoFromWechat = (params) => {
    return Vue.http.get('service/weixin/WxAuth/getUserInfo', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (msg) {
                return Promise.reject(msg)
            }
        })
}

export const CreateOrder = (params) => {
    return Vue.http.post('service/insurancebiz/OrderService/addOrder', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const CreateCarInfo = (params) => {
    return Vue.http.post('service/insurancebiz/CarInfoService/addCarInfo', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const ModifyCarInfo = (params) => {
    return Vue.http.post('service/insurancebiz/CarInfoService/updateCarInfo', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const CreateOrderItem = (params) => {
    return Vue.http.post('service/insurancebiz/OrderDetailItemService/addOrderDetailItem', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const GetCarInfo = (params) => {
    return Vue.http.get('service/insurancebiz/CarInfoService/queryCarInfo', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

// 获取公司列表
export const GetCompanyList = (params) => {
    params.pageNum  = 1
    params.pageSize = 50
    params.orderBy  = 'sort_num desc'
    params.showCorp = 'true'
    return Vue.http.get('service/insurancebiz/InsuranceCorpService/queryInsuranceCorp', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
// 获取险种列表
export const GetProductList = (params) => {
    params.pageNum  = 1
    params.pageSize = 50
    params.orderBy  = 'list_order asc'
    return Vue.http.get('service/insurancebiz/InsuranceType/queryInsuranceType', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

// 获取险种类型： 全额险，商业险
export const GetInsuranceType = (params) => {
    return Vue.http.get('service/insurancebiz/InsProService/listAllPros', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const PlaceOrder = (params) => {
    return Vue.http.post('service/insurancebiz/UserOrder/placeOrder', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

// 批量订单
export const PlaceBatchOrder = (params) => {
    return Vue.http.post('service/insurancebiz/UserOrder/placeBatchOrder', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const LoanOrder = (params) => {
    return Vue.http.post('service/loan/LoanOrderService/updateLoanOrder', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const CalculateOrderPrice = (params) => {
    return Vue.http.post('service/INSURANCEBIZ/OpService/calculateOrderPrice', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
export const CalculateRepay = (params) => {
    return Vue.http.post('service/INSURANCEBIZ/UserOrder/calculateRepay', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
export const GetInviterQRCode = (params) => {
    return Vue.http.get('service/weixin/InviteCR/getInviterQRUrl', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const GetDeliveryAddress = (params) => {
    return Vue.http.get('service/insurancebiz/DeliveryAddress/queryDeliveryAddress', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const AddDeliveryAddress = (params) => {
    return Vue.http.get('service/insurancebiz/DeliveryAddress/addDeliveryAddress', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const DeleteDeliveryAddress = (params) => {
    return Vue.http.get('service/insurancebiz/DeliveryAddress/deleteDeliveryAddress', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const setTerm = (params) => {
    return Vue.http.get('service/insurancebiz/UserOrder/setTerm', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const UpdateDeliveryAddress = (params) => {
    return Vue.http.get('service/insurancebiz/DeliveryAddress/updateDeliveryAddress', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const GetAddress = (params) => {
    return Vue.http.get('service/insurancebiz/DeliveryAddress/getDeliveryAddress', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const BindMobile = (params) => {
    return Vue.http.get('service/insurancebiz/UserAuth/bindMobile', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const SendVerifyCode = (params) => {
    return Vue.http.get('service/insurancebiz/UserAuth/sendMobileBindCode', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const GetOrderDetailItem = (params) => {
    params.pageNum  = 1
    params.rich     = 1
    params.pageSize = 1000
    return Vue.http.get('service/insurancebiz/OrderDetailItem/queryOrderDetailItem', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
export const SetOrderStatus = (params) => {
    return Vue.http.get('service/insurancebiz/OpService/setOrderStatus', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (msg) {
                return Promise.reject(msg)
            }
        })
}
export const BindCard = (params) => {
    return Vue.http.post('service/baofu/UserService/bindCard', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
export const CardUserInfo = (params) => {
    return Vue.http.post('service/baofu/BankCardService/queryBankCard', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const DeleteCard = (params) => {
    return Vue.http.post('service/baofu/UserInfoService/deleteUserInfo', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const ConfirmBind = (params) => {
    return Vue.http.post('service/baofu/UserService/confirmBind', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const UpDateUserInfo = (params) => {
    return Vue.http.post('service/baofu/UserInfoService/updateUserInfo', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
// UserOrder/sendPayment
export const SendPayment = (params) => {
    return Vue.http.get('service/insurancebiz/UserOrder/sendPayment', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

// 批量支付的列表根据条件过滤查询订单
export const FilterOrder = (params) => {
    return Vue.http.get('service/insurancebiz/UserOrder/filterOrder', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

// 批量支付页请求验证码.
export const SendBatchPayment = (params) => {
    return Vue.http.get('service/insurancebiz/UserOrder/sendBatchPayment', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const ConfirmPayment = (params) => {
    return Vue.http.post('service/baofu/UserService/confirmPayment', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

// 批量支付确认支付
export const ConfirmBatchPayment = (params) => {
    return Vue.http.post('service/insurancebiz/UserOrder/confirmPayment', params)
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const GetBankList = (params) => {
    return Vue.http.get('service/baofu/BankInfo/queryBankInfo', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
// 绑定
export const UserInfo = (params) => {
    return Vue.http.get('service/baofu/UserInfo/queryUserInfo', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            console.log('>>>>>>>>>>>data', data)
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
export const QueryUserChannel = (params) => {
    return Vue.http.get('service/weixin/UserChannelService/queryUserChannel', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const GetInviterCode = (params) => {
    return Vue.http.get('service/weixin/InviteCR/getInviterCode', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const EnterInviterCode = (params) => {
    return Vue.http.get('service/weixin/InviteCR/enterInviterCode', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
export const GetUserSource = (params) => {
    return Vue.http.get('service/weixin/InviteCR/getUserSource', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const AddAdditionalUserAtt = (params) => {
    return Vue.http.get('service/insurancebiz/AdditionalUserAtt/addAdditionalUserAtt', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const DelAdditionalUserAtt = (params) => {
    return Vue.http.get('service/insurancebiz/AdditionalUserAtt/deleteAdditionalUserAtt', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
export const QueryAdditionalUserAtt = (params) => {
    return Vue.http.get('service/insurancebiz/AdditionalUserAtt/queryAdditionalUserAtt', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const QueryBihuCityCode = (params) => {
    return Vue.http.get('service/insurancebiz/BihuCityCode/queryBihuCityCode', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const CheckPrice = (params) => {
    return Vue.http.get('service/insurancebiz/BihuService/checkPrice', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (code === 500) {
                return Promise.reject(msg)
            } else {
                alert(msg)
            }
        })
}

export const GetReinfo = (params) => {
    return Vue.http.get('service/insurancebiz/BihuService/asyncGetReinfo', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (code === 500) {
                return Promise.reject(msg)
            } else {
                alert(msg)
            }
        })
}

export const GetAsyncResult = (params) => {
    return Vue.http.get('service/insurancebiz/BihuService/getAsyncResult', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (code === 500) {
                return Promise.reject(msg)
            } else {
                alert(msg)
            }
        })
}

export const PostPrice = (params) => {
    return Vue.http.get('service/insurancebiz/BihuService/asyncPostPrice', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (code === 500) {
                return Promise.reject(msg)
            } else {
                alert(msg)
            }
        })
}

export const GetPrice = (params) => {
    return Vue.http.get('service/insurancebiz/BihuService/asyncGetPrice', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else if (code === 500) {
                return Promise.reject(msg)
            } else {
                alert(msg)
            }
        })
}

export const UpdateOrder = (params) => {
    return Vue.http.get('service/insurancebiz/OrderService/updateOrder', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

export const SendSignPage = (params) => {
    return Vue.http.get('service/loan/DianrongService/sendSignPage', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}
export const CheckOrderStatus = (params) => {
    return Vue.http.get('service/INSURANCEBIZ/OpService/checkOrderStatus', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

// 短信跳转接口
export const GetShortUrl = (params) => {
    return Vue.http.get('service/insurancebiz/ShortUrlService/getShortUrl', {
            params: params
        })
        .then((data) => {
            if (data.status === 200) {
                return data.body
            } else {
                return Promise.reject('网络请求错误请稍候再试')
            }
        }).then(({
            code,
            data,
            msg
        }) => {
            if (code === 200) {
                return data
            } else {
                return Promise.reject(msg)
            }
        })
}

// 管理端api
// 获取收入总汇信息
// export const GetCalProfit = (params) => {
//   return Vue.http.get('service/weixin/AppStatisticService/calProfit', { params: params })
//     .then((data) => {
//       if (data.status === 200) {
//         return data.body
//       } else {
//         return Promise.reject('网络请求错误请稍候再试')
//       }
//     }).then(({ code, data, msg }) => {
//       if (code === 200) {
//         return data
//       } else {
//         return Promise.reject(msg)
//       }
//     })
// }
