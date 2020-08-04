const { consumerKey, consumerSecret } = require("./secrets.json");
const https = require("https");

/////////////// module for getting the token ////////////////////

module.exports.getToken = function (callback) {
    const creds = `${consumerKey}:${consumerSecret}`;
    const encodedCreds = Buffer.from(creds).toString("base64");

    const options = {
        host: "api.twitter.com",
        path: "/oauth2/token",
        method: "POST",
        headers: {
            Authorization: `Basic ${encodedCreds}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
    };

    function cbToken(response) {
        if (response.statusCode != 200) {
            callback(response.statusCode);
            return;
        }

        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        response.on("end", () => {
            const parsedBody = JSON.parse(body);
            callback(null, parsedBody.access_token);
        });
    }

    const req = https.request(options, cbToken);
    req.end("grant_type=client_credentials");
};

/////////////// module for getting the Tweets /////////////////

module.exports.getTweets = function (bearerToken, callback) {
    const options = {
        host: "api.twitter.com",
        path:
            "/1.1/statuses/user_timeline.json?screen_name=elonmusk&tweet_mode=extended",
        method: "GET",
        headers: {
            Authorization: "Bearer " + bearerToken,
        },
    };

    function cbTweets(response) {
        if (response.statusCode != 200) {
            callback(response.statusCode);
            return;
        }

        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        response.on("end", () => {
            const parsedBody = JSON.parse(body);
            callback(null, parsedBody);
        });
    }

    const req = https.request(options, cbTweets);
    req.end("grant_type=client_credentials");
};

/////////////// module for filtering the tweets ////////////////

module.exports.filterTweets = function (tweets) {
    const TweetsUrlOne = tweets.filter(function (tweets) {
        return tweets.entities.urls.length == 1;
    });

    const array = [];

    TweetsUrlOne.forEach(function (tweets) {
        const obj = {};

        const urlToRemove = tweets.entities.urls[0].url;
        const textWithoutUrl = tweets.full_text.replace(urlToRemove, "");

        obj.link = urlToRemove;
        obj.text = textWithoutUrl;

        array.push(obj);
    });

    return array;
};
