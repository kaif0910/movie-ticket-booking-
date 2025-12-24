const User = require("../models/user.model");

const createUser = async (data) => {
    try{
        const newUser =await User.create(data);
        return newUser;
    } catch(err){
        console.log(err);
        return err;
    }
}

module.exports ={
    createUser
}