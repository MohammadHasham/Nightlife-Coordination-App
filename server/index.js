const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./models/Places");

require("./passport/passport");

mongoose.connect("mongodb://admin:admin@ds239988.mlab.com:39988/reallife-cordination");
const app = express();
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ["key"]
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/basicRoutes")(app);



app.listen(process.env.PORT || 5000,()=>{
  console.log("Server listening on 5000");
});
