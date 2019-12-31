const  express = require ("express");
const  app = express();
const  bodyParser  = require ("body-parser");
const  mongoose    = require("mongoose");
const  flash = require("connect-flash");
const  passport    = require("passport");
const  LocalStrategy    = require("passport-local");
const  methodOverride = require ("method-override");
const  Campground = require("./models/campground");
const  Comment = require ("./models/comment");
const  User     = require ("./models/user")
const  seedDB = require ("./seeds");


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//requiring routes
const commentRoutes = require ("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://Santo:<210418.xx>@spv-dcede.gcp.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    /* useUnifiedTopology: true */
}).then(() => {
    console.log("connect to DB!")

}).catch(err => {
    console.log("ERROR", err.message);
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());

//seed database
/* seedDB();  */

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "once again Rusty wins",
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});

