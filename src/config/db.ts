import mongoose from "mongoose"

export const db = async ()=>{
      try {
           await mongoose.connect(process.env.DATABASE_URL as string);
          const db = mongoose.connection.db
          db.collection("files").createIndex({ expiryDate: 1 }, { expireAfterSeconds: 0 })
          console.log(`mongo connected to ${mongoose.connection.host}`)
      } catch (error) {
         console.log(error)
      }
}