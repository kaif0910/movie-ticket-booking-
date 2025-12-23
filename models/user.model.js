const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true     
    },
    password:{
        type: String,
        required : true
    },
    age:{
        type: Number,
        required : true     
    }

},{timestamps:true});

const User = mongoose.model("User",user Schema);//creates a new model

module.exports = User;//returning the model