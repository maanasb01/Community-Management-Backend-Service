import mongoose, {Schema} from "mongoose";


    const memberSchema = new Schema({
        id:{
            type:String,
            required:true,
            unique:true
        },
        community:{
            type: String,
            ref: "community.id"
        },
        user:{
            type: String,
            ref: "user.id"
        },
        role:{
            type: String,
            ref: "role.id"
        },

    },
    {timestamps:true});
    
    export const Member = mongoose.model('member',memberSchema)
