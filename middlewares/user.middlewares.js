const {errorResponseBody} =require("../utils/responsebody");
 
const validateUpdateUserRequest = (req,res,next) => {
    if(!(req.body.userRole || req.body.userStatus)){
        errorResponseBody.err = "Malformed request, please send atleast one parameter out of user role and user request";
        return res.status(400).json(errorResponseBody);
    } 
    next();
}

module.exports = {
    validateUpdateUserRequest
}