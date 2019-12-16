// 登录页面
const login = r => require(["@/views/login"], r);
const loginPath = r => require(["@/views/loginPath"], r);
const loginBlank = r => require(["@/views/loginBlank"], r);
//公共组件
const aboutUs = r => require(["@/views/common/about-us"], r);
const FAQ     = r => require(["@/views/common/FAQ"], r);
//充电桩项目
const tab1          = r => require(["@/views/tab1"], r);
const allowspage    = r => require(["@/views/allowspage"], r);
const personallogin = r => require(["@/views/personallogin"], r);
const tab2          = r => require(["@/views/tab2"], r);
const tab3          = r => require(["@/views/tab3"], r);
const tab4          = r => require(["@/views/tab4"], r);
const qrCode        = r => require(["@/views/qrCode"], r);
const chargeStation = r => require(["@/views/charge-station"], r);
const payment       = r => require(["@/views/payment"], r);
const me            = r => require(["@/views/module/me"], r);
// 电表
const balanceRecharge = r => require(["@/views/module/balance-recharge"], r);
// const shortMoney      = r => require(["@/views/module/short-money"], r);

const rechargeRecord = r => require(["@/views/module/recharge-record"], r);
const billingRecords = r => require(["@/views/billingRecords"], r);
const loginCharge    = r => require(["@/views/operator/loginCharge"], r);

const batteryRecord    = r => require(["@/views/module/battery-record"], r);
const newbatteryRecord = r => require(["@/views/module/newbattery-record"], r);
const Charging         = r => require(["@/views/module/Charging"], r);
const jumpCode         = r => require(["@/views/jumpCode"], r);
const aboutpublic      = r => require(["@/views/aboutpublic"], r);
//运营商端
const loginPlatform  = r => require(["@/views/operator/loginPlatform"], r);
const home           = r => require(["@/views/operator/home"], r);
const earnings       = r => require(["@/views/operator/earnings"], r);
const alarm          = r => require(["@/views/operator/alarm"], r);
const alarmDetail    = r => require(["@/views/operator/alarm-detail"], r);
const alarmChange    = r => require(["@/views/operator/alarmChange"], r);
const myCenter       = r => require(["@/views/operator/my-center"], r);
const changePassword = r => require(["@/views/operator/changePassword"], r);
const personalData   = r => require(["@/views/operator/personal-data"], r);
const devManagage    = r => require(["@/views/operator/dev-manage"], r);
const areaManage     = r => require(["@/views/operator/area-manage"], r);
const socketManage   = r => require(["@/views/operator/socket-manage"], r);
const extra          = r => require(["@/views/operator/extra"], r);
//电表预付费充值
const meterVending = r => require(['@/views/meterVending'], r);
// 用户端我的
const personal = r => require(['@/views/personal'], r);
//管理端路径
const manageIndex     = r => require(['@/views/management/manageIndex'], r);
const manageIndexV1     = r => require(['@/views/management/manageIndexv1'], r);
const manageAb        = r => require(['@/views/management/manageAb'], r);
const manageRecord    = r => require(['@/views/management/manageRecord'], r);
const manageRecharge  = r => require(['@/views/management/manageRecharge'], r);
const manageAccount   = r => require(['@/views/management/manageAccount'], r);
const manageAbchange  = r => require(['@/views/management/manageAbchange'], r);
const manageBar       = r => require(['@/views/management/manageBar'], r);
const manageCenter    = r => require(['@/views/management/manageCenter'], r);
const manageAlarmuser = r => require(['@/views/management/manageAlarmuser'], r);
const manageBalance   = r => require(['@/views/management/manageBalance'], r);
const manageRefund    = r => require(['@/views/management/manageRefund'], r);
// const manageRealarm = r => require(['@/views/management/manageRealarm'], r);
const manageTry       = r => require(['@/views/management/manageTry'], r);
const manageFund      = r => require(['@/views/management/manageFund'], r);
const manageEleprice  = r => require(['@/views/management/manageEleprice'], r);
const manageEleedit   = r => require(['@/views/management/manageEleedit'], r);
const manageChargingEleedt  = r => require(['@/views/management/manageChargingEleedt'], r);
const managePut       = r => require(['@/views/management/managePut'], r);
const managePutRecord = r => require(['@/views/management/managePutRecord'], r);
const putRecordDetail = r => require(['@/views/management/putRecordDetail'], r);
const equipmentnew    = r => require(['@/views/management/equipmentnew'], r);
const editor          = r => require(['@/views/management/editor'], r);

