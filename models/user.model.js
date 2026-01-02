const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , "please fill a valid email address"],
        localStorage: true,
        Trim: true
    },
    password:{
        type: String,
        required : true,
        minLength: 6
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

userSchema.pre("save",async function(){
    //hash the password before saving to db
    console.log(this);
    const hash = await bcrypt.hash(this.password,10);
    console.log("hashed password",hash);
    this.password = hash;
    console.log("modified password",this.password);
})

const User = mongoose.model("User",userSchema);//creates a new model

module.exports = User;//returning the model