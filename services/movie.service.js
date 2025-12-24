const Movie = require('../models/movie.model');

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

const deleteMovie = async (movieId) => {
    const deletedMovie =await Movie.findByIdAndDelete(movieId);
    return response;
}


const getMovieById = async (movieId) => {

    const movie =await Movie.findById(movieId);
    if(!movie){
        return {
            err: "no movie found for the corresponding id provided"
        }
    };
    return movie;
}

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