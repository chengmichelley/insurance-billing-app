const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("error", (err)=> 
  console.log("Error connecting to MongoDB", err.message))

mongoose.connection.on("connected", ()=> 
  console.log("Connected to MongoDB", mongoose.connection.name))