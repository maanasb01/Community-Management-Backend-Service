import mongoose, {Schema} from "mongoose";


    const roleSchema = new Schema({
        id:{
            type:String,
            required:true,
            unique:true
        },
        name:{
            type: String,
            maxlength:64,
            unique:true,
            required:true
        }
    },
    {timestamps:true});
    
    export const Role = mongoose.model('role',roleSchema)
