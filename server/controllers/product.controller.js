import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiFeatures } from "../utils/apiFeatures.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createNewProduct = asyncHandler(async (req, res) => {
    const { body } = req;

    const createdProduct = await Product.create(body);
    if (!createdProduct)
        res.status(500).json(new ApiError(500, "Failed to Add Product!"));

    res.status(200).json(
        new ApiResponse(200, "Created Successfully")
    );
          
        
});

const getAllProduct = asyncHandler(async (req, res) => {
    const resultPerPage =8;
    
   const apiFeature =new ApiFeatures(Product.find(),req.query)
   .searchProducts()
   .filterProducts()
   .pagination(resultPerPage)

    const products = await apiFeature;
    console.log(apiFeature)
    if (!products)
        throw new ApiError(404, "No products are there");

    res.status(200).json(new ApiResponse(200, products, "Products fetched success"));

})




const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {body} =req;
    const product = await Product.findByIdAndUpdate(id);
    product = body;
    Product.save();

    if (!product)
        throw new ApiError(500, "No product found");

    return res.status(200).json(new ApiResponse(200, product, "Updated Successfully"));
});


const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product)
        throw new ApiError(500, "Failed to Delete Product");

    return res.status(200).json(new ApiResponse(200, product, "Product Deleted successfully"));
});

export {
    createNewProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
};
