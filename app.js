var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	Campground		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User	 		= require("./models/user"),
	mongoose 		= require ("mongoose"), 
	passport		= require("passport"),
	LocalStrategy 	= require ("passport-local"),
	methodOverride	= require("method-override"),
	seedDB			= require("./seeds");


var campgroundRoutes = require("./routes/campgrounds");
var commentsRoutes	 = require("./routes/comments");
var indexRoutes		 = require("./routes/index");
//mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB();
// chema setup: :27017

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "SECRET",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);
app.listen(3000, function(){
	console.log("CONECTED!!!");
});