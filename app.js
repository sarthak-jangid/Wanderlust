const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const PORT = 8080;
const ExpressError = require("./utils/ExpressError");
const listingRoute = require("./routes/listing");
const reviewRoute = require("./routes/review");
const userRoute = require("./routes/user");

// reuire passport and passport-local library for authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");

// require User model
const User = require("./models/userSchema");

const session = require("express-session");
const flash = require("connect-flash");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

main()
  .then((res) => console.log("connection successful ..."))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send("working ...");
});

// express-session .......

const sessionOptions = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, // expire in 7 days
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
// connect-flash ........
app.use(flash());

// configure passport ......
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport-Local Strategy
passport.use(new LocalStrategy(User.authenticate()));

// Required for storing user data in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes .....
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//register a user using User.register in the passport.local.mongoose .....

// app.get("/demouser", async (req,res)=>{
//   const fakeuser = new User({
//     email : "xyx@gamil.com",
//     username : "sarthak"
//   });
//   let registerdUser = await User.register(fakeuser, "password")
//   res.send(registerdUser)
// })

// Routes  .........................
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.use((req, res, next) => {
  next(new ExpressError(404, "page not found !"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "SOMETHING WENT WRONG!" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});

app.listen(PORT, () => {
  console.log(`server running at PORT ${PORT}`);
});
