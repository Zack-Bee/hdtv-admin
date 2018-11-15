// 设置是否每个人都能直播
let isEveryOneCanLive = true

module.exports =  {

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

    hdtvLiveBaseUrl: "https://hdtv.neu6.edu.cn/v1/live/",

    // .m3u8的基本地址
    baseHlsUlr: "202.118.1.139:8080/hls/",

    // 推流直播的基本地址
    baseLiveUrl: "rtmp://202.118.1.139:1935/neu/",

    // http主机地址
    httpHost: "http://127.0.0.1:3000",

    // 得到直播的详细信息
    liveDetailRouter: "/liveDetail",

    // 修改直播的标题
    chnageLiveTitleRouter: "/changeLiveTitle",

    // 获取黑名单
    blackListRouter: "/blackList",

    // 添加用户到黑名单
    addUserToBlackListRouter: "/addUserToBlackList",

    // 从黑名单中删除用户
    deleteUserFromBlackListRouter: "/deleteUserFromBlackList",

    // 获取白名单
    whiteListRouter: "whiteList",

    // 添加用户到白名单
    addUserToWhiteListRouter: "addUserToWhiteList",

    // 从白名单中删除用户
    deleteUserFromWhiteListRouter: "deleteUserFromWhiteList",

    // 设置允许每个人都直播
    allowEveryOneLiveRouter: "allowEveryOneLive",

    // 设置禁止每个人都直播
    forbidEveryOneLiveRouter: "forbidEveryOneLive",

    // 退出登陆
    logoutRouter: "logout"
}