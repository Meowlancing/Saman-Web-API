const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");


dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology : true , useNewUrlParser : true},()=>{
    console.log("Connected to mongo")
});

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);


app.listen(8000,()=>{
    console.log("Server is running...")
})