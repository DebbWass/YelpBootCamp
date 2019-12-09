var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Campground = require("../models/campground");

//upload pics
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'yelpcampdw', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

//EDIT USER
router.get("/:id/edit", function(req,res){
	User.findById(req.params.id, function(err, foundUser){
		if(err || !foundUser){
			console.log(err);
			req.flash("error", "User not found");
			res.redirect("/campgrounds");
		} else{
				res.render("./users/edit", {user: foundUser});
		}
	});
	
});
//UPDATE USER
router.put("/:id", upload.single('avatar'), function(req,res){
	if(req.file === undefined){
		User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
			if(err){
				req.flash("error", err.message);
				res.redirect("back");
			} else {
				req.flash("success","Successfully Updated!");
				res.redirect("/users/" + user._id);
			}
    	});
	} else {
		cloudinary.uploader.upload(req.file.path, function(result) {
			req.body.user.avatar= result.secure_url;
			User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
				if(err){
					req.flash("error", err.message);
					res.redirect("back");
				} else {
					req.flash("success","Successfully Updated!");
					res.redirect("/users/" + user._id);
				}
			});
		});
	
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