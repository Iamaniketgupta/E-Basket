import { Router } from "express";
import { createNewProduct, deleteProduct, getAllProduct ,updateProduct} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/product",getAllProduct);
productRouter.post("/product/new",createNewProduct);
productRouter.put("/product/update/:id",updateProduct);
productRouter.delete("/product/:id",deleteProduct);

export default productRouter;
