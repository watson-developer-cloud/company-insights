'use strict';

var watson = require('watson-developer-cloud');
var config = require('./config.js');
var personality_insights = watson.personality_insights(config.services.personality_insights);


// https://access.alchemyapi.com/


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


function getNewsAbout(id, callback) {
    callback(new Error('not implemented'));
}


module.exports.getBig5PersonalityTraits = getBig5PersonalityTraits;
module.exports.getNewsAbout = getNewsAbout;
