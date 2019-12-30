var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Todo el middleware
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
                // si está logueado el usuario   
                if(req.isAuthenticated()){       
                    Campground.findById(req.params.id, function(err, foundCampground){
                        if(err || !foundCampground){
                            req.flash("error", "Ciudad o lugar no encontrado")
                            res.redirect("back");
                        } else {
                            // si el usuario es creador del post
                            if(foundCampground.author.id.equals(req.user._id)) {
                                next();
                            } else {
                                req.flash("error", "No tiene los permisos para esa acción")
                                res.redirect("back");
                            }
                        }
                    });
                }else {
                    req.flash("error", "Debes iniciar sesión para realizar esa acción")
                    res.redirect("back");
                }
        }
    
middlewareObj.checkCommentOwnership = function(req, res, next) {
            if(req.isAuthenticated()){
                   Comment.findById(req.params.comment_id, function(err, foundComment){
                    if(err || !foundComment){
                        req.flash("error", "Comentario no encontrado");
                        res.redirect("back");
                      }  else {
                          // does user own the comment?
                       if(foundComment.author.id.equals(req.user._id)) {
                           next();
                       } else {
                        req.flash("error", "No tiene los permisos para realizar esa acción")
                        res.redirect("back");
                       }
                      }
                   });
               } else {
                req.flash("error", "Debe iniciar sesión para agregar un comentario")
                res.redirect("back");
         }
 }

middlewareObj.isLoggedIn = function(req, res, next){
        //middleware that will check if user is logged in to perform actions
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Debes iniciar sesión primero");
        res.redirect("/login");
}

module.exports = middlewareObj;