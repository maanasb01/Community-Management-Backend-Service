import mongoose, {InferSchemaType, Schema} from "mongoose";


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

export type RoleType = InferSchemaType<typeof roleSchema>    
export const Role = mongoose.model<RoleType>('role',roleSchema)
