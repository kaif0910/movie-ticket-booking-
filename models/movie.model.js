const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    description :{
        type: String,
        required : true,
    },
    casts:{
        type:[String],
        required : true
    },
    trailerUrl:{
        type: String,
        required : true
    },
    language:{
        type:String,
        required : true,
        default: "English"
    },
    releaseDate:{
        type:String,
        required : true
    },
    releaseStatus:{
        type:String,
        required : true,
        default:"Released"
    },
},{timestamps:true});

const Movie = mongoose.model("Movie",movieSchema);//creates a new model

module.exports = Movie;//returning the model