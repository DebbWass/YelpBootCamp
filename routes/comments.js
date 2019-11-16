//======================================
//COMMENTS ROUTES
//======================================
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/new",middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id,function(err, campground){
		if(err || !campground){
			console.log(err);
			req.flash("error", "Campgrounf not found");
			res.redirect("back");
		}else{
			res.render("comments/new",{campground: campground});
		}
	});
	
});

router.post("/",middleware.isLoggedIn, function(req,res){
	//lookp camp
	Campground.findById(req.params.id, function(err, campground){
		if(err || !campground){
			console.log(err);
			req.flash("error", "Campgrounf not found");
			redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					console.log(req.user.username);
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect('/campgrounds/'+ campground._id);
				}
			});
			
		}
	});
});

//Edit Comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if (err || !foundComment){
			console.log(err);
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
		}
	});
	
});

//Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updatedComment){
		if(err || !updatedComment){
			console.log(err);
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/"+ req.params.id);
			
		}
	});
});
//Delete Comments
router.delete("/:comment_id", middleware.checkCommentOwnership , function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCommentOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id, function(err, foundComment){
// 			if(err){
// 				res.redirect("back");
// 			} else {
// 				if(foundComment.author.id.equals(req.user._id)){
// 					next();
// 				} else {
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	} else {
// 		res.redirect("back");
// 	}
// }

module.exports = router;