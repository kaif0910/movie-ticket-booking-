const movieController = require("../controllers/movie.controller");
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
    );

    app.get(
        "/mba/api/v1/movies",
        movieController.fetchMovies
    );
}



module.exports = routes; 