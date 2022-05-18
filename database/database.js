const sequelize = require('sequelize')

const connect = new sequelize('blog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connect