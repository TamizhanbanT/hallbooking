//const express = require('express')
import express from 'express'

const app = express()
//const { MongoClient } = require('mongodb')
import {MongoClient} from 'mongodb'
const port=5000
app.use(express.json())
import * as dotenv from 'dotenv'
dotenv.config()
console.log(process.env.mongo_url)
//mongodb connection
const mongo_url =process.env.mongo_url;
async function main() {
    // Use connect method to connect to the server
    const client=new MongoClient(mongo_url)
    await client.connect();
    console.log('Connected successfully to server');
    return client
}
const client=await main()


app.get('/', function (req, res) {
  res.send('WELCOME TO TAMIZH HALLBOOKING')
})


app.get('/hallbooking/', async  (req, res)=> {
  const{price_per_hour,room_type,id}=req.query

  if(req.query.price_per_hour){
    req.query.price_per_hour=+req.query.price_per_hour
  }
  if(req.query.room_id){
    req.query.id=+req.query.room_id
  }
  const facility=await client.db("hallbooking").collection("facility").find(req.query).toArray()
  /* const facility=await client.db("hallbooking").collection("facility").find({}).toArray() */
  console.log(facility)
res.send(facility)
})

app.post('/hallbooking/', async  (req, res)=> {

  const facility=await client.db("hallbooking").collection("facility").insertOne(req.body)
  /* const facility=await client.db("hallbooking").collection("facility").find({}).toArray() */
  console.log(facility)
res.send(facility)
})


app.get('/hallbooking/:room_id', async  (req, res)=> {
  const{room_id}=req.params
  console.log(req.params,room_id)
  const facility=await client.db("hallbooking").collection("facility").findOne({room_id:+room_id})
  console.log(facility)

  facility?res.send(facility):res.send({message:"There is no such that facility"})
})
//delete method (facility)

app.delete('/hallbooking/:room_id', async  (req, res)=> {
  const{room_id}=req.params
  console.log(req.params,room_id)
  const facility=await client.db("hallbooking").collection("facility").deleteOne({room_id:+room_id})
  console.log(facility)

  res.send(facility)
})




//post get(bookingroom)

app.get('/bookingroom/', async  (req, res)=> {
  const{date,room_id}=req.query

  if(req.query.room_id){
    req.query.room_id=+req.query.room_id
  }
  if(req.query.date){
    req.query.date=+req.query.date
  }
  const facility=await client.db("hallbooking").collection("bookingroom").find(req.query).toArray()
  /* const facility=await client.db("hallbooking").collection("facility").find({}).toArray() */
  console.log(facility)
res.send(facility)
})

//post method(bookingroom)

// POST endpoint(sameroom_id and same date)
app.post('/bookingroom', async (req, res) => {
  try {
      const { date, room_id } = req.body;

      // Check if there's any document with the same date
      const existingDate = await client.db("hallbooking").collection("bookingroom").findOne({ date });
      if (existingDate) {
          // If data already exists with the same date, send a response indicating the conflict
          return res.status(400).send('Data with the same date already exists');
      }

      // Check if there's any document with the same room_id
      const existingRoom = await client.db("hallbooking").collection("bookingroom").findOne({ room_id });
      if (existingRoom) {
          // If data already exists with the same room_id, send a response indicating the conflict
          return res.status(400).send('Data with the same room_id already exists');
      }

      // If data doesn't exist with the same date and room_id, insert it into the collection
      await client.db("hallbooking").collection("bookingroom").insertOne(req.body);
      res.status(201).send('Data inserted successfully');
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});




//delete

app.delete('/bookingroom/:room_id', async  (req, res)=> {
  const{room_id}=req.params
  console.log(req.params,room_id)
  const facility=await client.db("hallbooking").collection("bookingroom").deleteOne({room_id:+room_id})
  console.log(facility)

  res.send(facility)
})


app.listen(port,()=>console.log("server started on port:",port))