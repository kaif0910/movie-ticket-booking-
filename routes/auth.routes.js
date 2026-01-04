const userController = require("../controllers/auth.controller");
const middleware = require("../middlewares/auth.middlewares");   

const routes = (app) =>{
    app.post(
        "/mba/api/v1/auth/signup",
        middleware.validateSignUpRequest,
        userController.signup
    );

    app.post(
        "/mba/api/v1/auth/signin",
        middleware.validateSignInRequest,
        userController.signin
    );

    app.patch(
        "/mba/api/v1/auth/resetPassword",
        middleware.isAuthenticated,
        userController.resetPassword
    );
}


module.exports = routes;