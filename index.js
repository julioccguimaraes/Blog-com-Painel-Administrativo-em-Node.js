const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connect = require("./database/database")
const session = require("express-session")

const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")
const UsersController = require("./users/UsersController")

const Article = require("./articles/Articles")
const Category = require("./categories/Category")

// view engine
app.set('view engine', 'ejs')

// Session
/*
    por padrão o express-session salva a sessão na memória do servidor
    O Redis permite salvar sessões e cache no disco em sistemas mais robustos
*/
app.use(session({
    secret: "qualquercoisatextoaleatorio", // termo qualquer
    cookie: { maxAge: 864000000 } // A sessão precisa de um cookie. Referência para sessão no servidor. 1 dia
}))

// testando sessions
/*
app.get("/session", (req, res) => { // sessão é global na aplicação
    req.session.treinamento = "Formaçã nodejs"
    req.session.ano = 2022
    req.session.user = {user: "julio", email: "julio@com.br"}
    res.send("sessão criada")
})

app.get("/leitura", (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        user: req.session.user
    })
})*/
// fim testando sessions

// static files
app.use(express.static('public'))

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// database
connect.authenticate().then(() => {
    console.log("Success database connect!")
}).catch((error) => {
    console.log(error)
})

app.use("/", CategoriesController) // '/' é o prefixo da rota
app.use("/", ArticlesController)
app.use("/", UsersController)

app.get("/", (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']],
        limit: 4
    }).then((articles) => {
        Category.findAll().then(categories => {
            res.render('index', { articles, categories })
        })
    })
})

app.get("/:slug", (req, res) => {
    Article.findOne({
        where: { slug: req.params.slug }
    }).then((article) => {
        if (article) {
            Category.findAll().then(categories => {
                res.render('article', { article, categories })
            })
        } else {
            res.redirect('/')
        }
    }).catch(error => {
        res.redirect('/')
    })
})

app.get("/category/:slug", (req, res) => {
    Category.findOne({
        where: {
            slug: req.params.slug
        },
        include: { 
            model: Article
        }
    }).then((category) => {
        if (category) {
            Category.findAll().then(categories => {
                res.render('index', { articles: category.articles, categories }) // categories pois usa na navbar
            })
        } else {
            res.redirect('/')
        }
    }).catch(error => {
        res.redirect('/')
    })
})

app.listen(8080, () => {
    console.log("Server is running")
})