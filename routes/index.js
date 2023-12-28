var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("./multer");
const fs = require("fs");
const path = require("path");

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
      const postImagePath = fs.existsSync(
        path.join(
          __dirname,
          "..",
          "public",
          "images",
          "uploads",
          post.postImage
        )
      )
        ? path.join("/images", "uploads", post.postImage)
        : "https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=740&t=st=1703734722~exp=1703735322~hmac=97826a87ee3185e434d65b9ac4886d6fba152d030f68445f270df65c2c554887";

      post.postImagePath = postImagePath;
    });

    const avatarPath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      "uploads",
      user.avatar
    );
    if (!fs.existsSync(avatarPath)) {
      user.avatar = "defaultAvatar.jpg";
      await user.save();
    }
    console.log(user.avatar);
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
      const postImagePath = fs.existsSync(
        path.join(
          __dirname,
          "..",
          "public",
          "images",
          "uploads",
          post.postImage
        )
      )
        ? path.join("/images", "uploads", post.postImage)
        : "https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=740&t=st=1703734722~exp=1703735322~hmac=97826a87ee3185e434d65b9ac4886d6fba152d030f68445f270df65c2c554887";

      post.postImagePath = postImagePath;
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
    await user.save();
    console.log(user.avatar);

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
