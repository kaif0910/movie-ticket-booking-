const { errorResponseBody } = require("../utils/responsebody");

const badRequestResponse = {
    success: false,
    err: "",
    data: {},
    message: "Malformed Request | Bad Request"
};

const validateCreateRequest = async (req,res,next) => {
    if(!req.body.name){
        badRequestResponse.err = "The name of the theatre is not present in the request";
        return res.status(400).json(badRequestResponse);
    };

    if(!req.body.description){
        badRequestResponse.err = "The description of the theatre is not present in the request";
        return res.status(400).json(badRequestResponse);
    };

    if(!req.body.city){
        badRequestResponse.err = "The city of the theatre is not present in the request";
        return res.status(400).json(badRequestResponse);
    };

    if(!req.body.pincode){
        badRequestResponse.err = "The pincode of the theatre is not present in the request";
        return res.status(400).json(badRequestResponse);
    };

    if(!req.body.address){
        badRequestResponse.err = "The address of the theatre is not present in the request";
        return res.status(400).json(badRequestResponse);
    }

    next();
}

const validateUpdateMovies = async (req,res,next) => {
    //validation of insert paramerer
    if(!req.body.insert){
        errorResponseBody.message = "the insert parameter is missing in the request";
        return res.status(400).json(errorResponseBody);
    }
    if(!req.body.movieIds){
        errorResponseBody.message ="no movies present in the request to be updated in the theatre";
        return res.status(400).json(errorResponseBody);
    }
    if(!(req.body.movieIds instanceof Array)){
        errorResponseBody.message = "Expected array of movies but found something else";
        return res.status(400).json(errorResponseBody);
    }
    if(req.body.movieIds.length <= 0){
            errorResponseBody.message = "No movies present in the array provided";
            return res.status(400).json(errorResponseBody);
    }
    next();
}

module.exports ={
    validateCreateRequest,
    validateUpdateMovies
}