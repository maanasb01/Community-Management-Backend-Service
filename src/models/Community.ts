import mongoose, {Schema} from "mongoose";
import { User } from "./User";

const communitySchema = new Schema({
    id:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        maxlength:128,
        required:true
    },
    slug:{
        type:String,
        maxlength:255,
        required:true,
        unique:true,
    },
    owner:{
        type:String,
        ref:"user.id",
        required:true

    }
},{timestamps:true})

export const Community = mongoose.model("community",communitySchema);