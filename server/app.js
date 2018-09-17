// 请确保你的mysql数据库使用utf8编码
// 可以使用`SET NAMES 'utf8';`

const express = require("express")
const bodyParser = require("body-parser")
const Sequelize = require("sequelize")
const path = require("path")
const config = require("../config/admin")
const formatDate = require("./utils/formatDate")
const cors = require("cors")
// const multer = require("multer")
// const upload = multer()

const OPERATE = Sequelize.Op

// 将正在播放的列表存储在内存中, 用于减少mysql的负载
const liveList = []

// 使用中间件
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(cors())

// 建立数据库
const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
})
const DatedLive = sequelize.import(path.resolve(__dirname, "./models/DatedLive.js"))
const Live = sequelize.import(path.resolve(__dirname, "./models/Live.js"))
const User = sequelize.import(path.resolve(__dirname, "./models/User.js"))

User.hasMany(DatedLive)
DatedLive.belongsTo(User)

// 同步数据库
sequelize.sync({ force: true }).then((res) => {
    console.log("同步数据库完成!")
    DatedLive.findAll({
        where: {
            isLive: true
        }
    }).then((res) => {
        liveList.push(...res)
        console.log("当前正在直播的列表:")
        console.log(liveList)

        User.create({
            id: "test",
            channelName: "东北大学电视台",
            authority: 3
        }).then(() => {
            DatedLive.create({
                title: "东北大学95周年校庆",
                userId: "test",
                isLive: false,
                isChecked: true,
                key: "1234",
                date: new Date()
            })
        })
    })
    app.listen(3000)
}, (err) => {
    console.log("同步数据库失败!")
    throw new Error(err)
})

// 推流认证路由
app.post("/authorize", (req, res) => {
    console.log(req.body)
    DatedLive.findOne({
        where: {
            date: new Date(),
            isLive: false,
            isChecked: true,
            userId: req.body.name,
            key: req.body.key
        },
        include: [User]
    }).then((live) => {
        if (live) {
            console.log("推流认证成功:\n", req.body.name)
            live.update({
                isLive: true
            }).then(() => {
                console.log(live.get({ plain: true }))
                liveList.push(live)
                res.sendStatus(200)
            })
        } else {
            console.log("推流认证失败:\n", req.body.name)
            res.sendStatus(401)
        }
    }, (err) => {
        console.log("查询认证信息失败!")
        throw new Error(err)
    })
})

// 节目推流完毕后从liveList中删除
app.post("/liveDone", (req, res) => {
    for (let i = 0, len = liveList.length; i < len; i++) {
        let live = liveList[i].get({ plain: true })
        if (req.body.name === live.userId && req.body.key === live.key) {
            liveList[i].update({ isLive: false }).catch((err) => {
                throw new Error(err)
            })
            liveList.splice(i, 1)
            console.log("推流完成:\n", req.body.name)
            break
        }
    }
})

app.post("/dateLive", (req, res) => {

})

app.post("/addUser", (req, res) => {

})

app.post("/addAdmin", (req, res) => {

})

app.post("/checkLive", (req, res) => {

})

app.post("/login", (req, res) => {
    let info = JSON.parse(req.body)
    if (!info) {
        return
    }
    User.findOne({
        where: {
            id: info.id,
            password: info.password
        },
        include: [DatedLive]
    }).then((user) => {
        let response
        if (user) {
            response = {
                isSuccess: true,
                err: ""
            }
        } else {
            response = {
                isSuccess: false,
                err: "账号ID或者密码错误"
            }
        }
        res.status(200).json(response)
        res.end()
    })
})