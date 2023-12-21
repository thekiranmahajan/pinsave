var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./create");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("./multer");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

router.get("/", (req, res) => {
  res.render("index", { nav: false });
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  res.render("profile", { user, nav: true });
});
router.get("/create", isLoggedIn, async (req, res, next) => {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  res.render("create", { user, nav: true });
});

router.post(
  "/create",
  isLoggedIn,
  upload.single("createPost"),
  async (req, res, next) => {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      user: user._id,
      postImage: req.file.filename,
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("profile");
  }
);

router.post(
  "/file-upload",
  isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No files were uploaded");
    }
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    user.avatar = req.file.filename;
    user.save();
    res.redirect("/profile");
  }
);

router.get("/register", (req, res) => {
  res.render("register", { nav: false });
});

router.post("/register", (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password).then(() => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
