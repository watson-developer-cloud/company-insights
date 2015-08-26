'use strict';
var express = require('express');
var logger = require('./logger.js');
var config = require('./config.js');

var app = express();

var twitterClient = require('./twitter.js');

var watson = require('./watson.js');

app.get('/', function (req, res) {
  res.send('Hello World')
});
 
app.get('/tweets/:id', function(req, res) {
  twitterClient.getTweets(req.params.id, function(error, tweets){
    if (!error) {
      res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end(JSON.stringify(tweets));
    } else {
      console.error(error);
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end(error.stack || error.message);
    }
  });
});

app.get('/getalltweets/:id', function(req, res) {
  twitterClient.getAllTweets(req.params.id, function(error, tweets) {
    if (!error) {
      res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});

      // concat all tweets to a single string
      var tweetText = tweets.map(function(tweet) {
        return tweet.content;
      }).join(' ');
      res.end(tweetText);
    } else {
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end(error.stack);
    }
  });
});

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
  watson.getNewsAbout(id, function(err, news) {
    if (!err) {
      console.log('error:', err);
      res.status(500).send(err.message || err);
    }
    res.json(news);
  });
});

app.listen(config.port);



