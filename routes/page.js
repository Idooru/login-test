const express = require("express");
const { isLoggedIn } = require("./middlewares");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("main", { title: "main" });
});

router.get("/afterLogin", isLoggedIn, (req, res, next) => {
    res.render("afterLogin", { title: "afterLogin" });
});

module.exports = router;
