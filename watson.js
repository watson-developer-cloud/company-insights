'use strict';

var watson = require('watson-developer-cloud');
var config = require('./config.js');
var personality_insights = watson.personality_insights(config.services.personality_insights);
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

function getNewsAbout(id, callback) {
    var url = config.services.alchemy_news_url;
    var params = {
        'apikey': config.services.alchemy_api_key,
        'outputMode': 'json',
        'start': 'now-14d',
        'end': 'now',
        'count': '5',
        'q.enriched.url.enrichedTitle.entities.entity': '|text=' + id + ',type=company|',
        'return': 'enriched.url.url,enriched.url.title,enriched.url.image,enriched.url.language,enriched.url.publicationDate'
    };
    request({url: url, qs: params}, function(error, response, body) {
        if (error) {
            return callback(error);
        }
        console.log(body);
        callback(null, JSON.parse(body));
    });
}


module.exports.getBig5PersonalityTraits = getBig5PersonalityTraits;
module.exports.getNewsAbout = getNewsAbout;