const manageDevice = r => require(['@/views/management/manageDevice'], r);
const manageLine   = r => require(['@/views/management/manageLine'], r);
const manageBind  = r => require(['@/views/management/manageBind'], r);
const instrument   = r => require(["@/views/instrument"], r);
const manageinstr   = r => require(["@/views/management/manageinstr"], r);
const scanAdd   = r => require(["@/views/management/scanAdd"], r);
const feedback   = r => require(["@/views/management/feedback"], r);
const newFeedBack   = r => require(["@/views/management/newFeedBack"], r);
const feedSuccess   = r => require(["@/views/management/feedSuccess"], r);
const backDetail   = r => require(["@/views/management/backDetail"], r);
const blank   = r => require(["@/views/management/blank"], r);
const abnormal   = r => require(["@/views/management/abnormal"], r);
const chargeCar   = r => require(["@/views/management/charging-car"], r);
const chargingnew    = r => require(['@/views/management/charging-new'], r);
// const meterPaid    = r => require(["@/views/meterPaid"], r);
const meterLow     = r => require(["@/views/meterLow"], r);
const chargeRecord = r => require(['@/views/chargeRecord'], r);
const meterBase    = r => require(['@/views/meterBase'], r);
const dumpMeter    = r => require(['@/views/dumpMeter'], r);
const equipment    = r => require(['@/views/equipment'], r);
const moneySuccess = r => require(['@/views/moneySuccess'], r);
const houSuccess   = r => require(['@/views/houSuccess'], r);
const putSuccess   = r => require(['@/views/putSuccess'], r);
const resetSuccess = r => require(['@/views/resetSuccess'], r);
const remindCharge = r => require(['@/views/module/remindCharge'], r);
const skip         = r => require(['@/views/skip'], r);
const binding      = r => require(['@/views/operator/binding'], r);
const skipSuccess  = r => require(['@/views/skipSuccess'], r);

