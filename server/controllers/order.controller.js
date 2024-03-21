import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// CREATE ORDER

const createNewOrder = asyncHandler(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        taxPrice,
        shippingPrice,
        itemsPrice,
        totalPrice,

    } = req.body;

    const order = new Order({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxPrice,
        shippingPrice,
        itemsPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user?._id,
    });


    const createdOrder = await order.save();
    console.log("yha", createdOrder)
    if (!createdOrder)
        throw new ApiError(500, "Something went wrong");

    res.status(201).json(new ApiResponse(200, createdOrder, "successfully created"));

});

//   SINGLE ORDER 

const getSingleOrder = asyncHandler(async (req, res, next) => {

    const order = await Order.findById(req.params?.id).populate(
        "user",  // it fetches the user id in Order docs and populate name and email of user
        "name email"
    );

    if (!order) {
        throw new ApiError(500, "Something went wrong");
    }
    res.status(200).json(new ApiResponse(200, order, "successfully fetched"));

});

//   LOGGED USER'S ALL ORDER 
const getUserAllOrders = asyncHandler(async (req, res, next) => {

    const orders = await Order.find({ user: req.user?._id })

    if (!orders) {
        throw new ApiError(500, "Something went wrong");
    }
    res.status(200).json(new ApiResponse(200, orders, "successfully fetched"));

});


// GET ALL ORDERS FOR ADMIN
const getAllOrders = asyncHandler(async (req, res, next) => {

    const orders = await Order.find({})
    let totalAmount = 0;
    if (!orders) {
        throw new ApiError(500, "Something went wrong");
    }

    orders.forEach((amt) => totalAmount += amt.totalPrice);
    
    res.status(200).json(new ApiResponse(200,{totalAmount, orders}, "successfully fetched"));

});


// UPDATE  ORDERS STATUS FOR ADMIN
const updateOrderstatus = asyncHandler(async (req, res, next) => {

    const order = await Order.findById(req.params?.id);

    if (!order) {
        throw new ApiError(404, "No Product Found");
    }

    if (order.orderStatus === "Delivered")
        return res.status(201).json(new ApiResponse(400, "You Have Already Delievered this order"));

    order.orderItems.forEach(async (item) => await updateStock(order.product, order.quantity))

    order.orderStatus = req.body?.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validatBeforeSave: false });

    res.status(200).json(new ApiResponse(200, order, "successfully fetched"));

});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });

}


// DELETE ORDER FOR THE ADMIN
const deleteOrder = asyncHandler(async (req, res, next) => {
    const order =await Order.findById(req.params?.id);
    if (!order) {
        throw new ApiError(500, "Something went wrong");
    }
    await order.remove();
    
    res.status(200).json(new ApiResponse(200, "successfully Deleted"));

});


export {
    createNewOrder,
    getSingleOrder,
    getUserAllOrders,
    getAllOrders,
    updateOrderstatus,
    deleteOrder
}