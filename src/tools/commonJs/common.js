//时间格式转换
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
};
//时间求差
export function timeDif(beginTime, endTime, hours) {
  var date1 = beginTime  //开始时间  
  var date2 = endTime    //结束时间  

  var date3 = date2.getTime() - date1.getTime() + hours * 3600 * 1000;   //时间差的毫秒数        
  //计算出小时数  

  var days = Math.floor(date3 / (24 * 3600 * 1000))
  var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数 

  let speeds = Math.floor((leave1 / (hours * 3600 * 1000) * 100)) + 1
  if (speeds <= 0) {
    speeds = 0
  } else if (speeds >= 100) {
    speeds = 100
  }


  var hours = Math.floor(leave1 / (3600 * 1000))
  if (hours < 10) {
    hours = "0" + hours
  }
  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000))
  if (minutes < 10) {
    minutes = "0" + minutes
  }
  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000)
  if (seconds < 10) {
    seconds = "0" + seconds
  }

  return {
    time: hours + ":" + minutes + ":" + seconds,
    speeds: speeds
  }
}


//錯誤狀態

export function getErrorMsg(errortype, errorcode) {
  let msg = "";
  if (errortype == "0") {
    msg = "未知错误";
  } else if (errortype == "1") {
    if (errorcode == "0") {
      msg = "成功";
    } else
      if (errorcode == "1") {
        msg = "设备地址不存在";
      } else
        if (errorcode == "2") {
          msg = "设备不在线";
        } else
          if (errorcode == "3") {
            msg = "采集服务未运行";
          } else
            if (errorcode == "4") {
              msg = "通道繁忙";
            } else {
              msg = "异常应答";
            }
  } else if (errortype == "2" || errortype == "3") {
    if (errorcode == "0") {
      msg = "成功";
    } else if (errorcode == "3") {
      msg = "没数据";
    } else if (errorcode == "4") {
      msg = "参数丢失";
    } else if (errorcode == "12") {
      msg = "不支持此数据项";
    } else {
      msg = "小蜂开小差了，请再尝试。";
    }
  } else if (errortype == "4") {
    msg = "通道繁忙";
  } else {
    msg = "其他 未知错误";
  }

  return msg;
}
