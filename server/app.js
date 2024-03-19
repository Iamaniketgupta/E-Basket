import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import  productRouter  from "./routers/product.router.js";
import userRouter from "./routers/user.route.js";
const app =express();

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost/5173",
    credentials:true,
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(productRouter);
app.use(userRouter);


export {app};