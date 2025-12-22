const movieController = require("../controllers/movie.controller");

const routes = (app) => {
    app.post("/mba/api/v1/movies",movieController.createMovie);
    
    app.delete(
        "/mba/api/v1/movies/:movieId",
        movieController.deleteMovie
    );

    app.get(
        "/mba/api/v1/movies/:movieId",
        movieController.getMovie
    )
}



module.exports = routes; 