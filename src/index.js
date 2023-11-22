require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const env = require("./configs/env");
const Auth = require("./libs/Auth/Auth.route");
const Mobile = require("./libs/Mobile/Mobile.route");
const Valuation = require("./libs/Valuation/Valuation.route");
const Powerbase = require("./libs/Powerbase/Powerbase.route");

const NodeCache = require("node-cache");
const myCache = new NodeCache();
const request = require("request");
const path = require("path");
const app = express();
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.send(200);
  } else {
    return next();
  }
});

// Dev Mode
app.use(function (req, res, next) {
  if (req.url.includes("/api")) {
    req.url = req.url.toString().replace("/api", "");
  }
  if (req.method === "POST" || req.method === "PUT") {
    myCache.flushAll();
  }
  next();
});

//geoserver
app.use(function (req, res, next) {
  if (req.url.split("/")[1] === "geoserver") {
    try {
      req.pipe(request(`http://demo.osl.co.ke:442${req.url}`)).pipe(res);
    } catch (error) {}
  } else {
    next();
  }
});

app.get("/uploads/:fileName", function (req, res) {
  const filePath = path.join(__dirname, "../uploads/", req.params.fileName);
  res.sendFile(filePath);
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/ol", express.static(path.join(__dirname, "public/ol")));
app.use("/uploads", express.static("uploads"));
app.use(
  express.json({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);

app.get("/map", (req, res) => {
  res.render("map");
});

Auth.AuthRoutes(app);
Mobile.MobileRoutes(app);
Valuation.ValuationRoutes(app);
Powerbase.PowerbaseRoutes(app);

app.listen(env.port, function () {
  console.log("app listening at port %s", env.port);
});
