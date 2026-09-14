const authController = require("../controllers/auth.controller");
const middleware = require("../middlewares/auth.middlewares");   
const passport = require("../config/passport.config");

const routes = (app) =>{
    app.post(
        "/mba/api/v1/auth/signup",
        middleware.validateSignUpRequest,
        authController.signup
    );

    app.post(
        "/mba/api/v1/auth/signin",
        middleware.validateSignInRequest,
        authController.signin
    );

    app.patch(
        "/mba/api/v1/auth/resetPassword",
        middleware.isAuthenticated,
        authController.resetPassword
    );

    app.get(
        "/auth/google",
        passport.authenticate("google", { scope: ["profile", "email"], session: false })
    );

    app.get(
        "/auth/google/callback",
        passport.authenticate("google", { session: false, failureRedirect: "/auth/google/failure" }),
        authController.googleCallback
    );

    app.get(
        "/mba/api/v1/auth/google",
        passport.authenticate("google", { scope: ["profile", "email"], session: false })
    );

    app.get(
        "/mba/api/v1/auth/google/callback",
        passport.authenticate("google", { session: false, failureRedirect: "/auth/google/failure" }),
        authController.googleCallback
    );
}


module.exports = routes;