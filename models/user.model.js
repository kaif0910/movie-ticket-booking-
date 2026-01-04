const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { USER_ROLE, USER_STATUS } = require("../utils/constants");
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
        enum:{
            values: [USER_ROLE.customer,USER_ROLE.admin,USER_ROLE.client],
            message: "Invalid user role given"
        },
        default: USER_ROLE.customer
    },
    userStatus:{
        type: String,
        required : true,
        enum:{
            values: [USER_STATUS.approved,USER_STATUS.pending,USER_STATUS.rejected],
            message: "Invalid user status given"
        },
        default: USER_STATUS.approved
    },
},{timestamps:true});

userSchema.pre("save",async function(){
    //hash the password before saving to db
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
})

userSchema.methods.isValidPassword = async function(Password){
    const currentUser = this;
    const compare = await bcrypt.compare(Password,currentUser.password);
    return compare;
}
const User = mongoose.model("User",userSchema);//creates a new model

module.exports = User;//returning the model