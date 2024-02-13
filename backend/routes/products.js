const express = require("express");
const router = express.Router();
const { isAuthenticateUser, authorisedRole } = require('../middleware/authenticate');
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct, createReview, getReview, deleteReview, getAdminProducts,
  getFilteredProducts
} = require("../controllers/productsControllers");

const path = require('path')
const multer = require('multer')

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'uploads/product'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

})

router.get("/products", getProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", updateProduct);
router.put("/filterProduct", getFilteredProducts);

//reviews
router.put('/review', isAuthenticateUser, createReview)
router.get('/reviews', getReview)
router.delete('/review', deleteReview)


//Admin 
router.post("/admin/product/new", isAuthenticateUser, authorisedRole('admin'), upload.array('images'), newProduct);
router.get("/admin/products", isAuthenticateUser, authorisedRole('admin'), getAdminProducts);
router.delete("/admin/product/:id", isAuthenticateUser, authorisedRole('admin'), deleteProduct);



module.exports = router;
