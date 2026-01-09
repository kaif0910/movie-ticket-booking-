const paymentService = require("../services/payment.service");
const {STATUS} = require("../utils/constants");
const { successResponseBody,errorResponseBody } = require("../utils/responsebody");

const create = async (req,res) => {
    try {
        const response = await paymentService.createPayment(req.body);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully made the payment";
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
         if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

module.exports = {
    create
}