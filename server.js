// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "news";
var collections = ["recentnews"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

app.get("/all", function(req, res) {
  db.recentnews.find({}, function(error, found) {
    if (error) {
      console.log(error);
    } else {
      res.json(found);
    }
  });
});

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

app.get("/news", function(req, res) {

axios.get("https://www.pcgamer.com/news/").then(function(response) {

  var $ = cheerio.load(response.data);

  $(".listingResults").each(function(i, element) {

    var headline = $(element).find(".content").find(".article-name").text();
    var synopsis = $(element).find(".byline").find(".by-author").text().trim();

    db.recentnews.insert({
      headline: headline,
      synopsis:synopsis
    },
    function(err, inserted) {
      if (err) {
        console.log(err);
      } else {
        console.log(inserted);
      }
    })
    
    
  });
  
});

res.send("Complete");

});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
