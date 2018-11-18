// 请确保你的mysql数据库使用utf8编码
// 可以使用`SET NAMES 'utf8';`

const express = require("express")
const bodyParser = require("body-parser")
const Sequelize = require("sequelize")
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require("path")
const fs = require("fs")
const mysqlConfig = require("../config/mysql")
const cors = require("cors")
const hostConfig = require("../config/config")
const generateKey = require("./utils/generateKey")
const MemoryStore = require('session-memory-store')(session)
const CASAuthentication = require('cas-authentication')
const { getIsEveryOneCanLive, allowEveryOneLive, forbidEveryOneLive } = require("../config/config")
const OPERATE = Sequelize.Op
const { adminList } = require("../config/admin")

// 将正在播放的列表存储在内存中, 用于减少mysql的负载
const liveList = []
const cas = new CASAuthentication({
    cas_url: "https://sso.neu.cn/cas",
    service_url: "http://localhost:3000",
    cas_version: "2.0",
    renew: false,
    is_dev_mode: false,
    dev_mode_info: {},
    session_name: "ID",
    destroy_session: true
})

// 使用中间件
const app = express()
app.use(cookieParser())
app.use(session({
    name: "HDTV_SESSION",
    secret: "HDTV_ADMIN_SESSION",
    store: new MemoryStore(),
    resave: false,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(cors())

// 建立数据库
const sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.user,
    mysqlConfig.password, {
        host: mysqlConfig.host,
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        timezone: "+08:00"
    })
const User = sequelize.import(path.resolve(__dirname, "./models/User.js"))

// 同步数据库
sequelize.sync({ force: true }).then((res) => {
    console.log("同步数据库成功!")
    app.listen(3000)
}, (error) => {
    console.log("同步数据库失败!")
    throw new Error(error)
})

// 推流认证路由
app.post("/authorize", (req, res) => {
    const info = req.body
    console.log(info)
    User.findOne({
        where: {
            id: info.name,
            key: info.key
        }
    }).then((user) => {
        if (!user) {
            res.sendStatus(404)
        } else {
            const plainUser = user.get({ plain: true })

            // 如果每个人都能播放的模式下, 检查是否在黑名单中
            if (getIsEveryOneCanLive()) {
                if (plainUser.isInBlackList) {
                    res.sendStatus(404)
                } else {
                    res.sendStatus(200)
                    user.update({
                        isLive: true
                    })
                }
            } else {
                if (plainUser.isInWhiteList) {
                    res.sendStatus(200)
                    user.update({
                        isLive: true
                    })
                } else {
                    res.sendStatus(404)
                }
            }
        }
    })
})

// 节目推流完毕后从liveList中删除
app.post("/liveDone", (req, res) => {
    console.log("live done")
})

// 访问管理界面
app.get("/", cas.bounce, (req, res) => {
    console.log(req.session)
    fs.createReadStream(path.resolve(__dirname, "../dist/index.html")).pipe(res)
})

app.get(hostConfig.authorityRouter, cas.block, (req, res) => {
    const id = req.session.ID
    const authority = adminList.includes(id) ? 2 : 1
    res.status(200).json({
        isSuccess: true,
        authority
    })
})

// 获取直播详细信息
app.get(hostConfig.liveDetailRouter, cas.block, (req, res) => {
    const id = req.session.ID
    User.findOrCreate({
        where: {
            id
        },
        defaults: {
            channelName: id
        }
    }).then((users) => {
        const plainUser = users[0].get({ plain: true })
        res.status(200).json({
            isSuccess: true,
            id,
            key: plainUser.key,
            channelName: plainUser.channelName,
            title: plainUser.title,
            updatedAt: plainUser.updatedAt
        })
    })
})

// 修改直播标题
app.post(hostConfig.chnageLiveTitleRouter, cas.block, (req, res) => {
    console.log("req.body", req.body)
    const id = req.session.ID
    User.findOne({
        where: {
            id
        }
    }).then((user) => {
        if (!user) {
            res.status({
                isSuccess: false,
                error: "为查询到改账号的相关信息"
            })
        } else {
            user.update({
                title: req.body,
                key: generateKey()
            }).then(() => {
                res.status(200).json({
                    isSuccess: true
                })
            }, () => {
                res.status(200).json({
                    isSuccess: false,
                    error: "数据库出了点差错, 请稍后再试"
                })
            })
        }
    })
})

// 获取黑名单
app.get(hostConfig.blackListRouter, cas.block, (req, res) => {
    const id = req.session.ID
    if (!adminList.includes(id)) {
        res.sendStatus(401)
        return
    }
    User.findAll({
        where: {
            isInBlackList: true
        }
    }).then((users) => {
        const list = []
        for (user of users) {
            user = user.get({ plain: true })
            list.push([
                user.id,
                user.channelName,
                user.title
            ])
        }
        res.status(200).json({
            isSuccess: true,
            list
        })
    })
})

// 向黑名单加入用户
app.post(hostConfig.addUserToBlackListRouter, cas.block, (req, res) => {
    const id = req.session.ID
    if (!adminList.includes(id)) {
        res.sendStatus(401)
        return
    }
    User.findOrCreate({
        where: {
            id: req.body
        },
        defaults: {
            channelName: req.body,
            isInBlackList: true
        }
    }).then((users) => {
        const user = users[0]
        user.update({
            isInBlackList: true
        }).then(() => {
            res.status(200).json({
                isSuccess: true
            })
        }, () => {
            res.status(200).json({
                isSuccess: false,
                error: "数据库出了点差错, 请稍后再试"
            })
        })
    })
})

// 从黑名单中删除用户
app.post(hostConfig.deleteUserFromBlackListRouter, cas.block, (req, res) => {
    const id = req.session.ID
    if (!adminList.includes(id)) {
        res.sendStatus(401)
        return
    }
    const parsedBody = JSON.parse(req.body)
    User.findAll({
        where: {
            id: {
                [OPERATE.or]: parsedBody.list
            }
        }
    }).then((users) => {
        for (user of users) {
            user.update({
                isInBlackList: false
            })
        }
    }).then(() => {
        res.status(200).json({
            isSuccess: true
        })
    })
})

// 获取白名单
app.get(hostConfig.whiteListRouter, cas.block, (req, res) => {
    const id = req.session.ID
    if (!adminList.includes(id)) {
        res.sendStatus(401)
        return
    }
    User.findAll({
        where: {
            isInWhiteList: true
        }
    }).then((users) => {
        const list = []
        for (user of users) {
            user = user.get({ plain: true })
            list.push([
                user.id,
                user.channelName,
                user.title
            ])
        }
        res.status(200).json({
            isSuccess: true,
            list
        })
    })
})

// 向白名单添加用户
app.post(hostConfig.addUserToWhiteListRouter, cas.block, (req, res) => {
    const id = req.session.ID
    if (!adminList.includes(id)) {
        res.sendStatus(401)
        return
    }
    User.findOrCreate({
        where: {
            id: req.body
        },
        defaults: {
            channelName: req.body,
            isInWhiteList: true
        }
    }).then((users) => {
        const user = users[0]
        user.update({
            isInWhiteList: true
        }).then(() => {
            res.status(200).json({
                isSuccess: true
            })
        }, () => {
            res.status(200).json({
                isSuccess: false,
                error: "数据库出了点差错, 请稍后再试"
            })
        })
    })
})

// 从白名单删除用户
app.post(hostConfig.deleteUserFromWhiteListRouter, cas.block, (req, res) => {
    const id = req.session.ID
    if (!adminList.includes(id)) {
        res.sendStatus(401)
        return
    }
    const parsedBody = JSON.parse(req.body)
    User.findAll({
        where: {
            id: {
                [OPERATE.or]: parsedBody.list
            }
        }
    }).then((users) => {
        for (user of users) {
            user.update({
                isInWhiteList: false
            })
        }
    }).then(() => {
        res.status(200).json({
            isSuccess: true
        })
    })
})

// 允许所有人直播, 只禁止黑名单内用户
app.get(hostConfig.allowEveryOneLiveRouter, cas.block, (req, res) => {

})

// 禁止所有人直播, 只允许白名单内用户
app.get(hostConfig.forbidEveryOneLiveRouter, cas.block, (req, res) => {

})

// 退出登陆
app.get(hostConfig.logoutRouter, cas.logout)

app.use(express.static(path.resolve(__dirname, "../dist")))
