const express = require('express');
const app = express();// express app object 
const env = require("dotenv");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const movieRoutes = require('./routes/movie.routes');
const theatreRoutes = require("./routes/theatre.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const bookingRoutes = require("./routes/booking.routes");
const showRoutes = require("./routes/show.routes");
const paymentRoutes = require("./routes/payment.routes");

env.config();

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

movieRoutes(app);//invoking movie routes
theatreRoutes(app);//invoking theatre routes
authRoutes(app);//invoking auth routes
userRoutes(app);//invoking user routes
bookingRoutes(app);//invoking booking routes
showRoutes(app);//invoking show routes
paymentRoutes(app);//invoking payment routes

app.get("/",(req,res) => {
    return res.json({
        success: true
    })
})
app.listen(process.env.PORT,async () =>{
    console.log(`connected to ${process.env.PORT}`); //callback after successful listen 
    try{
        if(process.env.NODE_ENV == "Production"){
            await mongoose.connect(process.env.PROD_DB_URL); 
            console.log("db connected");
        }else{
            await mongoose.connect(process.env.DB_URL); //connects to the mongo server
            console.log("db connected");
        }
    }catch(err){
        console.log("not able to connect to db",err);
    }
});

