const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {UserModel}=require("../model/user.model")
const {BlacklistModel}=require("../model/blacklist.model")
const auth = require("../middleware/auth.middleware")
const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    
    try{
        const {username,email,pass}=req.body
const user=await UserModel.findOne({email:email})

if(user){
    res.status(400).send({msg:"User Already Registered"})
}else{
    const passwordRegex=
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%&*!]){8,}/;
    const passwordCheck=passwordRegex.test(pass)
    if(!passwordCheck){
        return res.status(400).send({
            msg:"password should 8"
        })
    }
    bcrypt.hash(pass, 5, async(err, hash)=> {
        const newuser=new UserModel({username,email,pass:hash})
         await newuser.save()
    res.status(200).send({"msg":"A new user registerd"})

    })

}
       

    }catch(err){
        res.send(400).send({"error":err})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    try{
  const user =await UserModel.findOne({email})
//   console.log(user._id)
  if(user){
    
    bcrypt.compare(pass,user.pass,(err,result)=>{
        const token=jwt.sign({userId:user._id,email:user.email},"masai",{expiresIn:"1h"})
        
        if(result){
            res.status(200).send({"msg":"Login Successfull","token":token})
        }
    })
    
  }else{
    res.status(200).send({"msg":"Wrong Credentials"})
  }
    }catch(err){
        res.status(400).send({"error":err})
    }
   

})

userRouter.get("/logout",auth,async(req,res)=>{
    
try{
    const token=req.headers.authorization
    // const token=req.headers.authorization.split(" ")[1]
    const blacklistToken=new BlacklistModel({token})
    await blacklistToken.save()
    res.status(200).json({"msg":"The user logged out"})
}catch(error){
res.status(400).json({msg:error.message})
}
})

module.exports={
    userRouter
}