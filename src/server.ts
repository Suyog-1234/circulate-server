import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import userAuthRoutes  from "../src/routes/user/auth.routes"
import userFileRoutes  from "../src/routes/user/file.routes"
import cors from "cors";
import { db } from "./config/db";
dotenv.config()

//db
db()

//app initilization
const app = express()

//default middlewares
app.use(express.json())
app.use(cookieParser());

app.use(cors({credentials: true, origin: 'http://localhost:3000'})) 
//managing routes
app.use("/api/user/auth",userAuthRoutes)
app.use("/api/user/file",userFileRoutes)
// server listen
const PORT = process.env.PORT
app.listen(PORT,()=>{
     console.log(`App Running at port ${PORT}`)
})