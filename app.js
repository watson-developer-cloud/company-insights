var Twitter = require('twitter');
var express = require('express');
var watson = require('watson-developer-cloud');

var config = require('./config.js');

var app = express()

var client = new Twitter(config.services.twitter);

var pi = watson.personality_insights(config.services.personality_insights);

app.get('/', function (req, res) {
  res.send('Hello World')
});
 
app.get('/tweets/:id', function(req, res) {
  var params = {screen_name: req.params.id};
  client.get('statuses/user_timeline', params, function(error, tweets, response){
    if (!error) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(JSON.stringify(tweets));
    } else {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end(error.stack);
    }
  });
});

app.get('/pi', function(req, res) {
  pi.profile(
    {
      text: 'We observe today not a victory of party but a celebration of freedom--symbolizing an end as well as a beginning--signifying renewal as well as change. For I have sworn before you and Almighty God the same solemn oath our forbears prescribed nearly a century and three-quarters ago. The world is very different now. For man holds in his mortal hands the power to abolish all forms of human poverty and all forms of human life. And yet the same revolutionary beliefs for which our forebears fought are still at issue around the globe--the belief that the rights of man come not from the generosity of the state but from the hand of God.',
      language: 'en'
    },
    function (err, response) {
      if (err) {
        console.log('error:', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(err.stack);
      } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify(response));
      }
    }
  );
});

app.listen(8080);

