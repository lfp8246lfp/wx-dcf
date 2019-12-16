import wx from 'weixin-js-sdk'
import {
    sign
} from './sign.js'
import {
    GetTicket,
    FetchWx2Qiniu,
    GetOpenIdByCode,
    GetUserInfoFromWechat,
    AddUserInfo,
    getSubscribeByOpenId
} from './api.js'
// import {CryptoJS} from './aes.js';
var userItem = JSON.parse(localStorage.getItem("userItem"));
const getCurrentUrl = () => {
    let href  = window.location.href
    let index = href.indexOf('#')
    return (index === -1) ? href: href.substring(0, index)
}
const getRad = (d) => {

    var PI = Math.PI
    return d * PI / 180.0;
}

const getBaseUrl = () => {
    let href  = window.location.href
    let index = href.indexOf('?')
    return (index === -1) ? href: href.substring(0, index)
}


const getUrlParam = (key, url) => {
    let reg   = new RegExp('[?|&]' + key + '=([^&]+)')
    let match = url.match(reg)
    return match && match[1]
}

const getEntry = () => {
    let href = window.location.href
    sdfs
    let index = href.indexOf('#')
    return (index === -1) ? href: href.substring(index + 1)
}
/**
 * 加密
 * @returns {*}
 */
const encrypt = (word) => {
    var key       = CryptoJS.enc.Utf8.parse("fas@zpepc.com.cn");
    var srcs      = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode   : CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

/**
 * 解密
 * @param word
 * @returns {*}
 */
const decrypt = (word) => {
    var key     = CryptoJS.enc.Utf8.parse("fas@zpepc.com.cn");
    var decrypt = CryptoJS.AES.decrypt(word, key, {
        mode   : CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

/**
 * ES6: base64解码
 */
const decodeBase64Content = (base64Content) => {
    let commonContent = base64Content;
        commonContent = Buffer.from(commonContent, 'base64').toString();
    return commonContent;
}

export default {
    fnc(base64Content) {
        let commonContent = base64Content;
            commonContent = Buffer.from(commonContent, 'base64').toString();
        return commonContent;
    },
    register(permissions, callback) {
        let _this = this
        wx.ready(() => {
            _this.getMyLocation()
            wx.hideAllNonBaseMenuItem();
            callback(wx)
        })
        wx.error(function (res) {
            //  alert('注册jssdk失败!'+JSON.stringify(res))
        })

        let url   = getCurrentUrl()
        let appid = getUrlParam('mpid', url)

        return GetTicket(appid).then(data => {
            // alert(JSON.stringify(data))
            let url = getCurrentUrl()
            return sign(data.tick, url)
        }).then(encrypt => {
            wx.config({
                beta     : true,                //开启内测接口调用，注入wx.invoke
                debug    : false,               // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId    : appid,               // 必填，公众号的唯一标识
                timestamp: encrypt.timestamp,   // 必填，生成签名的时间戳
                nonceStr : encrypt.nonceStr,    // 必填，生成签名的随机串
                signature: encrypt.signature,   // 必填，签名，见附录1
                jsApiList: permissions          // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
        })
    },
    callqrCode() {
        wx.scanQRCode({
            needResult: 1,                // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType  : ["qrCode"],       // 可以指定扫二维码还是一维码，默认二者都有
            success   : function (res) {
                var result = res.resultStr;  // 当needResult 为 1 时，扫码返回的结果
                // try {
                //     var decryptstr = decodeBase64Content(result);
                //     if (decryptstr.length > 30) {
                //         if (decryptstr.substring(0, 23) == 'http://bee.statesky.cn') { //判断是否是我们自己的二维码，其他二维码不处理
                //             window.location.href = decryptstr; //因为我这边是扫描后有个链接，然后跳转到该页面
                //         } else {
                //             alert("请扫描正确的充电插头二维码。");
                //         }
                //     } else {
                //         alert("请扫描正确的充电插头二维码。");
                //     }
                // } catch (err) {
                //     alert("请扫描正确的充电插头二维码。");
                // }
                window.location.href = result;  //因为我这边是扫描后有个链接，然后跳转到该页面
            }
        });
    },
    goDeviceLocation(latitude, longitude, rtuname, address) { //调用微信地图定位设备位置
        wx.openLocation({
            latitude : latitude,    // 纬度，浮点数，范围为90 ~ -90
            longitude: longitude,   // 经度，浮点数，范围为180 ~ -180。
            name     : rtuname,     // 位置名
            address  : address,     // 地址详情说明
            scale    : 28           // 地图缩放级别,整形值,范围从1~28。默认为最大
        });
    },
    configWXDeviceWiFi() {
        wx.invoke('configWXDeviceWiFi', function (res) {
            console.log('getWXDeviceTicket', res);
            if(res.err_msg == 'configWXDeviceWiFi:ok') {
                //配置成功
            } else {
                //配置失败
            }
        });
    },
    getFlatternDistance(lat1, lng1, lat2, lng2) { //计算2个点的距离位置
        var EARTH_RADIUS = 6378137.0
        var f            = getRad((lat1 + lat2) / 2);
        var g            = getRad((lat1 - lat2) / 2);
        var l            = getRad((lng1 - lng2) / 2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s, c, w, r, d, h1, h2;
        var a  = EARTH_RADIUS;
        var fl = 1 / 298.257;

        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;

        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;

        w  = Math.atan(Math.sqrt(s / c));
        r  = Math.sqrt(s * c) / w;
        d  = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;

        return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
    },

    getMyLocation() {

        //获取用户当前经纬度信息
        wx.getLocation({
            type   : 'gcj02',          // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {

                sessionStorage.setItem("Location", JSON.stringify(res));
                var latitude  = res.latitude;   // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude;  // 经度，浮点数，范围为180 ~ -180。
                var speed     = res.speed;      // 速度，以米/每秒计
                var accuracy  = res.accuracy;   // 位置精度
            }
        });

    },
    chooseImg(params) {
        return new Promise((resolve, reject) => {
            params.success = (res) => {
                resolve(res)
            }
            params.fail = (err) => {
                reject(err)
            }
            wx.chooseImage(params)
        })
    },
    previewImg(params) {
        return new Promise((resolve, reject) => {
            params.success = (res) => {
                resolve(res)
            }
            params.fail = (err) => {
                reject(err)
            }

            wx.previewImage(params)
        })
    },

    uploadImg(params) {
        return new Promise((resolve, reject) => {
            let url   = getCurrentUrl()
            let appid = getUrlParam('mpid', url)

            params.success = (res) => {
                resolve(res)
            }
            params.fail = (err) => {
                reject(err)
            }

            wx.uploadImage(params)
        }).then(res => {
            // 默认上传成功，拉取资源到七牛
            let mediaId = res.serverId
            return GetTicket(appid).then(data => {
                return FetchWx2Qiniu({
                    souce     : 'https://api.weixin.qq.com/cgi-bin/media/get?access_token=' + data.token + '&media_id=' + mediaId,
                    targetName: mediaId
                })
            })
        }).catch(err => {
            // alert("七牛" + err)
        })
    },

// 微信授权
    getOpenId(appid, code) {
        console.log("微信授权成功")
        return new Promise(function (resolve, reject) {
            let parameter
            parameter = {
                randmonid: Math.ceil(Math.random() * 100).toString(),
                code     : code,
                appid    : appid
            }
            GetOpenIdByCode(parameter).then(res => {
                if (res.mpOpUserItem != null) {
                    console.log("openid信息" + res.mpOpUserItem.openid);
                    if (res.mpOpUserItem.openid != null) {
                        localStorage.setItem("userItem", JSON.stringify(res.mpOpUserItem));
                        localStorage.setItem("access_token", res.accessToken);
                        resolve(res.mpOpUserItem);
                    }

                } else {
                    alert("微信授权失败")
                }
            })
        })
    },
    getSubscribe(appid, openid) {
        return new Promise(function (resolve, reject) {
            let parameter
            parameter = {
                randmonid: Math.ceil(Math.random() * 100).toString(),
                openid   : openid,
                appid    : appid
            }
            getSubscribeByOpenId(parameter).then(res => {
                if (res.mpOpUserItem != null) {
                    console.log("获取关注信息" + JSON.stringify(res.mpOpUserItem));
                    if (res.mpOpUserItem.openid != null) {
                        localStorage.setItem("userItem", JSON.stringify(res.mpOpUserItem));
                        resolve(res.mpOpUserItem);
                    }
                } else {
                    alert("获取关注状态失败")
                }
            })
        })
    },
    getUserInfo(token) {
        return GetUserInfoFromWechat(token)
    },
    jumpLogin() {

        let url   = getCurrentUrl()
        let entry = getEntry();

        window.location.replace(url +
            "&entry=" + entry + "/#login")
    },
    jumpAllowspage() {

        let url   = getCurrentUrl()
        let entry = getEntry();

        window.location.replace(url + "&entry=" + entry + "/#allowspage")
    },
    wxAuthJump() {

        //根据appid和entry需要去的功能入口，跳转对应的

        let url = getCurrentUrl() + "&entry=/tab1/"

        let entry = getUrlParam('entry', url)

        let appid = getUrlParam('mpid', url)

        let code = getUrlParam('code', url)
        // let authtype = getUrlParam('authtype', url)
        // alert("wxAuthJump:" + entry)
        while (entry.endsWith('/'))
            entry = entry.substring(0, entry.length - 1)


        // alert("wxAuthJump:" + entry)
        //如果需要认证

        //如果已经有了code，说明认证完成，去更新用户信息

        if (code != null) {
            //alert('有code')

            this.getOpenId(appid, code)
                .then((res) => {

                    window.location.replace(url + "#" + entry)
                })
        } else {
            //alert(' 没有code')
            //跳转
            let targetUrl = getBaseUrl(url) + "?mpid=" + appid +
                "&entry=" + entry + "/#login";
            let realUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                appid + "&redirect_uri=" +
                encodeURIComponent(targetUrl) + "&response_type=code&scope=snsapi_base&connect_redirect=1"

            // alert("跳转:" +realUrl)
            window.location.replace(realUrl)

        }

    },
    wxAuthPath() {

        //根据appid和entry需要去的功能入口，跳转对应的
        
        let url = getCurrentUrl()  +"&entry=/blank/"

        let entry = getUrlParam('entry', url)

        let appid = getUrlParam('mpid', url)

        let code = getUrlParam('code', url)
        // let authtype = getUrlParam('authtype', url)
        // alert("wxAuthJump:" + entry)
        while (entry.endsWith('/'))
            entry = entry.substring(0, entry.length - 1)


        // alert("wxAuthJump:" + entry)
        //如果需要认证

        //如果已经有了code，说明认证完成，去更新用户信息

        if (code != null) {
            //alert('有code')

            this.getOpenId(appid, code)
                .then((res) => {

                    window.location.replace(url + "#" + entry)
                })
        } else {
            //alert(' 没有code')
            //跳转
            let targetUrl = getBaseUrl(url) + "?mpid=" + appid +
                "&entry=" + entry + "/#loginPath";
            let realUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                appid + "&redirect_uri=" +
                encodeURIComponent(targetUrl) + "&response_type=code&scope=snsapi_base&connect_redirect=1"

            // alert("跳转:" +realUrl)
            window.location.replace(realUrl)

        }

    },

    wxAuthJumpele() {
        let url = getCurrentUrl() + "&entry=/meterVending/"

        let entry = getUrlParam('entry', url)

        let appid = getUrlParam('mpid', url)

        let code = getUrlParam('code', url)

        while (entry.endsWith('/'))
            entry = entry.substring(0, entry.length - 1)
            console.log(entry)

        if (code != null) {
            this.getOpenId(appid, code)
                .then((res) => {
                    console.log(123+entry)
                    window.location.replace(url + "#" + entry)
                })
        } else {
            let targetUrl = getBaseUrl(url) + "?mpid=" + appid +
                "&entry=" + entry + "/#allowspage";
            let realUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                appid + "&redirect_uri=" +
                encodeURIComponent(targetUrl) + "&response_type=code&scope=snsapi_base&connect_redirect=1"

            window.location.replace(realUrl)

        }

    },

    wxAuthJumpperson() {
        //根据appid和entry需要去的功能入口，跳转对应的
        let url = getCurrentUrl() + "&entry=/personal/"

        let entry = getUrlParam('entry', url)

        let appid = getUrlParam('mpid', url)

        let code = getUrlParam('code', url)
        // let authtype = getUrlParam('authtype', url)
        //alert("wxAuthJump:" + entry)
        while (entry.endsWith('/'))
            entry = entry.substring(0, entry.length - 1)

        // alert("wxAuthJump:" + entry)
        //如果需要认证

        //如果已经有了code，说明认证完成，去更新用户信息
        console.log(entry)
        if (code != null) {
            //alert('有code')

            this.getOpenId(appid, code)
                .then((res) => {

                    window.location.replace(url + "#" + entry)
                })
        } else {
            //alert(' 没有code')
            //跳转
            let targetUrl = getBaseUrl(url) + "?mpid=" + appid +
                "&entry=" + entry + "/#personallogin";
            let realUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                appid + "&redirect_uri=" +
                encodeURIComponent(targetUrl) + "&response_type=code&scope=snsapi_base&connect_redirect=1"

            // alert("跳转:" +realUrl)

            window.location.replace(realUrl)

        }

    },
    wxAuthJumpblank() {

        //根据appid和entry需要去的功能入口，跳转对应的

        let url = getCurrentUrl()+"&entry=/blank/"

        let entry = getUrlParam('entry', url)

        let appid = getUrlParam('mpid', url)

        let code = getUrlParam('code', url)
        // let authtype = getUrlParam('authtype', url)
        //alert("wxAuthJump:" + entry)
        while (entry.endsWith('/'))
            entry = entry.substring(0, entry.length - 1)

        // alert("wxAuthJump:" + entry)
        //如果已经有了code，说明认证完成，去更新用户信息
        
        if (code != null) {
            //alert('有code')
            this.getOpenId(appid, code)
                .then((res) => {
                    alert(url + "#" + "/blank")
                    window.location.replace(url + "#" + entry)
                })
        } else {
            //alert(' 没有code')
            //跳转
            let targetUrl = getBaseUrl(url) + "?mpid=" + appid +
                "&entry=" + entry + "/#loginBlank";
            let realUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                appid + "&redirect_uri=" +
                encodeURIComponent(targetUrl) + "&response_type=code&scope=snsapi_base&connect_redirect=1"
            // alert("跳转:" +realUrl)
            window.location.replace(realUrl)
        }
    },
}
