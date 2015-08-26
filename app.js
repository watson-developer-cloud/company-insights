var Twitter = require('twitter');
var express = require('express');
var watson = require('watson-developer-cloud');
var logger = require('./logger.js');
var config = require('./config.js');

var app = express()

var twitterClient = new Twitter(config.services.twitter);

var personality_insights = watson.personality_insights(config.services.personality_insights);

var MAX_COUNT = 200;

app.get('/', function (req, res) {
  res.send('Hello World')
});
 
app.get('/tweets/:id', function(req, res) {
  var params = {screen_name: req.params.id};
  twitterClient.get('statuses/user_timeline', params, function(error, tweets, response){
    if (!error) {
      res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end(JSON.stringify(tweets));
    } else {
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end(error.stack);
    }
  });
});

app.get('/getalltweets/:id', function(req, res) {
  getAllTweets(req.params.id, function(error, tweets) {
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
  getAllTweets(req.params.id, function(error, tweets) {
    if (!error) {
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
            res.end(JSON.stringify(response));
          } else {
            console.log('error:', err);
            res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end(err.stack);
          }
        }
      );
    } else {
      console.log('error:', err);
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end(err.stack);
    }
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

