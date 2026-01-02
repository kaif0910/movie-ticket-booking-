const User = require("../models/user.model");
const userService = require("../services/auth.service");
const {successResponseBody, errorResponseBody } = require("../utils/responsebody");

const signup = async (req,res) => {
    try{
        let response = await userService.createUser(req.body);
        if(response.err){
            errorResponseBody.err = response.err;
            errorResponseBody.message = "validation error while creating user";
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "successfully registered the user";
        return res.status(201).json(successResponseBody);
    }catch(error){
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }    
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}

module.exports ={
    signup
}
