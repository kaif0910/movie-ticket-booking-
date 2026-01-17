const showService = require("../services/show.service");
const { STATUS } = require("../utils/constants");
const { errorResponseBody, successResponseBody } = require("../utils/responsebody");


const create = async (req,res) => {
    try {
        const response = await showService.createShow(req.body);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the show";
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

const getShows =async (req,res) => {
    try {
        const response = await showService.getShows(req.query);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched all the shows of the movie";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}


const deleteShow = async (req,res) => {
    try {
        const response = await showService.deleteShow(req.params.showId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully deleted  the show of the movie";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const updateShow =async (req,res) => {
    try {
        const response = await showService.updateShow(req.params.showId,req.body);
        successResponseBody.data = response;
        successResponseBody.message = "successfully updated the show";
        return res.status(STATUS.OK).json(successResponseBody);
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
    create,
    getShows,
    deleteShow,
    updateShow
}