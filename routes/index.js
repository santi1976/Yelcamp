var express = require("express");
var router = express.Router();
var passport = require ("passport");
var User = require("../models/user");

//root router
router.get("/", function(req, res){
    res.render("landing")
})

//SHOW REGISTER FORM
router.get("/register", function(req, res){
    res.render("register");
});

//crear el registro
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user){
     if(err){
        req.flash("error", err.message); //no hace falta agregar los mensajes de error al crear usuario ( usuario ya registardo, etc) ya están contemplados en Passport, y llamados por err
        return res.redirect("register");
     }
        passport.authenticate("local")(req, res, function(){
        req.flash("success", "Bienvenido a Solo Para Viajeros "+ user.username);
        res.redirect("/campgrounds");

        });
    });
});

//show login form
router.get("/login", function(req, res){
        res.render("login");
});



//handling login logic
router.post("/login", passport.authenticate("local",
    {
    successRedirect: "/campgrounds", // middleware
    failureRedirect: "/login",
    }), function (req, res){
});


//lógica de log out
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Sesión de usuario terminada");
    res.redirect("/campgrounds");
});
module.exports = router;