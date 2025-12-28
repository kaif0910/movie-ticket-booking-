const theatreController = require("../controllers/theatre.controller");
const theatreMiddleware = require("../middlewares/theatre.middlewares");

const routes = (app) => {
    app.post("/mba/api/v1/theatres",
        theatreMiddleware.validateCreateRequest,
        theatreController.createTheatre
    )

    app.get("/mba/api/v1/theatres/:theatreId",
        theatreController.getTheatre
    )

    app.delete("/mba/api/v1/theatres/:theatreId",
        theatreController.deleteTheatre
    )

    app.get("/mba/api/v1/allTheatres",
        theatreController.getAllTheatres
    )

    app.patch("/mba/api/v1/theatres/:theatreId/movies",
        theatreMiddleware.validateUpdateMovies,
        theatreController.updateMoviesInTheatres
    );
}

module.exports = routes;