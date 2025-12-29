const theatreService = require("../services/theatre.service");
const {errorResponseBody, successResponseBody} =require("../utils/responsebody");


const createTheatre = async (req,res) => {
    try {
        let response = await theatreService.createTheatre(req.body);
        if(response.err){
            errorResponseBody.err = response.err;
            errorResponseBody.message = "validation failed on few parameters of the request body";
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "successfully created the theatre";
        return res.status(201).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err;
        return res.status(500).json(errorResponseBody);
    }
}

const getTheatre = async (req,res) => {
    try {
        let response = await theatreService.getTheatre(req.params.theatreId);
        if(response.err){
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "successfully fetched the theatre";
        return res.status(200).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
    

}

const deleteTheatre = async (req,res) => {
    try {
        let response = await theatreService.deleteTheatre(req.params.theatreId);
        if(response.err){
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "successfully deleted the theatre";
        return res.status(200).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}

const getAllTheatres = async (req,res) => {
    try {
        let response = await theatreService.getAllTheatres();
        if(response.err){
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched all the Theatres";
        return res.status(200).json(successResponseBody);
    } catch (error) {
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}


/**
 * 
 * @param  theatreId -> unique id of the theatre for which we want to update movies 
 * @param  movieIds -> array of the movie ids that are expected to be updated in theatre
 * @param  insert -> boolean that tells whether we want insert movies or remove them
 * @returns -> updated theatre object
 */
const updateMoviesInTheatres =async (req,res) => {
    try {
        const response = await theatreService.updateMoviesInTheatres(
            req.params.theatreId,
            req.body.movieIds,
            req.body.insert
        );
        if(response.err){
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "successfully added movies to the required theatre";
        return res.status(200).json(successResponseBody);
    } catch (error) {
        console.log(error);
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
}

const getAllTheatresInCity = async (req,res) => {
    try {
        let response = await theatreService.getAllTheatresInCity(req.query);
        if(response.err){
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "successfully fetched the theatres";
        return res.status(200).json(successResponseBody);
    } catch (error) {
        console.log(error);
        return res.status(500).json(errorResponseBody);
    }
}

const updateTheatre = async (req,res) => {
    try {
        let response = await theatreService.updateTheatre(req.params.theatreId,req.body);
        if(response.err){
            errorResponseBody.err = response.err;
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "successfully updated the theatre";
        return res.status(200).json(successResponseBody);
    } catch (error) {
        console.log(error);
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }

}



module.exports = {
    createTheatre,
    getTheatre,
    deleteTheatre,
    getAllTheatres,
    updateMoviesInTheatres,
    getAllTheatresInCity,
    updateTheatre
}