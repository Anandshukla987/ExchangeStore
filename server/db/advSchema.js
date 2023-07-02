const mongoose = require('mongoose');

const advSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    AdvPhoto:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    user_id:{
        type:String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    time:{
        type:Number
    },
    username:{
        type:String,
        default:null,
        required:false
    }
})

const Advertise=mongoose.model('advertise',advSchema);

module.exports=Advertise;