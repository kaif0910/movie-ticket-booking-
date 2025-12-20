const mongoose = require("mongoose");
const config = require('config');

mongoose
.connect(process.env.DB_URL) // dynamic 
.then(function(){
    console.log("db connected");
})
.catch(function(err){ 
    console.log(err);
})

module.exports = mongoose.connection;