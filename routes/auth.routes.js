const userController = require("../controllers/auth.controller");
const middleware = require("../middlewares/auth.middilewares");   

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
}


module.exports = routes;