const { response } = require('express');
const Movie = require('../models/movie.model');

/**
 * 
 * @param  data -> object containing details of the new movie created 
 * @returns -> returns the new movie created
 */

const createMovie = async (data) => {
    try{
        const movie =await Movie.create(data);
        return movie;
    } catch(error){
        if(error.name === 'ValidationError'){
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            return {err: err, code: 422};
        }else{
            throw error;
        }
    }
}

/**
 * 
 * @param movieId -> id which will be used to identify the movie to be deleted 
 * @returns -> object containing the details of the deleted movie
 */

const deleteMovie = async (movieId) => {
    try {
        const deletedMovie =await Movie.findByIdAndDelete(movieId);
        if(!response){
            return {
                err: "no movie found with the given id",
                code: 404
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}

/**
 * 
 * @param movieId -> movie id which will be used to identify the movie to be fetched
 * @returns -> object containing movie fetched 
 */


const getMovieById = async (movieId) => {

    const movie =await Movie.findById(movieId);
    if(!movie){
        return {
            err: "no movie found for the corresponding id provided"
        }
    };
    return movie;
}


/**
 * @param movieId -> id which will be used to identify the movie to be updated
 * @param  movieId -> id which will be used to identify the movie to be updated
 * @param  data -> object containing the updated movie 
 * @returns -> return the new updated movie details
 */
const updateMovie = async (movieId,data) => {
    try{
        const movie = await Movie.findByIdAndUpdate(movieId,data,{new: true, runValidators: true});
        return movie;
    }catch(error){
        if(error.name === 'ValidationError'){
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            console.log(err);
            return {err: err, code: 422};
        }else{
            throw error;
        }
    }
}

/**
 * 
 * @param  filter -> filter will help us in filtering out data based on the conditionals 
 * @returns -> returns an object containing all the movies fetched based on the filter
 */


const fetchMovies = async (filter) => {
    let query ={};
    if(filter.name){
        query.name = filter.name;
    }
    let movies = await Movie.find(query);
    if(!movies){
        return{
            err: "not able to find the queries movies",
            code: 404
        }
    }
    return movies;
}

module.exports ={
    getMovieById,
    createMovie,
    deleteMovie,
    updateMovie,
    fetchMovies
}