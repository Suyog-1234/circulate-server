import { Schema, model } from "mongoose";
import { Plan, UserInput } from "../types/schema";

const UserSchema = new Schema({
     name:{type:String,required:true},
     email:{type:String,requiredd:true,uniqu:true,trim:true},
     password:{type:String,required:true},
     plan:{type:String,enum: [Plan.FREE,Plan.PRO],default:Plan.FREE}
},{timestamps:true})

const User = model<UserInput>("User",UserSchema)

export default User