require('dotenv').config();
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
	flash 			= require("connect-flash"),
	seedDB			= require("./seeds");
	


var campgroundRoutes = require("./routes/campgrounds");
var commentsRoutes	 = require("./routes/comments");
var indexRoutes		 = require("./routes/index");
var usersRoutes		 = require("./routes/users");
var reviewRoutes     = require("./routes/reviews");
//mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
// chema setup: :27017
//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "SECRET",
	resave: false,
	saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async function(req, res, next){
	res.locals.currentUser = req.user;
	if(req.user) {
    try {
      let user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
      res.locals.notifications = user.notifications.reverse();
    } catch(err) {
      console.log(err.message);
    }
   }
	res.locals.error= req.flash("error");
	res.locals.success= req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);
app.use("/users", usersRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(3000, function(){
	console.log("CONECTED!!!");
});