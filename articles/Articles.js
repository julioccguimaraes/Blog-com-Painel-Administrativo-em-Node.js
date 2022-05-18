const sequelize = require("sequelize")
const connection = require("../database/database")
const Category = require("../categories/Category")

const Article = connection.define('articles', {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    },
    body: {
        type: sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article) // tem muitos: uma categoria tem muitos artigos
Article.belongsTo(Category) // pertence a: um artigo pertence a uma categoria

//Article.sync({ force: true }) // para atualizar os relacionamentos criados

module.exports = Article