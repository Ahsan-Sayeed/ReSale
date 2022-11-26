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
      const Products = database.collection("Products");
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
        // get all buyers and sellers
        app.get('/admin/:key',async(req,res)=>{
          const result = await Users.find({role:req.params.key}).toArray();
          res.status(200).send(result);
        })
        // delete a buyer
        app.delete('/admin/buyer/:id',async(req,res)=>{
          const result = await Users.deleteOne({_id:ObjectId(req.params.id)});
          res.status(200).send(result);
        })
        //delete a seller 
        app.delete('/admin/seller/:id',async(req,res)=>{
          const result = await Users.deleteOne({_id:ObjectId(req.params.id)});
          res.status(200).send(result);
        })
        //update a seller
        app.put('/admin/seller/:id',async(req,res)=>{
          const result = await Users.updateOne(
            {
              _id:ObjectId(req.params.id)
            },
            {
                $set:{
                  verified:true
                } 
          },
          {
            upsert: true
          });          
          res.status(200).send(result);
        })
// end of admin panel

//seller
        app.post('/seller/products',async(req,res)=>{
          const result = await Products.insertOne({...req.body,Time:Date.now()});
          res.status(200).send(result);
        })
        app.get('/seller/products/:uid',async(req,res)=>{
          const result = await Products.find({sellerUID:req.params.uid}).toArray();
          res.status(200).send(result);
        })
        app.delete('/seller/products/:id',async(req,res)=>{
          const result = await Products.deleteOne({_id:ObjectId(req.params.id)});
          res.status(200).send(result);
        })
        app.put('/seller/products/:id',async(req,res)=>{
          const result = await Products.updateOne(
            {
              _id:ObjectId(req.params.id)
            },
            {
                $set:{
                  advertise:req.body.advertise
                } 
          },
          {
            upsert: true
          })
          res.status(200).send(result);
        })
//sellers end

// open to all
        app.get('/ads',async(req,res)=>{
          const result = await Products.find({advertise:true}).toArray();
          res.status(200).send(result);
        })

    } finally {}
  }
  run().catch(console.dir);


module.exports = app;