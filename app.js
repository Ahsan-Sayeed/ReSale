const express = require('express');
const app = express();
const cors = require('cors');

//middlewares
app.use(cors());
app.use(express.json());

//test route
app.get('/',(req,res)=>{
    res.status(200).send('hello word');
})




module.exports = app;