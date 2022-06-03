const router=require('express').Router()
const use=require('../models/users')
const auth=require('../middleware/auth')

router.put('/send',auth,async (req,res)=>{
 try {
     //id of person
     const {pid}=req.body
     //id of user
     const {id:userid}=req.decoded
     //person sending request to
     const recipient=await use.findById(pid)
     //person sending request
     const requester=await use.findById(userid)


     //ensuring user to be able to send request once
     if(recipient.sendRequest.filter(pins=>pins.toString()===userid).length>0){
        return res.status(400).json({msg:'user has already sent  you a request'})
    }
    else{
        if(recipient.Requests.filter(pins=>pins.toString()===userid).length>0){
            return res.status(400).json({msg:'pending'})
        }else{
            if(recipient.friendlist.filter(pins=>pins.toString()===userid).length>0){
                return res.status(400).json({msg:'friends'})
            }else{
                const recep=await use.findByIdAndUpdate(recipient._id,{
                    $push:{
                        Requests:requester._id,
                   }
                },{new:true})
            }
        }
   }

    //send recipients
    if(requester.sendRequest.filter(pins=>pins.toString()===recipient._id).length>0){
        return res.status(400).json({msg:'already sent request'})
    }else{
        const requ=await use.findByIdAndUpdate(requester._id,{
            $push:{sendRequest:recipient._id}
        },{new:true})
         res.json(recipient)
    }
  
 } catch (error) {
     res.status(500).json(error)
 }
})

module.exports=router