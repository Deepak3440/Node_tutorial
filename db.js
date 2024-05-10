const mongoose= require('mongoose');

// define the  mongoDb connection url

const mongoUrl='mongodb://localhost:27017/hotel';

//setup mongodb connection
mongoose.connect(mongoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    

//mongoose maintain a default connection object  representing the mongo connection

const db=mongoose.connection;

db.on('connected',()=>{
    console.log("connected to mongoDB");
})

db.on('error',(err)=>{
    console.log(err);
})

db.on('disconnected',()=>{
    console.log("disconnected from mongodb");
})


// export database in db
module.exports=db;