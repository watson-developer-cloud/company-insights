'use strict';
var express = require('express');
var packageJson = require('../../package.json');
var config = require('./config.js');
var twitter = require('./twitter.js');
var watson = require('./watson.js');

var app = express();

app.use(express.static(__dirname + '/../../dist'));

if (config.services.redis) {
  var TTL = 60 * 60 * 24;
  var cache = require('express-redis-cache')({
    client: require('redis-url').connect(config.services.redis),
    expires: TTL
  });
  app.use('/api', cache.route());
  console.log('Caching responses for %s seconds', TTL)
} else {
  console.log('api caching disabled, set REDIS_URL or config.services.redis to enable');
}

app.get('/api/mentions_sentiment/:id', function(req, res) {
  console.time("mentions");
  twitter.getMentions(req.params.id, function(error, tweetText) {
    console.timeEnd("mentions");

    if (error) {
      console.error('error:', error);
      return res.status(500).end(error.message || error.error || error);
    }

    console.time("sentiment");
    watson.getSentiment(tweetText, function(err, sentiment) {
      console.timeEnd("sentiment");
      if (err) {
        console.error('error:', err);
        return res.status(500).end(err.message || err.error || err);
      }
      res.json(sentiment);
    });
  });
});

app.get('/api/personality_insights/:id', function(req, res) {
  console.time("alltweets");
  twitter.getAllTweets(req.params.id, function(error, tweetText) {
    console.timeEnd("alltweets");

    if (error) {
      console.error('error:', error);
      return res.status(500).end(error.message || error.error || error);
    }

    // then call PI on the concatenated tweets
    console.time("personality");
    watson.getBig5PersonalityTraits(tweetText, function (err, big5) {
      console.timeEnd("personality");
      if (err) {
        console.error('error:', err);
        return res.status(500).end(err.message || err.error || err);
      }
      res.json(big5);
    });
  });
});

app.get('/api/news/:id', function(req, res) {
  console.time("twitterName");
  twitter.getName(req.params.id, function(error, name) {
    console.timeEnd("twitterName");

    if (error) {
      console.error('error:', error);
      return res.status(500).end(error.message || error.error || error);
    }

    console.time("getnews");
    watson.getNewsAbout(name, function(err, news) {
      console.timeEnd("getnews");
      if (err) {
        console.error('error:', err);
        return res.status(500).end(err.message || err.error || err);
      }
      res.json(news);
    });
  });
});

var server = app.listen(config.port, function() {
  console.log("%s v%s listening on port %s", packageJson.name, packageJson.version, server.address().port);
});
