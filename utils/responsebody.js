
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

module.exports = {
    errorResponseBody,
    successResponseBody
}