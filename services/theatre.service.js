const Theatre = require("../models/theatre.model");
const Movie = require("../models/movie.model");
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
        let pagination ={};
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
        
        if(data && data.movieId){
            query.movies = {$all: data.movieId};
        }
        if(data && data.limit){
            pagination.limit = data.limit;
        }
        if(data && data.skip){
            let perPage = (data.limit) ? data.limit : 3;
            pagination.skip = data.skip*perPage;
        }
        const response = await Theatre.find(query,{},pagination);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateMoviesInTheatres = async (theatreId,movieIds,insert) => {
    try {   
        if(insert){
            //we need to add movies
            await Theatre.updateOne(
                {_id: theatreId},
                {$addToSet:{movies:{$each: movieIds}}}
            );
        }else{
            //we need to remove movies
            await Theatre.updateOne(
                {_id: theatreId},
                {$pull: {movies:{$in:movieIds}}}
            );
        }
        const theatre = await Theatre.findById(theatreId);
        return theatre.populate("movies");
    } catch (error) {
        if(error.name = "TypeError"){
            return {
                code:404,
                err: "No theatre found for the given id"
            }
        }
        console.log(error);
        throw error;
    }
}

const updateTheatre = async (theatreId,data) => {
    try {
        const response = await Theatre.findByIdAndUpdate(theatreId,data,{
            new: true,runValidators: true
        });
        if(!response){
            return {
            err: "No record of a theatre found for the given id",
            code: 404
            }
        }
        return response;
    } catch (error) {
        if(error.name === "ValidationError"){
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            return {err: err, code: 422};
        }
        throw error;
    }
}

const getMoviesInATheatre = async (theatreId) => {
    try {
        const theatre = await Theatre.findById(theatreId,{name: 1,movies: 1,address: 1}).populate("movies");
        if(!theatre){
            return {
                err:"No theatre with the given id found",
                code: 404
            }
        }
        return theatre;
    } catch (error) {
        console.log(error);
        throw error;
    }
}



module.exports = {
    createTheatre,
    getTheatre,
    deleteTheatre,
    getAllTheatres,
    updateMoviesInTheatres,
    getAllTheatresInCity,
    updateTheatre,
    getMoviesInATheatre
}