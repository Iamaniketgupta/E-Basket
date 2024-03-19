import mongoose from "mongoose";
const MONGO_DB_URI = process.env.MONGO_DB_URI;
const DB_NAME = process.env.DB_NAME;
const dbConnect = async () => {
    try {
       await mongoose.connect(MONGO_DB_URI + DB_NAME)
        .then(()=>console.log("DB Connected"))
        .catch(()=>console.log("DB Connection Failed"))
    } catch (error) {
        console.log(error)
    }
}

export {dbConnect}