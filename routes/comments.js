var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by ID
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", "Sitio no encontrado");
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground});
        }     
    })    
});

//Comments create
router.post("/", middleware.isLoggedIn, function (req, res){
    //look up campground using id
    Campground.findById(req.params.id, function (err, campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Sucedió un error")
                    console.log(err)
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success", "Agregó comentario de manera exitosa")
                    res.redirect("/campgrounds/" + campground._id);
                }
            });          

        }
    });

});

//EDIT COMOENT ROUT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No se encuentra el lugar visitado");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function (err, foundComment){
            if(err){          
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });       
    });
});

//COMMENT UPDATE
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findbyIdand remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "El comentario fue eliminado")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;