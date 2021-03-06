var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");
var router = express.Router();

router.get("/api/scrape", function(req, res) {


  request("https://www.nytimes.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    $("h2.story-heading a").each(function(i, element) {
      var result = {};
      result.link = $(this).attr("href");
      result.title = $(this).text();
      result.saved = false;
      result.summary = "todo";
      if (result.title && result.link) {
        db.Article
          .create(result)
          .then(function(dbArticle) {
          
          })
          .catch(function(err) {
            res.json(err);
          });
        }
    });
  });
  res.json("Scrape Complete");
});


router.get("/api/articles/:query", function(req, res) {
  console.log("router id ", req.params.query);
  console.log("router saved ", req.params.query);
  console.log(typeof(req.params.query));
  if ((req.params.query === "true") || (req.params.query === "false")) {
    db.Article
      .find( { "saved": req.params.query } )
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
    });

  } else {
    db.Article
      .findOne({ _id: req.params.query })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
    });
  }
});


router.put("/api/articles/:id/:saved", function(req, res) {
  db.Article
    .findOneAndUpdate({ _id: req.params.id }, { saved: req.params.saved })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
  });
});


router.post("/api/articles/:id", function(req, res) {
  db.Note
    .create(req.body) 
    .then(function(dbNote) {
      return db.Article
               .findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
  });
});

module.exports = router;