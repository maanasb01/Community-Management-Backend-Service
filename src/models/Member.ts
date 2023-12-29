import mongoose, {InferSchemaType, Schema} from "mongoose";


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
    
    export type MemberType = InferSchemaType<typeof memberSchema>  
    export const Member = mongoose.model<MemberType>('member',memberSchema)
