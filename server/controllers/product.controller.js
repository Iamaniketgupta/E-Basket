import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiFeatures } from "../utils/apiFeatures.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


//  PRODUCT CONTROLLERS
const createNewProduct = asyncHandler(async (req, res) => {
    const { body } = req;

    const createdProduct = await Product.create({ ...body, createdBy: req.user?._id });
    if (!createdProduct)
        res.status(500).json(new ApiError(500, "Failed to Add Product!"));

    res.status(200).json(
        new ApiResponse(200, "Created Successfully")
    );


});

const getAllProduct = asyncHandler(async (req, res) => {
    const resultPerPage = 8;

    const apiFeature = new ApiFeatures(Product.find(), req.query)
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
    const { body } = req;
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



//  REVIEWS CONTROLLERS
const createProductreview = asyncHandler(async (req, res) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.fullName,
        comment: comment,
        rating: Number(rating)
    }

    const product = await Product.findById(productId);
    const isReviewd = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    if (isReviewd) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });

    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach(rev =>
        avg += rev.rating
    )
    product.rating = avg / product.reviews.length;

    const saveReview = await product.save({ validateBeforeSave: false });

    if (!saveReview)
        throw new ApiError(500, "Internal Server Error!");

    res.status(201).json(new ApiResponse(200, "Review Success"))

});


const getProductReviews = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const product = await Product.findById(productId)

    if (!product)
        throw new ApiError(404, "No Product found");

    res.status(200).json(new ApiResponse(200, "reviews Fetched Success", product.reviews));

});

const deleteProductReview = asyncHandler(async (req, res, next) => {
    console.log("hello");
    const productId = req.query?.productId;
    const reviewId = req.query?.reviewId;

    const product = await Product.findById(productId);

    if (!product)
        throw new ApiError(404, "No Product found");

    const reviewIndex = product.reviews.findIndex(review => review._id == reviewId);

    if (reviewIndex === -1)
        throw new ApiError(404, "Review not found");

    product.reviews.splice(reviewIndex, 1);

    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.rating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    product.numOfReviews = product.reviews.length;

    const savedProduct = await product.save({validateBeforeSave:false});

    if (!savedProduct)
        throw new ApiError(500, "Internal Server Error");

    res.status(200).json(new ApiResponse(200, "Review Deleted Successfully", savedProduct.reviews));
});





export {
    createNewProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,

    createProductreview,
    getProductReviews,
    deleteProductReview
};
