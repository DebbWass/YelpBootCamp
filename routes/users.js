var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Campground = require("../models/campground");


//USERS PROFILES

router.get('/:id', async function(req, res) {
  try {
    let user = await User.findById(req.params.id).populate('followers').exec();
	let campgrounds = await  Campground.find().where("author.id").equals(user._id).exec(); 
    res.render('./users/show', { user: user , campgrounds: campgrounds });
  } catch(err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});


// router.get("/:id", function(req,res){
// 	User.findById(req.params.id, function(err, foundUser){
// 		if(err){
// 			console.log(err.message);
// 			req.flash("error", err.message);
// 			res.redirect("/");
// 		} else {
// 			//eval(require("locus"));
// 			Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
// 				if(err){
// 					console.log(err.message);
// 					req.flash("error", err.message);
// 					res.redirect("/");
// 				}
// 				res.render("./users/show", {user: foundUser, campgrounds: campgrounds});
// 			});
// 		}
// 	});
	
// });

module.exports = router;