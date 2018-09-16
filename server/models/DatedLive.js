/**
 * 定义datedLive模块, 在mysql中表示为:
 * +-----------+--------------+------+-----+---------+----------------+
 * | Field     | Type         | Null | Key | Default | Extra          |
 * +-----------+--------------+------+-----+---------+----------------+
 * | title     | varchar(255) | YES  |     | NULL    |                |
 * | date      | date         | YES  |     | NULL    |                |
 * | ownerId   | varchar(255) | YES  |     | NULL    |                |
 * | id        | int(11)      | NO   | PRI | NULL    | auto_increment |
 * | key       | varchar(255) | YES  |     | NULL    |                |
 * | isChecked | tinyint(1)   | YES  |     | NULL    |                |
 * | createdAt | datetime     | NO   |     | NULL    |                |
 * | updatedAt | datetime     | NO   |     | NULL    |                |
 * +-----------+--------------+------+-----+---------+----------------+
 */

module.exports = (sequelize, DataTypes) => (
    sequelize.define("datedLive", {
        title: DataTypes.STRING,
        date: DataTypes.DATEONLY,
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        isLive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        key: DataTypes.STRING,
        isChecked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
)