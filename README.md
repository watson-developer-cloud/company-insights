# Company Insights powered by IBM Watson

See the "personality" of your companies twitter feed and compare it to your competitors. 
Also see where you're mentioned in the news and what others are saying about you.

See it live at http://company-insights.mybluemix.net

## Deploying to Bluemix

Click the button below to fork into IBM DevOps Services and deploy your own copy of this application on Bluemix.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/watson-developer-cloud/company-insights)

Next set your [AlchemyAPI] and [Twitter] keys via either the [Bluemix] web interface or the [`cf` command line tool]:

```sh
cf set-env company-insights ALCHEMY_API_KEY <api_key>
cf set-env company-insights TWITTER_CONSUMER_KEY <consumer_key>
cf set-env company-insights TWITTER_CONSUMER_SECRET <consumer_secret>
cf set-env company-insights TWITTER_ACCESS_TOKEN_KEY <access_token_key>
cf set-env company-insights TWITTER_ACCESS_TOKEN_SECRET <access_token_secret>
cf restage company-insights
```

# Local Setup

Requires [Node.js]. Grab a copy of the code and install the dependencies. 
This also runs a one-time compile of the front-end assets.

```sh
npm install
```

Next create your API keys for [Twitter], [AlchemyAPI], and [Personality Insights].

For private projects, the simplest option is to put your API keys directly in `config.js`.
For public projects, either store them in environment variables, or alternatively, create a file named `.env` like so:

```
ALCHEMY_API_KEY=<api_key>

PERSONALITY_INSIGHTS_USERNAME=<username>
PERSONALITY_INSIGHTS_PASSWORD=<password>

TWITTER_CONSUMER_KEY=<consumer_key>
TWITTER_CONSUMER_SECRET=<consumer_secret>
TWITTER_ACCESS_TOKEN_KEY=<access_token_key>
TWITTER_ACCESS_TOKEN_SECRET=<access_token_secret>
```
  
Finally, run `npm start` to start app:

```sh
npm start
```

For development, use gulp and nodemon to automatically compile assets and restart your server when there are changes:

```sh
npm install -g gulp nodemon
```

And, then in seperate terminal windows, run
```sh
gulp watch
```

and

```sh
nodemon
```

[Node.js]: https://nodejs.org/
[Bower]: http://bower.io/
[Twitter]: https://apps.twitter.com/
[AlchemyAPI]: http://www.alchemyapi.com/api/register.html
[Personality Insights]: https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/gs-credentials.shtml
[Sign up for Bluemix]: https://apps.admin.ibmcloud.com/manage/trial/bluemix.html
[Bluemix]: https://console.ng.bluemix.net/
[Cloud Foundry]: https://www.cloudfoundry.org/
[`cf` command line tool]: https://github.com/cloudfoundry/cli/releases
[domain]: http://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#domain
[subdomain]: http://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html#host
