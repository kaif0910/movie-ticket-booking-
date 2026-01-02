const User = require("../models/user.model");

const createUser = async (data) => {
    try{
        const response = await User.create(data);
        return response ;
    } catch(error){
        console.log(error);
        if(error.name === "ValidationError"){
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            throw {err: err, code: 400};
        }
        throw error;
    }
}

const getUserByEmail = async (email) => {
    // SignIn logic to be implemented
    try {
        let user = await User.findOne({
            email: email});
        if(!user){
        throw {err: "User not found", code: 404};
            }
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

module.exports ={
    createUser,
    getUserByEmail
}