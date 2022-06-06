const router=require('express').Router()
const use=require('../models/users')
const auth=require('../middleware/auth')





router.get('/allusers',auth,async(req,res)=>{
    try {
        const {id:userId}=req.decoded
        const pid=await use.find({_id:{$ne:userId}}).populate('friendlist','user')
        res.status(200).json(pid)
    } catch (error) {
        console.log(error)
    }
})
//get all sent requests
router.get('/sentrequests',auth,async(req,res)=>{
    try {
        const {id:userId}=req.decoded
        const pid=await use.findById(userId).populate('sendRequest')
        res.status(200).json(pid.sendRequest)
    } catch (error) {
        console.log(error)
    }
})
//get all friends
router.get('/friends',auth,async(req,res)=>{
    try {
        const {id:userId}=req.decoded
        const pid=await use.findById(userId).populate('friendlist')
        res.status(200).json(pid.friendlist)
    } catch (error) {
        console.log(error)
    }
})

//send friend request
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
         res.status(200).json(requ)
    }
  
 } catch (error) {
     res.status(500).json(error)
 }
})


//accept requests
router.put('/acceptRequest',auth,async(req,res)=>{
    const {id}=req.body
    const {id:userId}=req.decoded
    try{
    //person sending request to
     const recipient=await use.findById(id)
    //person sending the request
     const requester=await use.findById(userId)
    //send friend request to store in recipients request
    

    // checkin if user is in list 
    if(requester.Requests.filter(pins=>pins.toString()!==recipient._id).length>0){
        const recep=await use.findByIdAndUpdate(requester._id,{
            $pull:{
                Requests:recipient._id,
            },
            $push:{
                friendlist:recipient._id,
            }
        },{new:true})
        res.status(200).json(recep)
    }else{
        res.send('not on list')
    }

    //removing user from sent request and adding him/her to friendlist
    if(recipient.sendRequest.filter(pins=>pins.toString()!==requester._id).length>0){
        const recep=await use.findByIdAndUpdate(recipient._id,{
            $pull:{
                sendRequest:requester._id,
            },
            $push:{
                friendlist:requester._id,
            }
        },{new:true})
    }else{
        res.send('not on list')
    }
    }catch(error){
     res.json(error)
    }
})


module.exports=router