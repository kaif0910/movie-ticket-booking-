const express = require("express");
const authMiddleware = require("../middlewares/auth.middlewares");
const showController = require("../controllers/show.controller");

const routes = (app) => {
    app.post(
        "/mba/api/v1/show",
        authMiddleware.isAuthenticated,
        showController.create
    )
}

module.exports = routes;