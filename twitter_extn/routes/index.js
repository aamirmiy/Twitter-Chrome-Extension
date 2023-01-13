var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const tweet_schema = require('../models/tweets')
const sentiment_schema = require('../models/sentiment')
const contractions = require('@stdlib/nlp-expand-contractions');
const LanguageDetect = require('languagedetect');
const Sentiment = require('sentiment');

const lngDetector = new LanguageDetect();
const sentiment = new Sentiment();

router.use(bodyParser.json());

router.get('/', function(req, res, next) {
  res.render('index', { title: 'MOLA' });
});


function english_tweets(sentences) {
  const inputs = sentences

  const tweets = []

  for (let i = 0; i<inputs.length; i++)
  {
    const tweet = new tweet_schema

    tweet.text = inputs[i].text
    const ans = lngDetector.detect(contractions(inputs[i].text));
    console.log(ans);
    if(ans.length == 0){
      tweet.is_english='false'
    }
    else if(ans[0][0] == 'english' || ans[0][0] == 'pidgin'){
      tweet.is_english = 'true'
    }
    else{
      tweet.is_english ='false'
    }

    const result = {text: String, is_english: Boolean}
    result.text = tweet.text
    result.is_english = tweet.is_english

    tweets.push(result)  
  }

  return tweets
  
};


router.post('/api/language-detection', (req, res)=>{
  eng_twt = english_tweets(req.body)
  res.json(eng_twt)
});


router.post('/api/sentiment-score', (req,res)=>{

  eng_twt = english_tweets(req.body)
  const inputs=[]

  for(let j=0;j<eng_twt.length;j++)
  {
    if(eng_twt[j].is_english ==true){
       inputs.push(eng_twt[j])
    }
    else{
      continue
    }
  }
 
  const tweets = []
  for (let i = 0; i<inputs.length; i++)
  {
    const tweet = new sentiment_schema

    tweet.text = inputs[i].text
    const score = sentiment.analyze(inputs[i].text);
    tweet.sentiment_score = score.score
    if(score.score>0){
      tweet.detected_mood = 'positive'
    }
    else if(score.score<0){
      tweet.detected_mood = 'negative'
    }
    else {
      tweet.detected_mood = 'neutral'
    }
    
    const result = {text: String, sentiment_score: Number, detected_mood: String}
    result.text = tweet.text
    result.sentiment_score = tweet.sentiment_score
    result.detected_mood = tweet.detected_mood

    tweets.push(result)  
  }
res.json(tweets)
});

module.exports = router;
