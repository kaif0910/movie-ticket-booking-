const express = require("express");
const paymentController = require("../controllers/payment.controller");
const paymentMiddleware = require("../middlewares/payment.middlewares")
const authMiddleware = require("../middlewares/auth.middlewares");

const routes = (app) => {
    app.post(
        "/mba/api/v1/payments",
        authMiddleware.isAuthenticated,
        paymentMiddleware.verifyPaymentCreateRequest,
        paymentController.create
    )
}

module.exports = routes;