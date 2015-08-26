'use strict';
var express = require('express');
var packageJson = require('./package.json');
var config = require('./config.js');

var app = express();

var twitterClient = require('./twitter.js');

var watson = require('./watson.js');

app.use(express.static(__dirname + '/dist'));

app.get('/mentions/:id', function(req, res) {
  twitterClient.getTweets(req.params.id, function(error, tweets) {
    if (error) {
      console.error('error:', error);
      return res.status(500).end(error.message || error);
    }
    res.send(tweets);
  });
});

app.get('/personality_insights/:id', function(req, res) {
  twitterClient.getAllTweets(req.params.id, function(error, tweets) {
    if (error) {
      console.error('error:', error);
      return res.status(500).end(error.message || error);
    }
    // concat all tweets to a single string
    var tweetText = tweets.map(function(tweet) {
      return tweet.content;
    }).join('\n');

    // then call PI on the concatenated tweets
    watson.getBig5PersonalityTraits(tweetText, function (err, big5) {
      if (err) {
        console.log('error:', err);
        return res.status(500).send(err.message || err);
      }
      res.json(big5);
    });
  });
});

app.get('/news/:id', function(req, res) {
  watson.getNewsAbout(req.params.id, function(err, news) {
    if (err) {
      console.log('error:', err);
      return res.status(500).send(err.message || err);
    }
    res.send(news);
  });
});

var server = app.listen(config.port, function() {
  console.log("%s v%s listening on port %s", packageJson.name, packageJson.version, server.address().port);
});
