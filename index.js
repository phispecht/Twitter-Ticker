const express = require("express");
const app = express();

const { getToken, getTweets, filterTweets } = require("./twitter");

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.static("ticker"));

app.get("/data.json", (req, res) => {
    console.log("i need to build up some JSON and send it back....");

    getToken(function (err, bearerToken) {
        if (err) {
            console.log("error in getToken: ", err);
            return;
        }
        console.log("in index.js the token!!!", bearerToken);

        getTweets(bearerToken, function (err, tweets) {
            if (err) {
                console.log("error in getTweets, ", err);
                return;
            }

            // 3. We want to clean up (filter) the tweets.
            const filteredTweets = filterTweets(tweets);
            // 4. we want to send back a response. res.json(filteredTweets)
            res.json(filteredTweets);
        });
    });
});

app.listen(8080, () => console.log("twitter ticker up and running"));
