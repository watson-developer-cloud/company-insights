'use strict';
var express = require('express');
var packageJson = require('./package.json');
var config = require('./config.js');
var twitterClient = require('./twitter.js');
var watson = require('./watson.js');
var wdc = require('watson-developer-cloud');
var alchemy_language = wdc.alchemy_language({api_key: config.services.alchemy_api_key});

var app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/mentions_sentiment/:id', function(req, res) {
  twitterClient.getMentions(req.params.id, function(error, tweets) {
    if (error) {
      console.error('error:', error);
      return res.status(500).end(error.message || error.error || error);
    }
    var tweetText = tweets.map(function(tweet) {
      return tweet.content;
    }).join('\n');

    var params = {text: tweetText};

    alchemy_language.sentiment(params, function(err, response) {
      if (err) {
        console.error('error:', err);
        return res.status(500).end(err.message || err.error || err);
      }
      res.end(JSON.stringify(response.docSentiment, null, 2));
    });
  });
});

app.get('/personality_insights/:id', function(req, res) {
  twitterClient.getAllTweets(req.params.id, function(error, tweets) {
    if (error) {
      console.error('error:', error);
      return res.status(500).end(error.message || error.error || error);
    }
    // concat all tweets to a single string
    var tweetText = tweets.map(function(tweet) {
      return tweet.content;
    }).join('\n');

    // then call PI on the concatenated tweets
    watson.getBig5PersonalityTraits(tweetText, function (err, big5) {
      if (err) {
        console.log('error:', err);
        return res.status(500).send(err.message || err.error || err);
      }
      res.json(big5);
    });
  });
});

app.get('/news/:id', function(req, res) {
  twitterClient.getName(req.params.id, function(error, name) {
    watson.getNewsAbout(name, function(err, news) {
      if (err) {
        console.log('error:', err);
        return res.status(500).send(err.message || err.error || err);
      }
      res.end(JSON.stringify(news, null, 2));
    });
  });
});

var server = app.listen(config.port, function() {
  console.log("%s v%s listening on port %s", packageJson.name, packageJson.version, server.address().port);
});

