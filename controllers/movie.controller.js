const Movie = require("../models/movie.model");
const movieService = require("../services/movie.service");
const {successResponseBody, errorResponseBody } = require("../utils/responsebody");


const createMovie = async (req,res) => {
    try{
        const response = await movieService.createMovie(req.body);
        if(response.err){
            errorResponseBody.err = response.err;
            errorResponseBody.message = "validation error while creating movie";
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = movie;
        successResponseBody.message = "successfully created the movie";
        return res.status(201).json(successResponseBody);
    } catch(err){
        console.log(err);
        return res.status(500).json(errorResponseBody);
    }
}

const deleteMovie = async (req,res) => {
    try{
        const response = await movieService.deleteMovie(req.params.movieId);
        successResponseBody.data = response;
        successResponseBody.message = "successfully deleted the movie";
        return res.status(200).json(successResponseBody)
    }catch(err){
        console.log(err);
        return res.status(500).json(errorResponseBody);
    }
}

const getMovie = async (req,res) => {
    try{
        const response = await movieService.getMovieById(req.params.movieId);
        if(response.err){
            errorResponseBody.err = response.err;
            return res.status(response.err).json(errorResponseBody);
        }
        else{
            successResponseBody.data = response;
            return res.status(200).json(successResponseBody);
        }
    } catch(err){
        console.log(err);
        return res.status(500).json(errorResponseBody);
    }
}

const updateMovie = async (req,res) => {
    try{
        const response = await movieService.updateMovie(req.params.movieId,req.body);
        if(response.err){
            errorResponseBody.err = response.err;
            errorResponseBody.message = "validation error while updating movie";
            return res.status(response.code).json(errorResponseBody);
        }
        successResponseBody.data = response;
        successResponseBody.message = "successfully updated the movie";
        return res.status(200).json(successResponseBody);
    } catch(err){
        console.log(err);
        errorResponseBody.err = err;
        return res.status(500).json(errorResponseBody);
    }
}

module.exports = {
    createMovie,
    deleteMovie,
    getMovie,
    updateMovie
}