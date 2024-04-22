import { Document, Types } from "mongoose"

export enum Plan {
    FREE = "FREE",
    PRO = "PRO"
}

export enum FileExistenceStatus {
    OPEN = "OPEN",
    LOCKED = "LOCKED",
    EXPIRIED = "EXPIRIED"
}
export interface UserInput extends Document {
    name: string,
    email: string,
    password: string,
    profileImage?: string
    plan: Plan
}

export interface FileInput extends Document {
    user: Types.ObjectId
    key: string,
    size: number,
    type: string,
    hasPassword: boolean,
    password?: string
    totalSubFiles: number
    expiryDate: Date;
}