const { errorResponseBody } = require("../utils/responsebody");

const validateSignUpRequest = async (req,res,next) =>{
    if(!req.body.name){
        errorResponseBody.err ="The name is not present in the request";
        return res.status(400).json(errorResponseBody);
    }
    if(!req.body.password){
        errorResponseBody.err = "The password is not present in the request";
        return res.status(400).json(errorResponseBody);
    }
    if(!req.body.email){
        errorResponseBody.err = "The email is not present in the request";
        return res.status(400).json(errorResponseBody);
    }
    next();

}   

const validateSignInRequest = async (req,res,next) =>{
    if(!req.body.password){
        errorResponseBody.err = "Please Enter your password";
        return res.status(400).json(errorResponseBody);
    }
    if(!req.body.email){
        errorResponseBody.err = "Please Enter your email";
        return res.status(400).json(errorResponseBody);
    }

    next();
}

module.exports = {
    validateSignUpRequest,
    validateSignInRequest
}