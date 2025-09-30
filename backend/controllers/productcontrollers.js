import { Product } from "../model/productModel.js";
import APIFilter from "../utils/apiFilters.js";
import {upload_file,delete_file} from "../utils/cloudinary.js"

export const getProducts = async (req, res, next) => {
   try {
    const resPerPage = 8;
    const productsCount = await Product.countDocuments();

    // Create API filter instance
    const apiFilter = new APIFilter(Product.find(), req.query);

    // Apply search and filter (without pagination yet)
    apiFilter.search().filter();

    // Get total filtered products count (without pagination)
    const filteredProductsCount = await apiFilter.query.clone().countDocuments();

    // Now apply pagination
    apiFilter.pagination(resPerPage);

    // Fetch paginated products
    const products = await apiFilter.query;

    res.status(200).json({
      success: true,
      productsCount,
      resPerPage,
      filteredProductsCount,
      products,
    });
  } catch (error) {
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};


export const newProduct = async (req, res) => {
    try {
        req.body.user = req.user._id;
        const product = await Product.create(req.body);

        res.status(201).json({ success: true, product });
    } catch (error) {
        // Handle error specifically for validation
        const statusCode = error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};


export const getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//get product by Admin ./api/Admin/products
export const getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(
            { 
            products 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updatedProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//Upload Product Image :-./api/admin/products/:id/uploadimage
export const uploadProductImages = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        const images = req.body.images;

        if (!Array.isArray(images) || images.length === 0) {
            return next(new ErrorHandler("No images provided", 400));
        }

        const urls = await Promise.all(
            images.map(async (base64) => await upload_file(base64, "utopia/productImages"))
        );

        product.images.push(...urls);
        await product.save();

        res.status(200).json({
            success: true,
            product,
        });

    } catch (error) {
        next(error);
    }
};
// Delete product image  =>  /api/v1/admin/products/:id/delete_image
export const deleteProductImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params?.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const isDeleted = await delete_file(req.body.imgId);

    if (isDeleted) {
      product.images = product.images?.filter(
        (img) => img.public_id !== req.body.imgId
      );
    }

    await product.save();

    res.status(200).json({
      product,
    });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};


export const deletedProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Create new review   =>   /api/review
export const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const isReviewed = product.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach(review => {
                if (review.user.toString() === req.user._id.toString()) {
                    review.comment = comment;
                    review.rating = rating;
                }
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        product.ratings =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while submitting the review"
        });
    }
};
// Get Product Reviews   =>   /api/reviews

export const getProductReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product reviews"
        });
    }
};

// Delete Product Review   =>   /api/reviews
export  const deleteReview = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const reviews = product.reviews.filter(
            review => review._id.toString() !== req.query.id.toString()
        );

        const numOfReviews = reviews.length;

        const ratings = reviews.length > 0
            ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
            : 0;

        await Product.findByIdAndUpdate(
            req.query.productId,
            {
                reviews,
                ratings,
                numOfReviews
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false
            }
        );

        res.status(200).json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete review"
        });
    }
};
