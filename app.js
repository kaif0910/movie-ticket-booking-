const express = require('express');
const app = express();// express app object 
const env = require("dotenv");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const movieRoutes = require('./routes/movie.routes');

env.config();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

movieRoutes(app);//invoking movie routes

app.get("/",(req,res) => {
    return res.json({
        success: true
    })
})
app.listen(process.env.PORT,async () =>{
    console.log(`connected to ${process.env.PORT}`); //callback after successful listen 
    try{
        await mongoose.connect(process.env.DB_URL); //connects to the mongo server
        console.log("db connected");
    }catch(err){
        console.log("not able to connect to db",err);
    }
});

