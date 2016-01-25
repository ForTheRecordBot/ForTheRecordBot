// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit({
  consumer_key:         (process.env.consumer_key || require('./config.js').consumer_key),
  consumer_secret:      (process.env.consumer_secret || require('./config.js').consumer_secret),
  access_token:          (process.env.access_token || require('./config.js').access_token),
  access_token_secret:   (process.env.access_token_secret || require('./config.js').access_token_secret)
});
// This is the URL of a search for the latest tweets that include the phrase "for the record".
var recordSearch = {q: '"for the record"', count: 10, result_type: "recent"}; 

// This function finds the latest tweet with the text 'for the record', and retweets it.
function retweetLatest() {
	T.get('search/tweets', recordSearch, function (error, data) {
	  // log out any errors and responses
	  // console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
	  	var tweet = data.statuses[0];
	  	console.log(tweet.text);
		// var retweetBody = 'It\'s been noted for the record #fortherecord RT @' + tweet.user.screen_name + ' ' + tweet.text;
		var retweetId = data.statuses[0].id_str;
		var tweeter = data.statuses[0].user.screen_name
		var tweetURL = "https://twitter.com/"+ tweeter+ "/status/" + retweetId;
		var myTweet = "It's been noted #fortherecord " + tweetURL;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/update', { status: myTweet }, function (err, reply) {
			if (err) {
         		console.log('error:', err);
      		}
        	else {
          		console.log('tweet:', reply);
       		}
		})
		console.log(myTweet);
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 10 * 10);
