const productDB = require("../models/productModels");
const ErrorHandler = require("../utils/errorHandler");
const expressAsyncHandler = require("express-async-handler");
const APIFeatures = require("../utils/apiFeatures");

/// GET get products - /api/products
const getProducts = expressAsyncHandler(async (req, res, next) => {

  let outOfStock = await productDB.find().where("stock").equals(0)
  let inStock = await productDB.find({ stock: { $gt: 0 } })

  const resPerPage = 4;

  let buildQuery = () => {
    return new APIFeatures(productDB.find(), req.query).search().filter()
  }

  const filteredProductCount = await buildQuery().query.countDocuments()
  const totalProductCount = await productDB.countDocuments()

  let productsCount = totalProductCount;

  if (filteredProductCount !== totalProductCount) {
    productsCount = filteredProductCount
  }

  const products = await buildQuery().paginate(resPerPage).query;

  let totalSearchProducts = new APIFeatures(productDB.find(), req.query).search()
  totalSearchProducts = await totalSearchProducts.query

  res.status(201).json({
    success: true,
    resPerPage,
    productsCount,
    products,
    totalSearchProducts
  });
});

/// GET get single product - /api/product/:id
const getSingleProduct = expressAsyncHandler(async (req, res, next) => {

  const product = await productDB.findById(req.params.id).populate('reviews.user', 'name avatar')
  if (!product) {
    return next(new ErrorHandler("product not found", 400));
  }
  res.status(201).json({
    success: true,
    product,
  });
});



/// PUT Update product - /api/products/:id
const updateProduct = expressAsyncHandler(async (req, res) => {
  const product = await productDB.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  const updatedproduct = await productDB.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(201).json({
    success: true,
    product: updatedproduct,
  });
});

/// DELETE Delete product - /api/products/:id
const deleteProduct = expressAsyncHandler(async (req, res) => {
  const product = await productDB.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  await productDB.findByIdAndDelete(req.params.id);

  res.status(201).json({
    success: true,
    message: "product deleted",
  });
});

////////////////////////////////////////////////////////////////////////////

//Create Review - api/review
const createReview = expressAsyncHandler(async (req, res) => {

  const { productId, rating, comment } = req.body;


  const review = {
    user: req.user.id,
    rating,
    comment
  }

  const product = await productDB.findById(productId);

  //finding user who already reviewed
  const isReviewed = product.reviews.find(review => {

    return review.user.toString() === req.user.id.toString()

  })


  //updaing the reviews
  if (isReviewed) {
    product.reviews.forEach(review => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating
      }
    })
  }
  //assining new reviews
  else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length
  }


  // find the average of the product reviews
  product.ratings = product.reviews.reduce((acc, review) => {
    return Number(review.rating) + acc;
  }, 0) / product.reviews.length;

  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

  await product.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true
  })

})

//Get Reviews - api/reviews?id={productId}
const getReview = expressAsyncHandler(async (req, res) => {
  const product = await productDB.findById(req.query.id)
  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

// Delete reviews - api/review
const deleteReview = expressAsyncHandler(async (req, res) => {
  const product = await productDB.findById(req.query.productId)

  //filtering the id which does not match the deleting review id
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString()
  })

  //number of reviews
  const numOfReviews = reviews.length

  //finding the average with filtered reviews
  let ratings = reviews.reduce((acc, review) => {

    return Number(review.rating) + acc;
  }, 0) / reviews.length

  ratings = isNaN(ratings) ? 0 : ratings;

  //save the product after delete
  await productDB.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings
  })

  res.status(200).json({
    success: true
  })


})

////////////////////////////////////////////////////////////////////////////
// ADMIN

// GET admin products - api/admin/products
const getAdminProducts = expressAsyncHandler(async (req, res, next) => {

  const products = await productDB.find()

  res.status(200).json({
    success: true,
    products
  });
});

// POST create product - /api/admin/product/new
const newProduct = expressAsyncHandler(async (req, res) => {

  let images = []

  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`
      images.push({ image: url })
    })
  }

  req.body.images = images
  req.body.user = req.user.id

  const product = await productDB.create(req.body);

  res.status(201).json({
    success: true,
    product: product,
  });
});

const getFilteredProducts = ((req, res, next) => {

  console.log("body------>", req.body)
})


module.exports = {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReview,
  deleteReview,
  getAdminProducts,
  getFilteredProducts
};
