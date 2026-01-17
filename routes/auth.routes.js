const authController = require("../controllers/auth.controller");
const middleware = require("../middlewares/auth.middlewares");   

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
}


module.exports = routes;