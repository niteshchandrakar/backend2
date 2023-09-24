const express=require("express")
const {connection}=require("./db")
require("dotenv").config()
const {userRouter}=require("./routes/user.routes")
const jwt=require("jsonwebtoken")
const PostRouter=require("./routes/note.routes")
const auth=require("./middleware/auth.middleware")
const cors=require("cors")
const app=express()
app.use(express.json())
app.use(cors())
app.get("/",(req,res)=>{
    try{
        res.status(200).send({"msg":"this is the home page"})
    }catch(err){
   res.status(400).send({"err":err})
    }
})

//restricted routes



app.use("/users",userRouter)
app.use("/notes",auth,PostRouter)


app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("connected to the DB")

    }catch(err){
        console.log(err)
    }
})