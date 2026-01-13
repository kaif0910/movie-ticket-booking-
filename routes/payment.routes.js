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
    );

    app.get(
        "/mba/api/v1/payments/:paymentId",
        authMiddleware.isAuthenticated,
        paymentController.getPaymentDetailsById
    );

    app.get(
        "/mba/api/v1/payments",
        authMiddleware.isAuthenticated,
        paymentController.getAllPayments
    );
}

module.exports = routes;