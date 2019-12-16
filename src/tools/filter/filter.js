import Vue from 'vue'
import { formatDate } from './../commonJs/common';
Vue.filter('curstatus', function (value) {
    if (value == 1) {
        value = "在线"
    } else {
        value = "离线"
    }
    return value

})
Vue.filter('usestatus', function (value) {
    if (value == 1) {
        value = "空闲"
    } else {
        value = "使用中"
    }
    return value
})
Vue.filter('chargingstatus', function (value) {
    if (value == 1) {
        value = "正在充电"
    } else if (value == 2) {
        value = "充电完成"
    } else {
        value = "超时不用自动退款"
    }
    return value
})
Vue.filter('date', function (value) {
    let date = new Date(value)
    return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
})
Vue.filter('dealstatus', function (value) {
    switch (value) {
        case 1:
            value = "已处理"
            break;
      
        case 2:
            value = "未解决"
            break;
        default:
            value = "未处理"
    }

    return value
})
Vue.filter('rechargetype', function (value) {
    switch (value) {
        case 1:
            value = "余额充值"
            break;
        case 2:
            value = "电瓶车充电"
            break;
        case 3:
            value="退费" 
        case 4:
            value="电表充值"
    }
    return value
})