const express = require("express");
const bookingController = require("../controllers/booking.controller");
const bookingMiddleware = require("../middlewares/booking.middlewares");
const authMiddleware = require('../middlewares/auth.middlewares');

const routes = (app) =>{
    app.post(
        "/mba/api/v1/bookings",
        authMiddleware.isAuthenticated,
        bookingMiddleware.validateBookingRequest,
        bookingController.create
    );

    app.patch(
        "/mba/api/v1/bookings/:bookingId",
        authMiddleware.isAuthenticated,
        bookingMiddleware.canChangeStatus,
        bookingController.update
    )
}

module.exports = routes;