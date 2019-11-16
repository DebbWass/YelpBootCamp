var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
var Review = require("../models/review");
var Notification = require("../models/notification");
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//PICS UPLOADS CONFIG
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

router.get("/", function(req,res){
	if(req.query.search){
		const regex = new RegreqExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex}, function(err, allCampgrounds){
			if(err){
				console.log (err);
			}else{
				res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds , page: 'campgrounds'});
			}
		});
	}else{
	//get camps from db:
		Campground.find({}, function(err, allCampgrounds){
			if(err){
				console.log (err);
			}else{
				res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds , page: 'campgrounds'});
			}
		});
	}
});
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'),async function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image;// = req.body.image;
  var desc = req.body.description;
  var author; /*= {
      id: req.user._id,
      username: req.user.username
  }*/
  var price = req.body.price;	
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground; //= {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
	//eval(require('locus'));
	cloudinary.uploader.upload(req.file.path, async function(result) {
	  // add cloudinary url for the image to the campground object under image property
	  
	  image = result.secure_url;
	  // add author to campground
	  author = {
		id: req.user._id,
		username: req.user.username
	  }
		newCampground = {name: name, price: price, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
		
		try{
			let campground = await Campground.create(newCampground);
			let user = await User.findById(req.user._id).populate('followers').exec();
			let newNotification = {
				username: req.user.username,
				campgroundId: campground.id
			}
			for(const follower of user.followers) {
				let notification = await Notification.create(newNotification);
				follower.notifications.push(notification);
				follower.save();
			}
			
			res.redirect(`/campgrounds/${campground.id}`);
		
		} catch(err) {
			req.flash('error', err.message);
      		res.redirect('back');
		}
		
	});
  });
});

router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});


// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments likes").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
//Edit route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
	
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				console.log(err);
				eq.flash("error", "Campground not found");
				res.redirect("/campgrounds")
			}else{
				res.render("./campgrounds/edit", {campground: foundCampground});
			}
		});
	
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, upload.single('image'), function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
	delete req.body.campground.rating;
	
	if(req.file === undefined){
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
			if(err){
				req.flash("error", err.message);
				res.redirect("back");
			} else {
				req.flash("success","Successfully Updated!");
				res.redirect("/campgrounds/" + campground._id);
			}
    	});
	} else {
		cloudinary.uploader.upload(req.file.path, function(result) {
			req.body.campground.image = result.secure_url;

			Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
				if(err){
					req.flash("error", err.message);
					res.redirect("back");
				} else {
					req.flash("success","Successfully Updated!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		});  
	}
		
    
  });
});

//DELETE ROUTES

router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            Comment.remove({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.remove({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});

// Campground Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}

module.exports = router;