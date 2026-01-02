const badRequestResponse = {
    success: false,
    err: "",
    data: {},
    message: "Malformed Request | Bad Request"
};
const validateSignUpRequest = async (req,res,next) =>{
    if(!req.body.username){
        badRequestResponse.err ="The username is not present in the request";
        return res.status(400).json(badRequestResponse);
    }
    if(!req.body.password){
        badRequestResponse.err = "The password is not present in the request";
        return res.status(400).json(badRequestResponse);
    }
    if(!req.body.email){
        badRequestResponse.err = "The email is not present in the request";
        return res.status(400).json(badRequestResponse);
    }
    next();

}   

module.exports = {
    validateSignUpRequest
}