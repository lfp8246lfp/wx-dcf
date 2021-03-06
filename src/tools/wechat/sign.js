var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15)
}

var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + ''
}

var raw = function (args) {
  var keys = Object.keys(args)
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })

  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}

/**
* @synopsis 签名算法
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/
export const sign = function (ticket, url) {
  return new Promise((resolve) => {
    var ret = {
      jsapi_ticket: ticket,
      nonceStr: createNonceStr(),
      timestamp: createTimestamp(),
      url: url
    }
    var string = raw(ret)
    var JsSHA = require('jssha')
    var shaObj = new JsSHA(string, 'TEXT')
    ret.signature = shaObj.getHash('SHA-1', 'HEX')

    resolve(ret)
  })
}

