const userController = require("../controllers/user.controller");

const routes = (app) =>{
    app.post(
        "/mba/api/v1/createUser",
        userController.createUser
    );
}


module.exports = routes;