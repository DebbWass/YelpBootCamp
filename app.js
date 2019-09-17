var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require ("mongoose"); 
//mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// chema setup: :27017
var campgroundSchema = new mongoose.Schema({
 	name: String,
	image: String,
	description: String
 });

 var Campground = mongoose.model("Campground",campgroundSchema);

Campground.create(
 {
 	name : "place 1", 
 	image:"https://farm9.staticflickr.com/8605/16573646931_22fc928bf9_o.jpg",
		description : "dfdsfdsf"
 }, function(err, campground){
 	if (err){
 		console.log(err)
 	} else {
 		console.log(campground);
 	}
 });
app.get("/", function(req,res){
	res.render("home");
});

app.get("/campgrounds", function(req,res){
	//get camps from db:
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log (err);
		}else{
			res.render("campgrounds",{campgrounds:allCampgrounds});
		}
	});
	
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image}
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
	res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res){
	res.send("Show page");
});
app.listen(3000, function(){
	console.log("CONECTED!!!");
});