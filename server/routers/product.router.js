import { Router } from "express";
import { createNewProduct, createProductreview, deleteProduct, deleteProductReview, getAllProduct ,getProductReviews,updateProduct} from "../controllers/product.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizesRoles } from "../middlewares/adminAuth.js";

const productRouter = Router();

productRouter.get("/product",getAllProduct);
productRouter.route("/product/new").post(verifyJwt,authorizesRoles("admin"),createNewProduct);
productRouter.put("/product/update/:id",verifyJwt,authorizesRoles("admin"),updateProduct);
productRouter.delete("/product/review/",verifyJwt,deleteProductReview);
productRouter.delete("/product/:id",verifyJwt,authorizesRoles("admin"),deleteProduct);
productRouter.put("/product/review",verifyJwt,createProductreview);
productRouter.get("/product/review/:productId",getProductReviews);


export default productRouter;
