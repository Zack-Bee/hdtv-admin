module.exports =  {
    hdtvLiveBaseUrl: "https://hdtv.neu6.edu.cn/v1/live/",

    // .m3u8的基本地址
    baseHlsUlr: "202.118.1.139:8080/hls/",

    // 推流直播的基本地址
    baseLiveUrl: "rtmp://202.118.1.139:8080/neu/",

    // http主机地址
    httpHost: "http://127.0.0.1:3000",

    // 登陆
    loginRouter: "/login",

    // 删除用户
    deleteUserRouter: "/deleteUser",

    // 删除管理员
    deleteAdminRouter: "/deleteAdmin",

    // 添加用户
    addUserRouter: "/addUser",

    // 增加管理员
    addAdminRouter: "/addAdmin",

    // 修改密码
    changePasswordRouter: "/changePassword",

    // 得到用户列表
    userListRouter: "/userList",

    // 得到管理员列表
    adminListRouter: "/adminList",

    // 得到直播的详细信息
    liveDetailRouter: "/liveDetail"
}