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
    );

    app.get(
        "/mba/api/v1/shows",
        showController.getShows
    );

    app.delete(
        "/mba/api/v1/shows/:showId",
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        showController.deleteShow
    );

    app.patch(
        "/mba/api/v1/shows/:showId",
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        showController.updateShow
    );

}

module.exports = routes;