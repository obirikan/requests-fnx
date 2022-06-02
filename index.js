const express=require('express')
const mongoose=require('mongoose')
const app=express()
const cors = require("cors");
const userRoute=require('./routes/handlers')
require("dotenv").config();

//middlewares
app.use(cors())
app.use(express.json())
app.use('/api/users',userRoute)
//routes



//mongoose connection
mongoose.connect("mongodb+srv://kelvin:salvation22@cluster0.iaa1e.mongodb.net/newapp",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

//server connection
const port=process.env.PORT || 7000
app.listen(port,()=>
 console.log(`server is running on port ${port}`)
)