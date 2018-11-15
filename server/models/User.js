const moment = require("moment")
const generateKey = require("../utils/generateKey")

/**
 * 定义user模块, 在mysql中表示为:
 * +-------------+--------------+------+-----+---------+-------+
 * | Field       | Type         | Null | Key | Default | Extra |
 * +-------------+--------------+------+-----+---------+-------+
 * | id          | varchar(255) | NO   | PRI | NULL    |       |
 * | password    | varchar(255) | YES  |     | NULL    |       |
 * | authority   | int(11)      | YES  |     | NULL    |       |
 * | channelName | varchar(255) | YES  |     | NULL    |       |
 * | createdAt   | datetime     | NO   |     | NULL    |       |
 * | updatedAt   | datetime     | NO   |     | NULL    |       |
 * +-------------+--------------+------+-----+---------+-------+
 */
module.exports = (sequelize, DataTypes) => (
    sequelize.define("user", {
        id: {
            type: DataTypes.STRING,
            validate: {
                isAlphanumeric: true
            },
            primaryKey: true
        },
        channelName: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        isLive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isInBlackList: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isInWhiteList: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        key: {
            type: DataTypes.STRING,
            defaultValue: generateKey()
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: "测试频道"
        }
    })
)
