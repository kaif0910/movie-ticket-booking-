const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");
const { errorResponseBody } = require("../utils/responsebody");
const {USER_ROLE} = require("../utils/constants")

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

    next();//request is valid so we are calling the next function in the middleware chain
}

const isAuthenticated = async (req,res,next) =>{
    // Authentication logic
    try {
        const token = req.headers['x-access-token'];//getting token from headers
        if(!token){
            errorResponseBody.err = "No token provided";
            return res.status(403).json(errorResponseBody);
        }
        const response = jwt.verify(token, process.env.AUTH_KEY);
        if(!response){
            errorResponseBody.err = "Failed to authenticate token";
            return res.status(401).json(errorResponseBody);
        }
        const user = await userService.userById(response.userId);//jwt token se userId aur email fetch karega jo token se aaega
        req.userId = user._id; //naya req object hoga jo response ban jaega  
        next();//next middleware call after successfull authentication
    } catch (error) {
        if(error.code == 404){
            errorResponseBody.err ="user doesn't exist";
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}

const validateResetPassword = (req,res,next) => {
    if(!req.body.oldPassword){
        errorResponseBody.err = "please provide the old password";
        return res.status(400).json(errorResponseBody);
    };

    if(!req.body.newPassword){
        errorResponseBody.err = "please provide the new password";
        return res.status(400).json(errorResponseBody);
    }

    next();
}

const isAdmin = async (req,res,next) => {
    const user = await userService.userById(req.userId);
    if(user.userRole !== USER_ROLE.admin){
        errorResponseBody.err = "User is not an admin, cannot proceed with the request";
        return res.status(401).json(errorResponseBody);
    }
    next();
}

const isClient = async (req,res,next) => {
    const user = await userService.userById(req.userId);
    if(user.userRole !== USER_ROLE.client){
        errorResponseBody.err = "User is not a client, cannot proceed with the request";
        return res.status(401).json(errorResponseBody);
    }
    next();
}

const isAdminOrClient = async (req,res,next) => {
    const user = await userService.userById(req.userId);
    if(user.userRole !== USER_ROLE.admin && user.userRole !== USER_ROLE.client){
        errorResponseBody.err ="User is neither a client nor an admin, cannot proceed with the request";
        return res.status(401).json(errorResponseBody);
    }
    next();
}


module.exports = {
    validateSignUpRequest,
    validateSignInRequest,
    isAuthenticated,
    validateResetPassword,
    isAdmin,
    isClient,
    isAdminOrClient
}