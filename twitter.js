var Twitter = require('twitter');

var logger = require('./logger.js');
var config = require('./config.js');

var twitterClient = new Twitter(config.services.twitter);


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

function getTweets(params, callback) {
    if (typeof params == "string") {
        params = {screen_name: params};
    }
    twitterClient.get('statuses/user_timeline', params, function(errors, tweets){
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

    getTweets(params, processTweets);
}

module.exports.getTweets = getTweets;
module.exports.getAllTweets = getAllTweets;
