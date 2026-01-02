const userController = require("../controllers/user.controller");

const routes = (app) =>{
    app.post(
        "/mba/api/v1/auth/signup",
        userController.signup
    );
}


module.exports = routes;