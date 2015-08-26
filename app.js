'use strict';
var express = require('express');
var logger = require('./logger.js');
var config = require('./config.js');

var app = express();

var twitterClient = require('./twitter.js');

var watson = require('./watson.js');

app.use(express.static(__dirname + '/dist'));

app.get('/personality_insights/:id', function(req, res) {
  twitterClient.getAllTweets(req.params.id, function(error, tweets) {
    if (error) {
      console.error('error:', error);
      return res.status(500).type('txt').end((error[0] || error).stack || (error[0] || error).message);
    }
    // concat all tweets to a single string
    var tweetText = tweets.map(function(tweet) {
      return tweet.content;
    }).join(' ');

    // then call PI on the concatenated tweets
    watson.getBig5PersonalityTraits(tweetText, function (err, big5) {
      if (err) {
        console.log('error:', err);
        res.status(500).send(err.message || err);
      }
      res.json(big5);
    });
  });
});

app.get('/news/:id', function(req, res) {
  watson.getNewsAbout(req.params.id, function(err, news) {
    if (!err) {
      console.log('error:', err);
      res.status(500).send(err.message || err);
    }
    res.json(news);
  });
});

app.listen(config.port);



