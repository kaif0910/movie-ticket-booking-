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
    userRole:{
        type: String,
        required : true,
        default: "CUSTOMER"
    },
    userStatus:{
        type: String,
        required : true,
        default: "APPROVED"
    },
},{timestamps:true});

const User = mongoose.model("User",userSchema);//creates a new model

module.exports = User;//returning the model