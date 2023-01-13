const mongoose = require('mongoose')
const Schema = mongoose.Schema


const sentiment_schema = new Schema({
    text:{
        type: String,
        require: true,
    },
    sentiment_score:{
        type:Number,
        require:true
    },
    detected_mood:{
        type:String,
        require:true
    }
})

var sentiment = mongoose.model('sentiments', sentiment_schema);
module.exports = sentiment;