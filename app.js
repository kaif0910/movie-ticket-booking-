const express = require('express');
const app = express();// express app object 
const env = require("dotenv");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

env.config();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));


app.get("/",(req,res) => {
    return res.json({
        success: true
    })
})
app.listen(process.env.PORT,async () =>{
    console.log(`connected to ${process.env.PORT}`); //callback after successful listen 
    await mongoose.connect(process.env.DB_URL);
    console.log("db connected");
})

