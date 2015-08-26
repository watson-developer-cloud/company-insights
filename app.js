'use strict';
var express = require('express');
var watson = require('watson-developer-cloud');
var logger = require('./logger.js');
var config = require('./config.js');

var app = express();

var twitterClient = require('./twitter.js');

var personality_insights = watson.personality_insights(config.services.personality_insights);

app.use(express.static(__dirname + '/dist'));

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
    // personality insights with the concatenated text
    personality_insights.profile(
      {
        text: tweetText,
        language: 'en'
      },
      function (err, response) {
        if (!err) {
          res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
          res.end(JSON.stringify(big5(response), null, 2)); // todo: make this safe incase the format doesn't match expectations
        } else {
          console.log('error:', err);
          res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
          res.end(err.stack);
        }
      }
    );
  });
});

app.listen(8080);

var englishAndNoRetweet = function(tweet) {
  return tweet.lang === 'en' && !tweet.retweeted;
};

function toContentItem(tweet) {
  return {
    id: tweet.id_str,
    userid: tweet.user.id_str,
    sourceid: 'twitter',
    language: 'en',
    contenttype: 'text/plain',
    content: tweet.text.replace('[^(\\x20-\\x7F)]*',''),
    created: Date.parse(tweet.created_at)
  };
}

function getAllTweets(screen_name, callback, previousParams, current) {
  logger.info('getTweets for:', screen_name);

  var tweets = current || [],
    params = previousParams || {
        screen_name: screen_name,
        count: MAX_COUNT,
        exclude_replies: true,
        trim_user:true
      };

  var processTweets = function(error, _tweets) {
    // Check if _tweets its an error
    if (error)
      return callback(error);

    var items = _tweets
      .filter(englishAndNoRetweet)
      .map(toContentItem);

    tweets = tweets.concat(items);
    logger.info(screen_name,'_tweets.count:',tweets.length);
    if (_tweets.length > 1) {
      params.max_id = _tweets[_tweets.length-1].id - 1;
      getAllTweets(screen_name, callback, params, tweets);
    } else {
      // return tweets in order they were posted
      tweets.reverse();
      callback(null, tweets);
    }
  };

  twitterClient.get('statuses/user_timeline', params, processTweets);
}



/**
 * Return the Big 5 Traits normalized
 * @return Array      The 5 main traits
 */
var big5 = function(tree) {
  var profile = typeof (tree) === 'string' ? JSON.parse(tree) : tree;
  var _big5 = profile.tree.children[0].children[0].children;
  return _big5.map(function(trait) {
    return { name: trait.name, value: trait.percentage };
  });
};
