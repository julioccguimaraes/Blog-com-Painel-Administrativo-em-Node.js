const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")
const auth = require("../middlewares/auth")

router.get("/admin/users", auth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users })
    })
})

router.get("/admin/users/new", auth, (req, res) => {
    res.render("admin/users/new")
})

router.post("/admin/users/new", auth, (req, res) => {
    // checando se o email já existe
    User.findOne({
        where: {email: req.body.email}
    }).then(user => {
        if(user) {
            res.redirect("/admin/users/new")
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt)
        
            User.create({
                email: req.body.email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users")
            }).catch(error => {
                res.redirect("/admin/users")
            })           
        }
    }).catch(error => {
        res.redirect("/admin/users/new")
    })  
})

router.get('/admin/users/delete/:id', auth, (req, res) => {
    if (req.params.id && !isNaN(req.params.id)) {
        User.destroy({
            where: { id: req.params.id }
        }).then(() => {
            res.redirect("/admin/users")
        })
    } else {
        res.redirect("/admin/users")
    }
})

router.get("/admin/users/edit/:id", auth, (req, res) => {
    if (req.params.id && !isNaN(req.params.id)) {
        User.findByPk(req.params.id).then((user) => {
            if (user) {
                res.render('admin/users/edit', { user })
            } else {
                res.redirect("/admin/users")
            }
        }).catch((error) => {
            res.redirect("/admin/users")
        })
    } else {
        res.redirect("/admin/users")
    }
})

router.post("/admin/users/update/:id", auth, (req, res) => {
    if (req.params.id && !isNaN(req.params.id) && req.body.email) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)

        User.update({
            email: req.body.email,
            password: hash
        }, {
            where: { id: req.params.id }
        }).then(() => {
            res.redirect("/admin/users")
        })
    } else {
        res.redirect('/admin/users')
    }
})

router.get("/login", (req, res) => {
    res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {
    User.findOne({
        where: {email: req.body.email}
    }).then(user => {
        if (user) {
            const correct = bcrypt.compareSync(req.body.password, user.password)

            if(correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")
            } else {
                res.redirect("/login")
            }
        } else {
            res.redirect("/login")
        }
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined

    res.redirect("/")
})

module.exports = router