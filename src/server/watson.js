'use strict';

var watson = require('watson-developer-cloud');
var config = require('./config.js');
var personality_insights = watson.personality_insights(config.services.personality_insights);
var alchemy_language = watson.alchemy_language({api_key: config.services.alchemy_api_key});
var request = require('request');



function getBig5PersonalityTraits(text, callback) {
    personality_insights.profile({text: text, language: 'en'}, function (err, response) {
        if (err) {
            return callback(err);
        }
        callback(null, extractBig5(response));
    });
}


/**
 * Return the Big 5 Traits normalized
 * @return Array      The 5 main traits
 */
var extractBig5 = function(tree) {
    var profile = typeof (tree) === 'string' ? JSON.parse(tree) : tree;
    var _big5 = profile.tree.children[0].children[0].children;
    return _big5.map(function(trait) {
        return { name: trait.name, value: trait.percentage };
    });
};


// base url: https://access.alchemyapi.com/
// docs: http://docs.alchemyapi.com/

function getNewsAbout(name, callback) {
    var url = config.services.alchemy_news_url;
    var params = {
        'apikey': config.services.alchemy_api_key,
        'outputMode': 'json',
        'start': 'now-14d',
        'end': 'now',
        'count': '5',
        'q.enriched.url.enrichedTitle.entities.entity': '|text=' + name + ',type=company|',
        'return': 'enriched.url.url,enriched.url.title,enriched.url.image'
    };
    request({url: url, qs: params}, function(error, response, body) {
        if (error) {
            return callback(error);
        }
        var news = JSON.parse(body);
        if (news.status == 'ERROR') {
            var newsError = {
                error: news.statusInfo
            };
            console.error('error:', newsError);
            return callback(newsError);
        }
        // No news found
        if (!news.result.docs) {
            var emptyError = new Error("No news found for " + name);
            emptyError.error = 'content-is-empty';
            emptyError.code = 400;
            return callback(emptyError);
        }
        var _news = news.result.docs.map(function(doc){
            var entry = doc.source.enriched.url;
            return {
                image: entry.image,
                url: entry.url,
                title: entry.title
            };
        });
        callback(null, _news);
    });
}

function getSentiment(text, callback) {
  var params = {text: text}
  alchemy_language.sentiment(params, function(err, response) {
    if (err) {
      return callback(err);
    }
    callback(null, response.docSentiment);
  });
}

module.exports.getSentiment = getSentiment;


module.exports.getBig5PersonalityTraits = getBig5PersonalityTraits;
module.exports.getNewsAbout = getNewsAbout;
