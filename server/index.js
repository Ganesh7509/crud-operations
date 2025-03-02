
const express  = require('express')
const cors = require('cors')
const dotenv=require('dotenv')
dotenv.config()
const mongoose = require('mongoose')

const app = express()
app.use(cors({
    origin: ['http://localhost:3000','https://crud-operations-front-end.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))
app.use(express.json())

const PORT  = process.env.PORT || 8080 

//schema
const schemaData  = mongoose.Schema({
    name : String,
    email : String,
    mobile : String,
},{
    timestamps : true
})

const userModel  = mongoose.model("user",schemaData)
app.get("/",async(req,res)=>{
    const data = await userModel.find({})
    res.json({success : true , data : data})
})  
app.post("/create",async(req,res)=>{
    console.log(req.body)
    const data = new userModel(req.body)
    await data.save()
    res.send({success : true, message : "data save successfully" , data : data})
})
app.put("/update",async(req,res)=>{
    console.log(req.body)
    const { _id,...rest} = req.body 

    console.log(rest)
    const data = await userModel.updateOne({ _id : _id},rest)
    res.send({success : true, message : "data update successfully", data : data})
})
app.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const data = await userModel.deleteOne({_id : id})
    res.send({success : true, message : "data delete successfully", data : data})
})
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to DB");
    app.listen(PORT,'0.0.0.0',() => console.log(`Server running at http://0.0.0.0:${PORT}`));
})
.catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit with error if DB connection fails
});
