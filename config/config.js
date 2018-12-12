// 设置是否每个人(除黑名单外用户)都能直播, 默认开启服务时为true, 即允许所有人直播, 
// 可通过forbidEveryOneLiveRouter来设置成false
let isEveryOneCanLive = true

module.exports =  {

    // 设置是否是开发模式
    // 在开发模式下, 会使用MemoryStorage保存session, 对所有请求都提供cookie
    // 在非开发模式下, 会使用redis保存session, 只对同源请求提供cookie
    isDevelopMode: true,

    // 得到是否每个人都能直播的设置
    getIsEveryOneCanLive() {
        return isEveryOneCanLive
    },

    // 允许每个人都能直播, 此时只有黑名单内的用户不能直播
    allowEveryOneLive() {
        isEveryOneCanLive = true
    },

    // 禁止每个人都能直播, 此时只有白名单内的用户能够直播
    forbidEveryOneLive() {
        isEveryOneCanLive = false
    },

    // hdtv直播的基本地址
    hdtvLiveBaseUrl: "https://hdtv.neu6.edu.cn/v1/live/",

    // .m3u8的基本地址
    baseHlsUlr: "202.118.1.139:8080/hls/",

    // 推流直播的基本地址
    baseLiveUrl: "rtmp://202.118.1.139:1935/neu/",

    // http主机地址
    httpHost: "http://v.neu6.edu.cn",

    // cas地址
    casUrl: "https://sso.neu.cn/cas",

    // 获取获取频道名称
    channelNameRouter: "/channelName",

    // 获取直播的详细信息
    liveDetailRouter: "/liveDetail",

    // 获取账号的权限信息
    authorityRouter: "/authority",

    // 修改直播的标题
    chnageLiveTitleRouter: "/changeLiveTitle",

    // 获取黑名单
    blackListRouter: "/blackList",

    // 添加用户到黑名单
    addUserToBlackListRouter: "/addUserToBlackList",

    // 从黑名单中删除用户
    deleteUserFromBlackListRouter: "/deleteUserFromBlackList",

    // 获取白名单
    whiteListRouter: "/whiteList",

    // 添加用户到白名单
    addUserToWhiteListRouter: "/addUserToWhiteList",

    // 从白名单中删除用户
    deleteUserFromWhiteListRouter: "/deleteUserFromWhiteList",

    // 获取是否允许所有人直播的状态
    isAllowEveryOneLiveRouter: "/isAllowEveryOneLive",

    // 设置允许每个人都直播
    allowEveryOneLiveRouter: "/allowEveryOneLive",

    // 设置禁止每个人都直播
    forbidEveryOneLiveRouter: "/forbidEveryOneLive",

    // 退出登陆
    logoutRouter: "/logout"
}