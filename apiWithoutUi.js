const express = require('express');
const app = express();
let dotenv = require('dotenv');
dotenv.config();

const mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
const url = "mongodb://127.0.0.1/27017";
let db;

const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJSDoc = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');

const port = process.env.PORT || 8654;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(swaggerJSDoc));

//check heart beat
app.get('/health',(req,res)=>{
    res.status(200).send('Health Ok');
})

// to get all users

app.get('/users', async(req,res) =>{
    const output = [];
    let query = {};

    if(req.query.role && req.query.city){
        query = {
            role:req.query.role,
            city:req.query.city,
            isActive:true
        }
    }else if(req.query.role){
        query = {
            role:req.query.role,
            isActive:true
        }
    }else if(req.query.city){
        query = {
            city:req.query.city,
            isActive:true
        }
    }else if(req.query.isActive){
        let isActive = req.query.isActive;
        if(isActive == 'true')
            isActive = true;
        else
            isActive = false;
        query = {
            isActive:isActive
        }
    }

    const cursor = db.find(query);
    for await (const data of cursor){
        output.push(data);
    }
    cursor.closed;
    res.status(200).send(output);
})

// to get specific user

app.get('/users/:id', async(req,res) =>{
    const output = [];
    const query = {
        "_id":req.params.id
    };
    const cursor = db.find(query);
    for await (const data of cursor){
        output.push(data);
    }
    cursor.closed;
    res.status(200).send(output);
})

// delete user

app.delete('/delete/:id', async(req,res) =>{
    const query = {
        "_id":req.params.id
    };
    await db.deleteOne(query);
    res.status(200).send(`Record has been deleted for ${req.params.id}`);
})

// insert user
app.post('/addUser', async(req,res) =>{
    let output;
    const query = {
        "_id": req.body._id,
        "name": req.body.name,
        "city": req.body.city,
        "phone": req.body.phone,
        "role": req.body.role,
        "isActive": true
    };
    try{
        output = await db.insert(query);
        res.status(200).send(output);
    }catch(err){
        res.status(244).send(err);
    }
     
    
})

// deActivate user
app.put('/deactivateUser', async(req,res) =>{
    let output;
    const query = {
        _id: req.body._id,
    };
    const deactivate = {
        $set:{
            isActive:false
        }
    }
    try{
        await db.updateOne(query,deactivate);
        res.status(200).send('Record deactivate successfully!! - '+req.body._id);
    }catch(err){
        res.status(244).send(err);
    }  
})

// activate user
app.put('/activateUser', async(req,res) =>{
    let output;
    const query = {
        _id: req.body._id,
    };
    const deactivate = {
        $set:{
            isActive:true
        }
    }
    try{
        await db.updateOne(query,deactivate);
        res.status(200).send('Record activated successfully!! - '+req.body._id);
    }catch(err){
        res.status(244).send(err);
    }  
})

app.listen(port, (err)=>{
    if(err) throw err;
    dbConnect();
    console.log(`Server is running on port ${port}`);
})

// functions

function dbConnect(){
    MongoClient.connect(url,(err,client) =>{
        if(err) throw err;
        db = client.db('catalogDB').collection('dashboard');
        console.log('connected to mongo database catalogDB');
    })
}