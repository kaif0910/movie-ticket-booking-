const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/user.model");
const Movie = require("../models/movie.model");
const Theatre = require("../models/theatre.model");
const Show = require("../models/show.model");
const { USER_ROLE, USER_STATUS } = require("../utils/constants");

const REAL_MOVIES = [
  {
    name: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.",
    casts: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Austin Butler"],
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    director: "Denis Villeneuve",
    language: "English",
    releaseDate: "2024-03-01",
    releaseStatus: "Released"
  },
  {
    name: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    casts: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr.", "Florence Pugh"],
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    director: "Christopher Nolan",
    language: "English",
    releaseDate: "2023-07-21",
    releaseStatus: "Released"
  },
  {
    name: "Interstellar",
    description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    casts: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    director: "Christopher Nolan",
    language: "English",
    releaseDate: "2014-11-07",
    releaseStatus: "Released"
  },
  {
    name: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    casts: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine", "Gary Oldman"],
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    director: "Christopher Nolan",
    language: "English",
    releaseDate: "2008-07-18",
    releaseStatus: "Released"
  },
  {
    name: "Spider-Man: Across the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    casts: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson"],
    trailerUrl: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    director: "Joaquim Dos Santos, Kemp Powers",
    language: "English",
    releaseDate: "2023-06-02",
    releaseStatus: "Released"
  }
];

const REAL_THEATRES = [
  {
    name: "PVR Director's Cut",
    description: "Ultra-luxury cinema experience featuring recliners, gourmet dining, and Dolby Atmos projection.",
    city: "New Delhi",
    pincode: 110017,
    address: "Select CITYWALK Mall, Saket, New Delhi"
  },
  {
    name: "INOX Megaplex IMAX",
    description: "Premier 70mm Laser IMAX screen with state-of-the-art immersive audio engineering.",
    city: "Mumbai",
    pincode: 400064,
    address: "Inorbit Mall, Malad West, Mumbai"
  },
  {
    name: "Cinepolis VIP Lounge",
    description: "VIP seating with in-seat service and crystal clear 4K laser projection.",
    city: "Bengaluru",
    pincode: 560095,
    address: "Forum Mall, Koramangala, Bengaluru"
  }
];

async function seedData() {
  try {
    const dbUrl = process.env.DB_URL || "mongodb://localhost/mba_db";
    console.log(`Connecting to MongoDB at ${dbUrl}...`);
    await mongoose.connect(dbUrl);

    console.log("Clearing existing sample data...");
    await Show.deleteMany({});
    await Theatre.deleteMany({});
    await Movie.deleteMany({});

    // Ensure Admin User exists
    let adminUser = await User.findOne({ userRole: USER_ROLE.admin });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Cinema Admin",
        email: "admin@cineticket.com",
        password: "adminpassword123",
        userRole: USER_ROLE.admin,
        userStatus: USER_STATUS.approved
      });
      console.log("Created Admin user: admin@cineticket.com");
    }

    // Seed Movies
    console.log("Seeding movies...");
    const createdMovies = await Movie.insertMany(REAL_MOVIES);
    console.log(`Successfully seeded ${createdMovies.length} movies.`);

    // Seed Theatres
    console.log("Seeding theatres...");
    const movieIds = createdMovies.map((m) => m._id);
    const theatreDocs = REAL_THEATRES.map((t) => ({
      ...t,
      owner: adminUser._id,
      movies: movieIds
    }));

    const createdTheatres = await Theatre.insertMany(theatreDocs);
    console.log(`Successfully seeded ${createdTheatres.length} theatres.`);

    // Seed Shows
    console.log("Seeding showtimes...");
    const showsToInsert = [];
    const timings = ["10:30 AM", "02:15 PM", "06:00 PM", "09:45 PM"];
    const formats = ["2D", "3D", "IMAX"];

    for (const theatre of createdTheatres) {
      for (const movie of createdMovies) {
        // Create 2 showtimes per movie per theatre
        for (let i = 0; i < 2; i++) {
          const timing = timings[(theatre.name.length + movie.name.length + i) % timings.length];
          const format = formats[i % formats.length];
          const price = format === "IMAX" ? 450 : format === "3D" ? 350 : 250;

          showsToInsert.push({
            theatreId: theatre._id,
            movieId: movie._id,
            timing: timing,
            noOfSeats: 60,
            price: price,
            format: format
          });
        }
      }
    }

    const createdShows = await Show.insertMany(showsToInsert);
    console.log(`Successfully seeded ${createdShows.length} showtimes.`);

    console.log("\n✅ DATA SEEDING COMPLETE!");
    console.log("Summary:");
    console.log(`- Movies: ${createdMovies.length}`);
    console.log(`- Theatres: ${createdTheatres.length}`);
    console.log(`- Shows: ${createdShows.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  }
}

seedData();
