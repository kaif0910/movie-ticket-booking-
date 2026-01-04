const express = require("express");
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

const routes = (app) => {
    app.patch(
        "/mba/api/v1/user/:userId",
        userController.update
    )
}

module.exports = routes;