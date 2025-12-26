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
            err: "unable to delete for the given id",
            code: 500
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}



module.exports = {
    createTheatre,
    getTheatre,
    deleteTheatre
}