const mongoose=require('mongoose')


const UsersSchema=new mongoose.Schema({
    user:{
        type:String,
    },
    password:String,
    sendRequest:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }], 
    Requests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],
    friendlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],

},
{timestamps:true})

module.exports=mongoose.model('users',UsersSchema)