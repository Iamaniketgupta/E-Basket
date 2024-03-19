import "dotenv/config";
import { app } from "./app.js";
import { dbConnect } from "./database/dbConnect.js";

process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the Server");
    process.exit(1);
});

dbConnect().then(() =>
    app.listen(process.env.PORT || 8000, () => console.log("listening"))
);


process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the Server");
    process.exit(1);
});