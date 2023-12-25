var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("./multer");
const fs = require("fs");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

router.get("/", (req, res) => {
  res.render("index", { nav: false, error: req.flash("error") });
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const user = await userModel
      .findOne({
        username: req.session.passport.user,
      })
      .populate("posts");

    user.posts.forEach((post) => {
      const imagePath = fs.existsSync(`images/uploads/${post.postImage}`)
        ? `/images/uploads/${post.postImage}`
        : "https://i.pinimg.com/564x/35/6e/40/356e403878f3694ab491b406e49bdfd7.jpg";
      post.imagePath = imagePath;
    });

    res.render("profile", { user, nav: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching posts");
  }
});

router.get("/create", isLoggedIn, async (req, res, next) => {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  res.render("create", { user, nav: true });
});

router.get("/feed", isLoggedIn, async (req, res, next) => {
  try {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const posts = await postModel.find();

    posts.forEach((post) => {
      const imagePath = fs.existsSync(`images/uploads/${post.postImage}`)
        ? `/images/uploads/${post.postImage}`
        : "https://i.pinimg.com/564x/35/6e/40/356e403878f3694ab491b406e49bdfd7.jpg";
      post.imagePath = imagePath;
    });
    res.render("feed", { posts, user, nav: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching posts");
  }
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
    failureFlash: true,
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
