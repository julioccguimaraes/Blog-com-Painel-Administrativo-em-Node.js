const sequelize = require("sequelize")
const connection = require("../database/database")

const User = connection.define('users', {
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    }
})

// User.sync({ force: true }) // para criar a tabela

module.exports = User