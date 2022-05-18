const express = require('express')
const router = express.Router()
const Articles = require("../articles/Articles")
const Category = require("../categories/Category")
const slugify = require("slugify")
const auth = require("../middlewares/auth")

router.get("/admin/articles", auth, (req, res) => {
    Articles.findAll({
        include: [{model: Category}]
    }).then((articles) => {
        res.render('admin/articles/index', { articles })
    })
})

router.get("/admin/articles/new", auth, (req, res) => { // router segue mesma estrutura do express.get. Router usa quando está em outro arquivo.
    Category.findAll().then((categories) => {
        res.render("admin/articles/new", { categories })
    })
})

router.post("/admin/articles/save", auth, (req, res) => {
    if (req.body.title && req.body.body) {
        Articles.create({
            title: req.body.title,
            body: req.body.body,
            slug: slugify(req.body.title),
            categoryId: req.body.category_id
        }).then(() => {
            res.redirect("/admin/articles")
        })
    } else {
        res.redirect('/admin/articles/new')
    }
})

router.get('/admin/articles/delete/:id', auth, (req, res) => {
    if (req.params.id && !isNaN(req.params.id)) {
        Articles.destroy({
            where: { id: req.params.id }
        }).then(() => {
            res.redirect("/admin/articles")
        })
    } else {
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", auth, (req, res) => {
    if (req.params.id && !isNaN(req.params.id)) {
        Articles.findByPk(req.params.id).then((article) => {
            if (article) {
                Category.findAll().then((categories) => {
                    res.render('admin/articles/edit', { article, categories })
                })
            } else {
                res.redirect("/admin/articles")
            }
        }).catch((error) => {
            res.redirect("/admin/articles")
        })
    } else {
        res.redirect("/admin/articles")
    }
})

router.post("/admin/articles/update/:id", auth, (req, res) => {
    if (req.params.id && !isNaN(req.params.id) && req.body.title) {
        Articles.update({
            title: req.body.title,
            body: slugify(req.body.body),
            slug: slugify(req.body.title),
            categoryId: req.body.category_id
        }, {
            where: { id: req.params.id }
        }).then(() => {
            res.redirect("/admin/articles")
        })
    } else {
        res.redirect('/admin/articles')
    }
})

router.get("/articles/page/:num", (req, res) => {
    const elemPerPage = 4
    const page = req.params.num
    let offset = 0;
    
    if(isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * elemPerPage;
    }

    Articles.findAndCountAll({
        limit: elemPerPage,
        offset: offset,
        order: [['id', 'DESC']],
    }).then(articles => {
        let next = true

        if(offset + elemPerPage >= articles.count) {
            next = false
        }

        const result = {
            next, articles, page: parseInt(page)
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result, categories})
        })
    })
})

module.exports = router