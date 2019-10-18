var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	Campground	= require("./models/campground"),
	Comment 	= require("./models/comment"),
	//User	 	= require("/models/user"),
	mongoose 	= require ("mongoose"), 
	seedDB		= require("./seeds");

seedDB();
//mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// chema setup: :27017

app.get("/", function(res,res){
	res.render("landing");
});


app.get("/campgrounds", function(req,res){
	//get camps from db:
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log (err);
		}else{
			res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds});
		}
	});
	
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name: name, image: image, description: description}
	//create ne camp
	Campground.create(newCampground, function(err, newlyCreated){
		if (err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
	
	
});

app.get("/campgrounds/new", function(req,res){
	res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
	}
	});
	
});
//======================================
//COMMENTS ROUTES
//======================================

app.get("/campgrounds/:id/comments/new", function(req,res){
	Campground.findById(req.params.id,function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground: campground});
		}
	});
	
});

app.post("/campgrounds/:id/comments", function(req,res){
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
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+ campground._id);
				}
			});
			
		}
	});
});

app.listen(3000, function(){
	console.log("CONECTED!!!");
});