const userService = require("../services/user.service");
const { STATUS_CODE } = require("../utils/constants");
const {errorResponseBody,successResponseBody} = require("../utils/responsebody");


const update = async (req,res) => {
    try {
        const response = await userService.updateUserRoleOrStatus(req.body,req.params.userId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully updated the user";
        return res.status(STATUS_CODE.OK).json(successResponseBody);
    } catch (error) {
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

module.exports = {
    update
}