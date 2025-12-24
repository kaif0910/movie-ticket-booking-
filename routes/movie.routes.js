const movieController = require("../controllers/movie.controller");
const userController = require("../controllers/user.controller");
const movieMiddleware = require("../middlewares/movie.middlewares");


const routes = (app) => {
    app.post("/mba/api/v1/movies",
        movieMiddleware.validateCreateRequest,
        movieController.createMovie);
    
    app.delete(
        "/mba/api/v1/movies/:movieId",
        movieController.deleteMovie
    );

    app.get(
        "/mba/api/v1/movies/:movieId",
        movieController.getMovie
    )
    
    app.put(
        "/mba/api/v1/movies/:movieId",
        movieController.updateMovie
    )

    app.patch
    (
        "/mba/api/v1/movies/:movieId",
        movieController.updateMovie
    )

    app.post(
            "/mba/api/v1/createUser",
            userController.createUser
        );
}



module.exports = routes; 