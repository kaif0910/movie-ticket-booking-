const Movie = require('../models/movie.model');

const createMovie = async (data) => {
    const movie =await Movie.create(data);
    return movie;
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

module.exports ={
    getMovieById,
    createMovie,
    deleteMovie
}