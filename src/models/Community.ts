import mongoose, {InferSchemaType, Schema} from "mongoose";

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

export type CommunityType = InferSchemaType<typeof communitySchema>    

export const Community = mongoose.model<CommunityType>("community",communitySchema);