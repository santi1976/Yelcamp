var express = require("express");
var router = express.Router();
var Campground= require("../models/campground");
var middleware = require("../middleware"); //no hace falta requerir el archivo index.js porque lo hace automaticamente



//INDEX - show all campgrounds
router.get("/", function(req, res){
    //get all Visited Places from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//CREATE ROUTE - add campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //tomar datos del form y agregarlo al array de lugares
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};   
    //crear nueva visita y agregar a DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirigir nuevamente a sitio
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});


//NEW - nuevo formulario para agregar lugares visitados
router.get("/new", middleware.isLoggedIn, function(req, res){ //se declara primero que el :id OJO
    res.render("campgrounds/new")
});


//SHOW - muestra más info sobre las ciudades / lugares visitados
router.get("/:id", function(req, res){
    //find the campground (ciudad lugar) with ID provided
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Ciudad o lugar no encontrado")
            res.redirect("back")
        } else {
            console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        };
    });
    
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
    
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    });
});

/* //DESTROY COMMENTS IN DELETED CAMPGROUND
const Comment = require('./comment');
campgroundSchema.pre('remove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});
 */



//UPDATE ROUTE

router.put("/:id", function(req, res){
    //find and update the correct post
    Campground.findByIdAndUpdate(req.params.id, req.body.agrupar, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
    //redirect somewhere show page
});

module.exports = router;