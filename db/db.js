const mongoose=require("mongoose")

require("dotenv").config()

const db=mongoose.connect(process.env.db).then(()=>{
    console.log("connection to db established")
}).catch((err)=>{
    console.log(err.message)
})

 
module.exports=db
 