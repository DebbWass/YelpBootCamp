var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/", function(req,res){
	//get camps from db:
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log (err);
		}else{
			res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds});
		}
	});
	
});

router.post("/",isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: description, author}
	
	
	//create ne camp
	Campground.create(newCampground, function(err, newlyCreated){
		if (err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
	
	
});

router.get("/new",isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
	}
	});
	
});
//Edit route
router.get("/:id/edit", function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		}else{
			res.render("./campgrounds/edit", {campground: foundCampground});
		}
	});
});

router.put("/:id",function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//DELETE ROUTES

router.delete("/:id", function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}
		res.redirect("/campgrounds");
	})
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = router;