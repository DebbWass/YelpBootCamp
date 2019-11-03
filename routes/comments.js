//======================================
//COMMENTS ROUTES
//======================================
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");


router.get("/new",isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground: campground});
		}
	});
	
});

router.post("/",isLoggedIn, function(req,res){
	//lookp camp
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					console.log(req.user.username);
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+ campground._id);
				}
			});
			
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;