const wifiConfig = r => require(['@/views/wifiConfig'], r);
const upOpreator = r => require(['@/views/upOpreator'], r);
const nextRegister = r => require(['@/views/nextRegister'], r);
const landlord = r => require(['@/views/landlord'], r);
const scanPage = r => require(['@/views/scanPage'], r);
const rentRecord = r => require(['@/views/management/rentRecord'], r);
const unpaidRecord = r => require(['@/views/management/unpaidRecord'], r);
const manageRoom = r => require(['@/views/management/manageRoom'], r);
const editRoom = r => require(['@/views/management/editRoom'], r);
const rentConfiguration = r => require(['@/views/management/rentConfiguration'], r);
const monthConsumption = r => require(['@/views/management/monthConsumption'], r);
const tenantsRecord = r => require(['@/views/management/tenantsRecord'], r);
const payRent = r => require(['@/views/management/payRent'], r);
const searchTenant = r => require(['@/views/management/searchTenant'], r);
const vux = r => require(['@/views/management/vux'], r);
const pickMeter = r => require(['@/views/management/pickMeter'], r);
// 根目录
const routes = [
    // {
    //     path    : "/",
    //     redirect: {
    //         path: "/login"
    //     },
    //     meta: {
    //         title: "欢迎使用电充蜂"
    //     }
    // },
    // 登录页
    {
        path     : "/login",
        name     : "login",
        component: login,
        meta     : {
            title: "欢迎使用电充蜂"
        }
    },
    {
        path     : "/loginPath",
        name     : "loginPath",
        component: loginPath,
        meta     : {
            title: "欢迎使用电充蜂"
        }
    },
    {
        path     : "/loginBlank",
        name     : "loginBlank",
        component: loginBlank,
        meta     : {
            title: "欢迎使用电充蜂"
        }
    },
    // 运营商端
    {
        path     : "/socketManage/:id",
        name     : "socketManage",
        component: socketManage,
        meta     : {
            title: "插头管理"
        }
    },
    {
        path     : "/devManagage",
        name     : "devManagage",
        component: devManagage,
        meta     : {
            title: "设备管理"
        }
    },
    {
        path     : "/areaManage",
        name     : "areaManage",
        component: areaManage,
        meta     : {
            title: "区域管理"
        }
    },
    {
        path     : "/personalData",
        name     : "personalData",
        component: personalData,
        meta     : {
            title: "个人资料"
        }
    },
    {
        path     : "/changePassword",
        name     : "changePassword",
        component: changePassword,
        meta     : {
            title: "修改密码"
        }
    },
    {
        path     : "/myCenter",
        name     : "myCenter",
        component: myCenter,
        meta     : {
            title: "我的"
        }
    },

    {
        path     : "/alarmChange",
        name     : "alarmChange",
        component: alarmChange,
        meta     : {
            title: "异常警告"
        }
    },
    {
        path     : "/home",
        name     : "home",
        component: home,
        meta     : {
            title: "首页"
        }
    },
    {
        path     : "/earnings",
        name     : "earnings",
        component: earnings,
        meta     : {
            title: "数据报表"
        }
    },
    {
        path     : "/loginCharge",
        name     : "loginCharge",
        component: loginCharge,
        meta     : {
            title: "充电管理平台"
        }
    },
    {
        path     : "/loginPlatform",
        name     : "loginPlatform",
        component: loginPlatform,
        meta     : {
            title: "管理平台"
        }
    },
    {
        path     : "/alarm",
        name     : "alarm",
        component: alarm,
        meta     : {
            title: "异常告警"
        }
    },
    //个人端
    {
        path     : "/FAQ",
        component: FAQ,
        name     : "FAQ",
        meta     : {
            title: "常见问题"
        }
    },
    {
        path     : "/aboutUs",
        component: aboutUs,
        name     : "aboutUs",
        meta     : {
            title: "关于我们"
        }
    },
    {
        path     : "/tab1",
        component: tab1,
        name     : "tab1",
        meta     : {
            title: '充电分布'
        }
    },
    {
        path     : "/allowspage",
        component: allowspage,
        name     : "allowspage",
        meta     : {
            // title: '电表充值'
            title: ''
        }
    },
    {
        path     : "/personallogin",
        component: personallogin,
        name     : "personallogin",
        meta     : {
            // title: '我的'
            title: ''
        }
    },


    {
        path     : "/tab2/:id",
        component: tab2,
        name     : "充电中",
        meta     : {
            title: "充电中"
        }
    },
    {
        path     : "/tab4/:id",
        component: tab4,
        name     : "充电详情",
        meta     : {
            title: "充电详情"
        }
    },
    {
        path     : "/tab3",
        component: tab3,
        name     : "tab3",
        meta     : {
            title: "我的"
        }
    },
    {
        path     : "/chargeStation/:type/:id/:ownerid",
        component: chargeStation,
        name     : "充电站",
        meta     : {
            title: "充电站"
        }
    },
    {
        path     : "/payment/:type/:id/:dcuaddress",
        component: payment,
        name     : "付款",
        meta     : {
            title: "付款"
        }
    },

    {
        path     : "/me",
        component: me,
        name     : "我的钱包",
        meta     : {
            title: "我的钱包"
        }
    },
    {
        path     : "/balanceRecharge",
        component: balanceRecharge,
        name     : "余额充值",
        meta     : {
            title: "余额充值"
        }
    },
    // {
    //     path     : "/shortMoney",
    //     component: shortMoney,
    //     name     : "余额充值",
    //     meta     : {
    //         title: "余额充值"
    //     }
    // },
    {
        path     : "/remindCharge/:chatid",
        component: remindCharge,
        name     : "充电提醒",
        meta     : {
            title: "充电提醒"
        }
    },
    {
        path     : "/rechargeRecord",
        component: rechargeRecord,
        name     : "rechargeRecord",
        meta     : {
            title: "账单记录"
        }
    },
    {
        path     : "/billingRecords",
        component: billingRecords,
        name     : "billingRecords",
        meta     : {
            title: "账单记录"
        }
    },
    // {
    //     path     : "/rechargeRecord/:id",
    //     component: rechargeRecord,
    //     name     : "rechargeRecord",
    //     meta     : {
    //         title: "账单记录"
    //     }
    // },
    {
        path     : "/batteryRecord",
        component: batteryRecord,
        name     : "充电记录",
        meta     : {
            title: "充电记录"
        }
    }, {
        path     : "/newbatteryRecord/:id/:time",
        component: newbatteryRecord,
        name     : "充电详情",
        meta     : {
            title: "详情"
        }
    },

    {
        path     : "/batteryRecord/:id",
        component: batteryRecord,
        name     : "充电记录",
        meta     : {
            title: "充电记录"
        }
    },
    {
        path     : "/Charging",
        component: Charging,
        name     : "正在充电",
        meta     : {
            title: "正在充电"
        }
    },
    {
        path     : "/Charging/:id",
        component: Charging,
        name     : "正在充电",
        meta     : {
            title: "正在充电"
        }
    },
    {
        path     : "/qrCode",
        component: qrCode,
        name     : "qrCode",
        meta     : {
            title: "扫码充电"
        }
    },
    {
        path     : "/jumpCode",
        component: jumpCode,
        name     : "jumpCode",
        meta     : {
            title: "扫一扫"
        }
    },
    {
        path     : "/aboutpublic",
        component: aboutpublic,
        name     : "aboutpublic",
        meta     : {
            title: "关注公众号"
        }
    },
    {
        path     : "/meterVending",
        component: meterVending,
        name     : "meterVending",
        meta     : {
            title: "绑定电表"
        }
    },
    {
        path     : "/instrument",
        component: instrument,
        name     : "instrument",
        meta     : {
            title: "绑定电表"
        }
    },
    {
        path     : "/manageinstr",
        component: manageinstr,
        name     : "manageinstr",
        meta     : {
            title: "绑定电表"
        }
    },
    // {
    //     path     : "/meterPaid",
    //     component: meterPaid,
    //     name     : "meterPaid",
    //     meta     : {
    //         title: "电表充值"
    //     }
    // },
    {
        path     : '/meterLow',
        component: meterLow,
        name     : "meterLow",
        meta     : {
            title: "电表充值"
        }

    }, {
        path     : '/chargeRecord',
        component: chargeRecord,
        name     : "chargeRecord",
        meta     : {
            title: "充电记录"
        }

    },
    {
        path     : '/meterBase',
        component: meterBase,
        name     : "meterBase",
        meta     : {
            title: "剩余电量"
        }

    },
    {
        path     : '/dumpMeter',
        component: dumpMeter,
        name     : "dumpMeter",
        meta     : {
            title: "用电量查询"
        }

    },
    {
        path     : '/equipment',
        component: equipment,
        name     : "equipment",
        meta     : {
            title: "设备信息"
        }

    }, {
        path     : '/skip',
        component: skip,
        name     : "skip",
        meta     : {
            title: "绑定微信"
        }

    },
    {
        path     : '/binding',
        component: binding,
        name     : "binding",
        meta     : {
            title: "绑定"
        }

    },

    {
        path     : '/moneySuccess',
        component: moneySuccess,
        name     : "moneySuccess",
        meta     : {
            title: "充值成功"
        }

    },
    {
        path     : '/putSuccess',
        component: putSuccess,
        name     : "putSuccess",
        meta     : {
            title: "提现成功"
        }

    },
    {
        path     : '/houSuccess',
        component: houSuccess,
        name     : "houSuccess",
        meta     : {
            title: "充值成功"
        }

    },
    {
        path     : '/resetSuccess',
        component: resetSuccess,
        name     : "resetSuccess",
        meta     : {
            title: "清零成功"
        }

    },
    {
        path     : '/skipSuccess',
        component: skipSuccess,
        name     : "skipSuccess",
        meta     : {
            title: "清零成功"
        }

    },
    {
        path     : '/equipmentnew',
        component: equipmentnew,
        name     : "equipmentnew",
        meta     : {
            title: "新增设备"
        }

    },
    {
        path     : '/equipmentnew/:id',
        component: equipmentnew,
        name     : "equipmentnew",
        meta     : {
            title: "新增设备"
        }

    },
    {
        path     : '/editor',
        component: editor,
        name     : "editor",
        meta     : {
            title: "编辑设备信息"
        }

    },
    {
        path     : '/personal',
        component: personal,
        name     : 'personal',
        meta     : {
            title: '我的'
        }
    },
    {
        path     : '/manageBar',
        component: manageBar,
        name     : 'manageBar',
        redirect : '/manageBar/manageIndexV1',
        meta     : {
            title: '首页'
        },
        children: [{
                path     : 'manageIndex',
                component: manageIndex,
                name     : 'manageIndex',
                meta     : {
                    title: '首页'
                }
            },
            {
                path     : 'manageAb',
                component: manageAb,
                name     : 'manageAb',
                meta     : {
                    title: '异常告警'
                }
            },
            {
                path     : 'manageCenter',
                component: manageCenter,
                name     : 'manageCenter',
                meta     : {
                    title: '我的'
                }
            }
        ]
    }, {
        path     : '/manageBar',
        component: manageBar,
        name     : 'manageBar',
        redirect : '/manageBar/manageIndexV1',
        meta     : {
            title: '首页'
        },
        children: [{
                path     : 'manageIndexV1',
                component: manageIndexV1,
                name     : 'manageIndexV1',
                meta     : {
                    title: '首页'
                }
            },
            {
                path     : 'manageAb',
                component: manageAb,
                name     : 'manageAb',
                meta     : {
                    title: '异常告警'
                }
            },
            {
                path     : 'manageCenter',
                component: manageCenter,
                name     : 'manageCenter',
                meta     : {
                    title: '我的'
                }
            }
        ]
    },
    
    {
        path     : '/manageTry',
        component: manageTry,
        name     : 'manageTry',
        meta     : {
            title: '告警电量设置'
        }
    },
    {
        path     : '/manageRecord',
        component: manageRecord,
        name     : 'manageRecord',
        meta     : {
            title: '充电记录'
        }
    },
    {
        path     : '/manageRecharge',
        component: manageRecharge,
        name     : 'manageRecharge',
        meta     : {
            title: '充值'
        }
    },
    {
        path     : '/manageAccount',
        component: manageAccount,
        name     : 'manageAccount',
        meta     : {
            title: '用户 '
        }
    },
    {
        path     : '/manageAccount/:nomal',
        component: manageAccount,
        name     : 'manageAccount',
        meta     : {
            title: '用户 '
        }
    },
    {
        path     : '/manageAbchange',
        component: manageAbchange,
        name     : 'manageAbchange',
        meta     : {
            title: '异常告警'
        }
    }, {
        path     : '/manageAlarmuser',
        component: manageAlarmuser,
        name     : 'manageAlarmuser',
        meta     : {
            title: '电量告警用户'
        }
    },
    {
        path     : '/manageBalance',
        component: manageBalance,
        name     : 'manageBalance',
        meta     : {
            title: '余额详情'
        }
    },
    {
        path     : '/manageFund',
        component: manageFund,
        name     : 'manageFund',
        meta     : {
            title: '退费'
        }
    },
    {
        path     : '/manageRefund',
        component: manageRefund,
        name     : 'manageRefund',
        meta     : {
            title: '退费'
        }
    },
    // {
    //     path: '/manageRealarm',
    //     component: manageRealarm,
    //     name: 'manageRealarm',
    //     meta: {
    //         title: '告警电量阀值'
    //     }
    // },
    {
        path     : '/manageEleprice',
        component: manageEleprice,
        name     : 'manageEleprice',
        meta     : {
            title: '电价管理'
        }
    },
    {
        path     : '/manageEleedit/:show',
        component: manageEleedit,
        name     : 'manageEleedit',
        meta     : {
            title: '电价管理'
        }
    },
    {
        path     : '/manageChargingEleedt/:show',
        component: manageChargingEleedt,
        name     : 'manageChargingEleedt',
        meta     : {
            title: '充电桩电价管理'
        }
    },
    {
        path     : '/managePut',
        component: managePut,
        name     : 'managePut',
        meta     : {
            title: '提现'
        }
    },
    {
        path     : '/managePutRecord',
        component: managePutRecord,
        name     : 'managePutRecord',
        meta     : {
            title: '提现记录'
        }
    },
    {
        path     : '/putRecordDetail/:id',
        component: putRecordDetail,
        name     : 'putRecordDetail',
        meta     : {
            title: '提现记录详情'
        }
    },
    {
        path     : '/manageDevice',
        component: manageDevice,
        name     : 'manageDevice',
        meta     : {
            title: '设备管理'
        }
    },
    {
        path     : '/manageLine',
        component: manageLine,
        name     : 'manageLine',
        meta     : {
            title: '设备数量'
        }
    }, {
        path     : '/wifiConfig',
        component: wifiConfig,
        name     : 'wifiConfig',
        meta     : {
            title: 'WIFI连接配置'
        }
    },{
        path     : '/upOpreator',
        component: upOpreator,
        name     : 'upOpreator',
        meta     : {
            title: '注册运营商'
        }
    },{
        path     : '/nextRegister',
        component: nextRegister,
        name     : 'nextRegister',
        meta     : {
            title: '注册运营商'
        }
    }
    ,{
        path     : '/landlord',
        component: landlord,
        name     : 'landlord',
        meta     : {
            title: '注册成功'
        }
    }
    ,{
        path     : '/scanAdd/:id',
        component: scanAdd,
        name     : 'scanAdd',
        meta     : {
            title: '新增设备'
        }
    }
    ,{
        path     : '/manageBind/:value',
        component: manageBind,
        name     : 'manageBind',
        meta     : {
            title: '绑定电表'
        }
    }
    ,{
        path     : '/feedback',
        component: feedback,
        name     : 'feedback',
        meta     : {
            title: '问题反馈'
        }
    }
    ,{
        path     : '/newFeedBack',
        component: newFeedBack,
        name     : 'newFeedBack',
        meta     : {
            title: '新增反馈'
        }
    }
    ,{
        path     : '/feedSuccess',
        component: feedSuccess,
        name     : 'feedSuccess',
        meta     : {
            title: '问题反馈'
        }
    }
    ,{
        path     : '/backDetail',
        component: backDetail,
        name     : 'backDetail',
        meta     : {
            title: '反馈详情'
        }
    },
    {
        path     : '/scanPage/:code/:type',
        component: scanPage,
        name     : 'scanPage',
        meta     : {

            title: '扫描页'
        }
    },
    {
        path     : '/blank',
        component: blank,
        name     : 'blank',
        meta     : {
            title: '提示'
        }
    },
    {
        path     : '/abnormal',
        component: abnormal,
        name     : 'abnormal',
        meta     : {
            title: '异常'
        }
    },
    {
        path     : '/extra',
        component: extra,
        name     : 'extra',
        meta     : {
            title: '额外充值'
        }
    } 
    ,{
        path     : '/chargeCar/',
        component: chargeCar,
        name     : "chargeCar",
        meta     : {
            title: "充电桩管理"
        }
    },{
        path     : '/chargingnew/',
        component: chargingnew,
        name     : "chargingnew",
        meta     : {
            title: "充电桩管理"
        }
    },{
        path     : '/rentRecord',
        component: rentRecord,
        name     : "rentRecord",
        meta     : {
            title: "房租月收入统计"
        }
    },{
        path     : '/unpaidRecord',
        component: unpaidRecord,
        name     : "unpaidRecord",
        meta     : {
            title: "上月账单未缴纳用户"
        }
    },{
        path     : '/manageRoom',
        component: manageRoom,
        name     : "manageRoom",
        meta     : {
            title: "房间管理"
        }
    },{
        path     : '/editRoom',
        component: editRoom,
        name     : "editRoom",
        meta     : {
            title: "新增/编辑房间"
        }
    },{
        path     : '/rentConfiguration',
        component: rentConfiguration,
        name     : "rentConfiguration",
        meta     : {
            title: "房租配置"
        }
    },
    {
        path     : '/monthConsumption',
        component: monthConsumption,
        name     : "monthConsumption",
        meta     : {
            title: "月用量编辑"
        }
    },
    {
        path     : '/tenantsRecord',
        component: tenantsRecord,
        name     : "tenantsRecord",
        meta     : {
            title: "租客列表"
        }
    },
    {
        path     : '/payRent',
        component: payRent,
        name     : "payRent",
        meta     : {
            title: "缴纳房租"
        }
    },
    {
        path     : '/searchTenant',
        component: searchTenant,
        name     : "searchTenant",
        meta     : {
            title: "选择租户"
        }
    },
    {
        path     : '/vux',
        component: vux,
        name     : "vux",
        meta     : {
            title: "vux组件测试"
        }
    },
    {
        path     : '/pickMeter',
        component: pickMeter,
        name     : "pickMeter",
        meta     : {
            title: "选择已有电表"
        }
    },
    
]


export default routes;
