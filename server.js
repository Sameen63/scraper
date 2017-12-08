var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var apiRoutes = require("./routes/apiRoutes");
var htmlRoutes = require("./routes/htmlRoutes");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/", apiRoutes);
app.use("/", htmlRoutes);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var collections = ["articles"];

mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});


app.listen(process.env.PORT || 8080, function() {
  console.log("App running on port 8080!");
});