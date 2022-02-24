const express = require("express");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");

dotenv.config();
const app = express();
const { sequelize } = require("./models");
const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");

app.set("port", process.env.PORT);
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true,
});

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("SQL 연결 성공!");
    })
    .catch(console.error);

app.use((req, res, next) => {
    if (process.env.NODE_ENV || "development") {
        morgan("dev")(req, res, next);
    } else {
        morgan("combined")(req, res, next);
    }
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
    console.log("404 not found");
    res.sendStatus(404);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
});

app.listen(app.get("port"), () => {
    console.log(`server is running at http://localhost:${app.get("port")}`);
});
