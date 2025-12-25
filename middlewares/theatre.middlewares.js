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

module.exports ={
    validateCreateRequest
}