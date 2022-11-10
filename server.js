/* 
Task
1.Create a Minion => POST Method
2.View list of all minions => GET Method
3.Update a minion => PUT Method
4.Delete a minion => DELETE Method
*/
const express = require('express')
const mongoose  = require('mongoose');
const cors  = require('cors');
require('dotenv').config();
const {MongoClient ,ServerApiVersion} = require('mongodb');
const asyncHandler = require('express-async-handler')
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = 5000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zy3qzqg.mongodb.net/minions?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const mininonSchema =new mongoose.Schema({
    name:{type:String},
    age:{type:Number},
    color:{type:String},
})

const Minion =new mongoose.model('minions' , mininonSchema)

async function run(){
    try{
        await client.connect();
        await mongoose.connect(uri);
        const database = client.db('minions');

        //create a minion
        app.post('/' , asyncHandler(async(req,res)=>{
            const minion = req.body;
            const result = await Minion.create(minion)
            res.send(result);
        }))


        //get all minions
        app.get('/minions' , asyncHandler(async(req,res)=>{
            const result = await Minion.find({});
            res.send(result)
        }))

        //update a minion
        app.put('/minions/:id' ,asyncHandler(async(req,res)=>{
            const updatedMinion = await Minion.findByIdAndUpdate(req.params.id ,req.body,{new:true})
            res.send(updatedMinion)
        }))

        //delete a minion
        app.delete('/minions/:id' ,asyncHandler(async(req,res)=>{
            const minion = await Minion.findByIdAndDelete(req.params.id)
            res.send(minion)
        }))
    }
    finally{

    }
}

run().catch(console.dir)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

