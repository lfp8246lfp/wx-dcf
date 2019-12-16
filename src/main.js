// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import FastClick from 'fastclick'
import App from './App'
import routes from './routes'
import store from './stores'
import {
    sync
} from 'vuex-router-sync'
import {
    ToastPlugin,
    LoadingPlugin,
    WechatPlugin,
    AlertPlugin
} from 'vux'
import 'lib-flexible/flexible.js'
import 'styles/reset.css'
import 'styles/border.css'
import { Upload } from 'element-ui'

import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale';
const getCurrentUrl = () => {
    let href = window.location.href
    let index = href.indexOf('#')
    return (index === -1) ? href : href.substring(0, index)
}

const getBaseUrl = () => {
    let href = window.location.href
    let index = href.indexOf('?')
    return (index === -1) ? href : href.substring(0, index)
}

const getEntry = () => {
    let href = window.location.href
    let index = href.indexOf('#')
    return (index === -1) ? href : href.substring(index + 1)
}

const getUrlParam = (key, url) => {
    let reg = new RegExp('[?|&]' + key + '=([^&]+)')
    let match = url.match(reg)
    return match && match[1]
}

Vue.use(VueRouter)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(AlertPlugin)
Vue.use(VueI18n)
Vue.use(Upload)
Vue.http.interceptors.push(function (request, next) {
    console.log("interceptors " + JSON.stringify(request))
    var needToken = true;
    console.log("request.url:" + request.url);
    if (request.url.indexOf("wxqn") != -1) {
        console.log("no need auth: " + request.url);
        needToken = false;
    }
    let url = getCurrentUrl()
    let appid = getUrlParam('mpid', url)
    //let authtype = getUrlParam('authtype', url)
    let entry = getEntry()
    // setTimeout(() => {
        
    var userItem = localStorage.getItem("userItem")
    if (userItem == null && needToken) {
        window.location.replace(getBaseUrl() + "?mpid=" + appid +
            "&entry=" + entry + "/#loginPath");
    } else {
        next(function (response) {
            console.log("userItem: " + JSON.stringify(userItem))
        })
    }
    // }, 2000)
});

const router = new VueRouter({
    // mode: 'history',
    routes: routes
})

FastClick.attach(document.body)
Vue.config.productionTip = false

/**
 * -------------------------- 微信注册 ----------------------
 */
import wechat from './tools/wechat'
wechat.register(['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseWXPay',
    'chooseImage', 'previewImage', 'uploadImage', 'checkJsApi', 'scanQRCode', 'openLocation', 'getLocation','configWXDeviceWiFi',"hideAllNonBaseMenuItem"
], (wx) => {})
/**
 * -------------------------- 注册结束 ----------------------
 */

sync(store, router)
const i18n = new VueI18n({
    locale: 'zh',  // 语言标识
    messages: {
        'zh': require('./assets/lang/zh'),
        'en': require('./assets/lang/en')
    }
})
locale.i18n((key, value) => i18n.t(key, value))
/* eslint-disable no-new */
new Vue({
    store,
    router,
    i18n,
    render: h => h(App)
}).$mount('#app-box')
