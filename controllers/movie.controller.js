const Movie = require("../models/movie.model");
const movieService = require("../services/movie.service");

const errorResponseBody = {
    err: {},
    data: {},
    message: "something went wrong, cannot process the request",
    success: false
}

const successResponseBody = {
    err: {},
    data: {},
    message: "successfully processed the request",
    success: true
}

const createMovie = async (req,res) => {
    try{
        const movie = await Movie.create(req.body);
        return res.status(201).json({
            success: true,
            error: {},
            data: movie,
            message: "successfully created a movie"
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            error: err,
            data:{},
            message: "something went wrong"
        });
    }
}

const deleteMovie = async (req,res) => {
    try{
        const response = await Movie.deleteOne({
            _id: req.params.movieId
        })
        return res.status(200).json({
            success: true,
            error: {},
            messege: "successfully deleted the movie",
            data: response
        })
    }catch(err){
        console.log(err);
        return req.status(500).json({
            success: false,
            error: err,
            message: "something went wrong",
            data: {}
        });
    }
}

const getMovie = async (req,res) => {
    try{
        const response = await movieService.getMovieById(req.params.id);
        if(response.err){
            errorResponseBody.err = response.err;
            return res.status(response.err).json(errorResponseBody);
        }
        successResponseBody.data = response;
        return res.status(200).json(successResponseBody);
    } catch(err){
        console.log(err);
        return res.status(500).json(errorResponseBody);
    }
}

module.exports = {
    createMovie,
    deleteMovie,
    getMovie
}