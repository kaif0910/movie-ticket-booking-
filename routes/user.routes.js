const express = require("express");
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const authmiddleware = require("../middlewares/auth.middlewares");

const routes = (app) => {
    app.patch(
        "/mba/api/v1/user/:userId",
        authmiddleware.validateResetPassword,
        userController.update
    )
}

module.exports = routes;