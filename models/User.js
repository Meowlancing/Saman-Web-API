const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        max:20,
        min:3,
    },
    role:{
        type:String,
        required:true
    },
    email:{
        type:STring,
        required:true,
        max:50,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        min:6,
    },
    shopPicture:{
        type:String,
        default:""
    }
})