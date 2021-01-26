const express = require('express')
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')

//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//env config
dotenv.config() 

//connect mongodb
mongoose.connect(process.env.DB_URI, 
{ useNewUrlParser: true, useUnifiedTopology: true },
() =>{
    console.log('mongoose connected to db');
})


//Middleware

app.use(express.json());       //now we can send data in json

//route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, ()=>{
    console.log('listening...');
})