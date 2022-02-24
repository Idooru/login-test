const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
    const { email, password, nick } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            res.send("<h1>이미 존재하는 이메일입니다.</h1>");
        }
        const exNick = await User.findOne({ where: { nick } });
        if (exNick) {
            res.send("<h1>이미 존재하는 닉네임입니다.</h1>");
        }
        const hash = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hash,
            nick,
        });
    } catch (err) {
        next(err);
    }
});

router.post("/login", isNotLoggedIn, async (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
        if (authError) {
            return next(authError);
        }
        if (!user) {
            res.send(info);
        }
        return req.login(() => {
            console.log(`${user.nick}으로 로그인합니다.`);
            res.redirect("/");
        });
    });
});

router.get("/logout", isLoggedIn, (req, res, next) => {
    req.session.destroy();
    req.logOut();
    res.redirect("/");
});

module.exports = router;
