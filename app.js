const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

//connect to database
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.36zkm2g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//middlewares
app.use(cors());
app.use(express.json());

//test route
app.get('/',(req,res)=>{
    res.status(200).send('hello word');
})

async function run() {
    try {
      const database = client.db("BuySell");
      //collections
      const Category1 = database.collection("Category1");
      const Category2 = database.collection("Category2");
      const Category3 = database.collection("Category3");
      const Users = database.collection("Users");

    //  routes
      //create users
        app.post('/createaccount',async(req,res)=>{
            const result = await Users.insertOne(req.body);
            console.log(result);
            res.status(200).send(result);
        })
        //get a user
        app.get('/users/:uid',async(req,res)=>{
          const result = await Users.find({uid:req.params.uid}).toArray();
          res.status(200).send(result[0]);
        })
    //admin panel
        // get all buyers
        app.get('/admin/buyers',async(req,res)=>{
          const result = await Users.find({role:'Buyer'}).toArray();
          res.status(200).send(result);
        })
        // delete a buyer
        app.delete('/admin/buyer/:id',async(req,res)=>{
          const result = await Users.deleteOne({_id:ObjectId(req.params.id)});
          res.status(200).send(result);
        })
        // get all sellers 
        app.get('/admin/sellers',async(req,res)=>{
          const result = await Users.find({role:"Seller"}).toArray();
          res.status(200).send(result);
        })
        //delete a seller 
        app.delete('/admin/seller/:id',async(req,res)=>{
          const result = await Users.deleteOne({_id:ObjectId(req.params.id)});
          res.status(200).send(result);
        })
// end of admin panel

    } finally {}
  }
  run().catch(console.dir);




module.exports = app;