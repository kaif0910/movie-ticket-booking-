const Movie = require('../models/movie.model');
const movie = require('../models/movie.model');

const getMovieById = async (id) => {
    const movie = Movie.findById(id);
    if(!movie){
        return {
            err: "no movie found for the corresponding id provided"
        }
    };
    return movie;
}

module.exports ={
    getMovieById
}