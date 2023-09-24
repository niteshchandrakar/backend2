const jwt=require("jsonwebtoken")
const {BlacklistModel}=require("../model/blacklist.model")

const auth =async(req,res,next)=>{
    try{
        let token=req.headers.authorization
       
        if(token){
        const istokenBlacklisted= await BlacklistModel.findOne({token})
            if(istokenBlacklisted){
                res.send({"msg":"Login again"})
            }
            jwt.verify(token,"masai",(err,decoded)=>{
                if(decoded){
                   
                    req.body.userID=decoded.userId
                    req.body.email=decoded.email
                    
                    next()
                }else{
                    res.send({"msg":"not authorized"})
                }
            })
            //hiii
        }else{
            res.send({"msg":"not authorized"})
        }
    }catch(error){
        return res.status(400).json({
            msg:error.message || "wrong"
        })
    }
       
}

module.exports=auth