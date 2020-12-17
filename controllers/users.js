const User = require("../models/user");

module.exports.showRegistrationForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerNewUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", "Username or Password invalid");
    res.redirect("/register");
  }
};

module.exports.showLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", `Welcome Back, ${req.body.username}!`);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You have been logged out.");
  res.redirect("/campgrounds");
};
