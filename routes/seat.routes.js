const express = require('express');
const { isAuthenticated } = require('../middlewares/auth.middlewares');
const seatController = require('../controllers/seat.controller');

const routes = (app) => {
    
    app.post(
        "/mba/api/v1/seat/lock",
        isAuthenticated,
        seatController.lockSeats
    )
}

module.exports = routes;