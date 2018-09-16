/**
 * 定义live模块, 在mysql中表示为:
 * +-----------+--------------+------+-----+---------+----------------+
 * | Field     | Type         | Null | Key | Default | Extra          |
 * +-----------+--------------+------+-----+---------+----------------+
 * | title     | varchar(255) | YES  |     | NULL    |                |
 * | date      | date         | YES  |     | NULL    |                |
 * | ownerId   | varchar(255) | YES  |     | NULL    |                |
 * | id        | int(11)      | NO   | PRI | NULL    | auto_increment |
 * | createdAt | datetime     | NO   |     | NULL    |                |
 * | updatedAt | datetime     | NO   |     | NULL    |                |
 * +-----------+--------------+------+-----+---------+----------------+
 */

module.exports = (sequelize, DataTypes) => (
    sequelize.define("live", {
        title: DataTypes.STRING,
        date: DataTypes.DATEONLY,
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    })
)