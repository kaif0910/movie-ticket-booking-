//this template will be used as a template for building error responses

const errorResponseBody = {
    err: {},
    data: {},
    message: "something went wrong, cannot process the request",
    success: false
}

//this template will be used as a template for building success responses
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