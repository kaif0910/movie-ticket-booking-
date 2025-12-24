const Movie = require("../models/movie.model")

const errorResponseBody = {
    err: {},
    data: {},
    message: "something went wrong, cannot process the request",
    success: false
}

const successResponseBody = {
    err: {},
    data: Movie,
    message: "successfully processed the request",
    success: true
}

module.exports = {
    errorResponseBody,
    successResponseBody
}