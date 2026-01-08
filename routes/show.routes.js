const express = require("express");
const authMiddleware = require("../middlewares/auth.middlewares");
const showController = require("../controllers/show.controller");
const showMiddleware = require("../middlewares/show.middlewares");

const routes = (app) => {
    app.post(
        "/mba/api/v1/show",
        authMiddleware.isAuthenticated,
        showMiddleware.validateCreateShowRequest,
        showController.create
    )
}

module.exports = routes;