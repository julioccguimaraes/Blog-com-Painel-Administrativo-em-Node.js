const express = require('express')
const router = express.Router()
const Category = require("./Category")
const slugify = require("slugify")
const auth = require("../middlewares/auth")

router.get("/admin/categories/new", auth, (req, res) => { // router segue mesma estrutura do express.get. Router usa quando está em outro arquivo.
    res.render('admin/categories/new')
})

router.get('/admin/categories', auth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render('admin/categories/index', { categories })
    })
})

router.post("/admin/categories/save", auth, (req, res) => {
    if (req.body.title) {
        Category.create({
            title: req.body.title,
            slug: slugify(req.body.title)
        }).then(() => {
            res.redirect("/admin/categories")
        })
    } else {
        res.redirect('/admin/categories/new')
    }
})

router.get('/admin/categories/delete/:id', auth, (req, res) => {
    if (req.params.id && !isNaN(req.params.id)) {
        Category.destroy({
            where: { id: req.params.id }
        }).then(() => {
            res.redirect("/admin/categories")
        })
    } else {
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", auth, (req, res) => {
    if (req.params.id && !isNaN(req.params.id)) {
        Category.findByPk(req.params.id).then((category) => {
            if (category) {
                res.render('admin/categories/edit', { category })
            } else {
                res.redirect("/admin/categories")
            }
        }).catch((error) => {
            res.redirect("/admin/categories")
        })
    } else {
        res.redirect("/admin/categories")
    }
})

router.post("/admin/categories/update/:id", auth, (req, res) => {
    if (req.params.id && !isNaN(req.params.id) && req.body.title) {
        Category.update({
            title: req.body.title,
            slug: slugify(req.body.title)
        }, {
            where: { id: req.params.id }
        }).then(() => {
            res.redirect("/admin/categories")
        })
    } else {
        res.redirect('/admin/categories')
    }
})

module.exports = router