import { Router } from "express";
import { createNewOrder, deleteOrder, getAllOrders, getSingleOrder, getUserAllOrders, updateOrderstatus } from "../controllers/order.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizesRoles } from "../middlewares/adminAuth.js";


const orderRouter =Router();

orderRouter.post("/order/new",verifyJwt,createNewOrder);
orderRouter.get("/myorders",verifyJwt,getUserAllOrders);
orderRouter.get("/order/:id",verifyJwt,getSingleOrder);

// Admin Routes
orderRouter.get("/admin/orders",verifyJwt,authorizesRoles("admin"),getAllOrders);
orderRouter.delete("/admin/order/:id",verifyJwt,authorizesRoles("admin"),deleteOrder);
orderRouter.put("/admin/order/:id",verifyJwt,authorizesRoles("admin"),updateOrderstatus);


 

export {orderRouter}; 