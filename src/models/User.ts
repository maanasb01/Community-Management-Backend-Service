import mongoose, {Schema} from "mongoose";


    const userSchema = new Schema({
        id:{
            type:String,
            required:true,
            unique:true
        },
        name:{
            type: String,
            maxlength:64,
            default:null,
            required:true
        },
        email: {
            type: String,
            maxlength:128,
            required: true,
            unique: true        
        },
        password:{
            type:String,
            maxlength:64,
            required:true
        },
    },
    {timestamps:true});
    
    export const User = mongoose.model('user',userSchema)
