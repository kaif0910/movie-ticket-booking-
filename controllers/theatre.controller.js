const theatreService = require("../services/theatre.service");
const {errorResponseBody, successResponseBody} =require("../utils/responsebody");

const createTheatre = async (req,res) => {
    try {
        let response = await theatreService.createTheatre(req.body);
        successResponseBody.data = response;
        successResponseBody.message = "successfully created the theatre";
        return res.status(201).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err;
        return res.status(500).json(errorResponseBody);
    }
}

module.exports = {
    createTheatre
}