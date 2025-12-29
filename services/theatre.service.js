const Theatre = require("../models/theatre.model");
const { successResponseBody, errorResponseBody } = require("../utils/responsebody");

const createTheatre = async (data) => {
    try {
        const response = await Theatre.create(data);
        return response;
    } catch (error) {
        if(error.name === "ValidationError"){
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            return {err: err, code: 422};
        }
        console.log(error);
        throw err;
    }
}

const getTheatre =async (theatreId) => {
    try {
        let response = await Theatre.findById(theatreId);
        if(!response){
            return {
            err: "no theatre found for the given id",
            code: 404
        }
    }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const deleteTheatre = async (theatreId) => {
    try {
        let response = await Theatre.findByIdAndDelete(theatreId);
        if(!response){
            return {
            err: "No record of a theatre found for the given id",
            code: 404
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getAllTheatres = async () => {
    try {
        let response = await Theatre.find({});
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

const getAllTheatresInCity = async (data) => {
    try {
        let query = {};
        if(data && data.city){
            //this checks whether city is present in query params or not 
            query.city = data.city;
        }
        if(data && data.pincode){
            //this checks whether pincode is present in query params or not
            query.pincode = data.pincode;
        }
        if(data && data.name){
            // this checks whether name is present in query params or not
            query.name = data.name;
        }
        const response = await Theatre.find(query);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateMoviesInTheatres = async (theatreId,movieIds,insert) => {
    const theatre = await Theatre.findById(theatreId);
    if(!theatre){
        return{
            err: "no such theatre found",
            code:404
        };
    }
    if(insert){
        //we need to add movies
        movieIds.forEach(movieId => {
            theatre.movies.push(movieId);
        });
    } else {
        // we need to remove movies
        let savedMovieIds = theatre.movies;
        movieIds.forEach(movieId => {
            savedMovieIds = savedMovieIds.filter(smi=> smi == movieId);
        });
        theatre.movies = savedMovieIds;
    }
    await theatre.save();
    return theatre.populate("movies");
}



module.exports = {
    createTheatre,
    getTheatre,
    deleteTheatre,
    getAllTheatres,
    updateMoviesInTheatres,
    getAllTheatresInCity
}