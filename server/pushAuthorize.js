const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const redis = require("redis")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const users = ["test1", "test2", "test"]
const liveList = [{
    name: ""
}]

app.post("/authorize", (req, res) => {
    console.log(req.body)
    let info = req.body
    if (users.includes(info.name)) {
        console.log("accept")
        res.sendStatus(200)
    } else {
        console.log("reject")
        res.sendStatus(404)
    }
})

app.get("/", (req, res) => {
    console.log(1)
})
app.listen(3000)