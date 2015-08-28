var Twitter = require('twitter');
var config = require('./config.js');
var twitterClient = new Twitter(config.services.twitter);

var MAX_COUNT = 200;
var minWordCount = 6000; // recommended minimum words for personality insights

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
    created: Date.parse(tweet.created_at),
    retweeted: tweet.retweeted
  };
}

function getName(screen_name, callback) {
  var params = {screen_name: screen_name};
  twitterClient.get('users/show', params, function(error, userInfo){
    if (error) {
      // twitter likes to send back an array of objects that aren't actually Error instances.. and there's usually just one object
      if (!Array.isArray(error)) {
        error = [error];
      }
      var messages = error.map(function(err){ return err.message }).join('\n');
      var e = new Error(messages);
      e.code = error[0].code;
      e.error = error;
      return callback(e)
    }
    callback(null, userInfo['name']);
  });
}

function getMentions(handle, callback) {
  params = {q: '@'+handle, count: 100};
  twitterClient.get('search/tweets', params, function(error, tweets){
    if (error) {
      // twitter likes to send back an array of objects that aren't actually Error instances.. and there's usually just one object
      if (!Array.isArray(error)) {
        error = [error];
      }
      var messages = error.map(function(err){ return err.message }).join('\n');
      var e = new Error(messages);
      e.code = error[0].code;
      e.error = error;
      return callback(e)
    }

    _tweets = tweets['statuses']
      .filter(englishAndNoRetweet)
      .map(toContentItem);

    if (_tweets.length == 0) {
      var e = new Error('No mentions found for @' + handle);
      e.error = 'content-is-empty';
      e.code = 400;
      return callback(e);
    }

    callback(null, toText(_tweets))
  });
}

function getTweets(params, callback) {
  if (typeof params == "string") {
    params = {screen_name: params};
  }
  console.time("getTweets");
  twitterClient.get('statuses/user_timeline', params, function(errors, tweets){
    console.timeEnd("getTweets");
    if (errors) {
      // twitter likes to send back an array of objects that aren't actually Error instances.. and there's usually just one object
      if (!Array.isArray(errors)) {
        errors = [errors];
      }
      var messages = errors.map(function(err){ return err.message }).join('\n');
      var e = new Error(messages);
      e.code = errors[0].code;
      e.errors = errors;
      return callback(e)
    }
    callback(null, tweets)
  });
}

function getAllTweets(screen_name, callback, previousParams, wordCount, current) {
  var tweets = current || [],
    params = previousParams || {
        screen_name: screen_name,
        count: MAX_COUNT,
        exclude_replies: true,
        trim_user:true
      };

  var wordCount = wordCount || 0;

  var processTweets = function(error, _tweets) {
    // Check if _tweets its an error
    if (error)
      return callback(error);

    var items = _tweets
      .filter(englishAndNoRetweet)
      .map(toContentItem);

    tweets = tweets.concat(items);
    if (_tweets.length >= 1) {
      var count = items.map(function(item) {
        return item.content.match(/\S+/g).length;
      }).reduce(function(a,b) {
          return a + b;
      })

      console.log('word count: ' + count);

      wordCount += count;

      console.log('total so far: ' + wordCount);

      if (wordCount >= minWordCount) {
        // return tweets in order they were posted
        tweets.reverse();
        return callback(null, toText(tweets));
      }

      params.max_id = _tweets[_tweets.length-1].id - 1;
      getAllTweets(screen_name, callback, params, wordCount, tweets);
    } else if (tweets.length >= 1) {
      // return tweets in order they were posted
      tweets.reverse();
      callback(null, toText(tweets));
    } else {
      // no tweets found
      var e = new Error('No tweets found for @' + screen_name);
      e.error = 'content-is-empty';
      e.code = 400;
      return callback(e);
    }
  };

  getTweets(params, processTweets);
}

// concat all tweets to a single string
function toText(tweets) {
  return tweets.map(function(tweet) {
    return tweet.content;
  }).join('\n');
}

module.exports.getName = getName;
module.exports.getMentions = getMentions;
module.exports.getTweets = getTweets;
module.exports.getAllTweets = getAllTweets;
