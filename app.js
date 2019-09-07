var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
		{name : "place 1", image:"https://images.app.goo.gl/kAFHjvpdZAk8Hejr9" },
		{name : "place 2", image:"https://images.app.goo.gl/kAFHjvpdZAk8Hejr9" },
		{name : "place 3", image:"https://images.app.goo.gl/kAFHjvpdZAk8Hejr9" }
		
	]
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.get("/", function(req,res){
	res.render("home");
});

app.get("/campgrounds", function(req,res){
	res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image}
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
	
});

app.get("/campgrounds/new", function(req,res){
	res.render("new.ejs");
})
app.listen(3000, function(){
	console.log("CONECTED!!!");
});