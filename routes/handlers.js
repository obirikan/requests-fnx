const router=require('express').Router()
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const use=require('../models/users')


//register
router.post('/register',async (req,res)=>{
    try {
       const {users,password}=req.body
       //password
       const salt=await bcrypt.genSalt(10)
       const hashedPassword=await bcrypt.hash(password,salt)
       //finding user 
       const person=await use.findOne({user:users})
       //making sure two usernames does not exist
       if(person){
            res.status(422).json('username already exist')
       }else{
             const person=await use.create({
             user:users,
             password:hashedPassword
            })
      //destructuring
            const {user,id}=person
            const token=jwt.sign({user,id},process.env.SECRET) 
            res.status(200).json({person,token})
       }

    } catch (err) {
        console.log(err)
    }
})
    
    router.post('/login',async (req,res)=>{
        try {
           const {users,password}=req.body
           //finding user 
           const person=await use.findOne({user:users})
           //destructure
           if(person===null){
               res.status(422).json(' username does not exist ')
           }
           const valid=await bcrypt.compare(password,person.password)
           if(valid===null){
            res.json(valid)
        }
           //making sure two usernames does not exist
           if(!person || !valid){
                res.status(422).json('wrong username or password')
           }else{
            const {user,id}=person
            const token=jwt.sign({user,id},process.env.SECRET) 
            res.status(200).json({person,token})
                }
           
    
        } catch (err) {
            console.log(err)
        }
    })



module.exports=router