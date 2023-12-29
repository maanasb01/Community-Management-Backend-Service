import mongoose, { InferSchemaType, Schema } from "mongoose";

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      maxlength: 64,
      default: null,
      required: true,
    },
    email: {
      type: String,
      maxlength: 128,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      maxlength: 64,
      required: true,
    },
  },
  { timestamps: true }
);

export type UserType = InferSchemaType<typeof userSchema>

export const User = mongoose.model<UserType>("user", userSchema);
