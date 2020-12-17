if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ExpressError = require("./utilities/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const MongoDBStore = require("connect-mongo")(session);

const secret = process.env.SECRET || "secretpasscode";
// Route Imports
const campgroundRoutes = require("./routes/campgrounds");
const userRoutes = require("./routes/user");
const reviewRoutes = require("./routes/reviews");

// Initiate express app
const app = express();

// Connect to Database with Mongoose
const PROD_dbUrl = process.env.DB_URL; // CloudDB for production
const DEV_dbUrl = "mongodb://localhost:27017/yelp-camp";
const dbUrl = PROD_dbUrl || DEV_dbUrl;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Not sure - verify that database is properly connected
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Set path to views directory and set up ejs parsing
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mongo Injection Protection
app.use(mongoSanitize());

// Security Measures
app.use(helmet({ contentSecurityPolicy: false }));

// Override method to allow data updating from form
app.use(methodOverride("_method"));

// Use ejsMate to parse ejs
app.engine("ejs", ejsMate);

// Static Assets
app.use(express.static(path.join(__dirname, "public")));

// Sessions
const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Session store error", e);
});

const sessionConfig = {
  store,
  secret,
  name: "morn",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // true to disable use from non-https
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user || null;
  next();
});

// Routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/fakeuser", async (req, res) => {
  const user = new User({
    username: "asanchez",
    email: "asanchez@protonmail.com",
  });
  const newUser = await User.register(user, "password");
  res.send(newUser);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found", 500));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serving on ${PORT}`);
});
