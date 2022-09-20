const router = require("express").Router();
let Twitter = require("twitter");

let twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
let twitterStream;
const stream = (sk) => {
  twitter.stream("statuses/filter", { track: "trump" }, (stream) => {
    stream.on("data", (tweet) => {
      sendMessage(tweet.text);
      console.log(tweet.text);
    });
    stream.on("error", (error) => {
      console.log(error);
    });
  });
  twitterStream = stream;
};

router.post("/searchKey", async (req, res, next) => {
  let term = req.body.term;
  app.locals.searchTerm = term;
  twitterStream.destroy();
  stream(req.body.term);
  const sendMessage = (msg) => {
    if (msg.text.includes("RT")) {
      return;
    }
    socketConnection.emit("tweets", msg);
  };
});

module.exports = router;
