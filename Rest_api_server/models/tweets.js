const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tweet_schema = new Schema({
    text:{
        type: String,
        require: true,
        unique: true
    },
    is_english:{
        type:Boolean,
        require: true
    }
})

var tweets = mongoose.model('tweets', tweet_schema);
module.exports = tweets;