import mongoose, { Schema, model } from "mongoose";
import {FileInput, FileExistenceStatus } from "../types/schema";

const FileSchema = new Schema({
     user: { type: mongoose.Types.ObjectId, ref: "User" },
     key: { type: String, required: true, unique: true },
     transferLink:{ type: String, required: true, unique: true },
     transferName:{ type: String, required: true},
     size: { type: Number, required: true },
     type: { type: String },
     hasPassword: { type: Boolean, default: false },
     password: { type: String },
     totalSubFiles: { type: Number },
     expiryDate:{type:Date,required:true}
}, { timestamps: true })

const File = model<FileInput>("File", FileSchema)

export default File