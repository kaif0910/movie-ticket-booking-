const userController = require("../controllers/user.controller");
const middleware = require("../middlewares/auth.middilewares");   

const routes = (app) =>{
    app.post(
        "/mba/api/v1/auth/signup",
        middleware.validateSignUpRequest,
        userController.signup
    );
}


module.exports = routes;