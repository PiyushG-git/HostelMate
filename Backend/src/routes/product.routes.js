import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { createProduct, getAllProducts, getSellerProducts, getProductDetails, markAsSold, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import multer from "multer";
import { createProductValidator } from '../validator/product.validator.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

const router = express.Router();

/** @route POST /api/products — Create listing (Private) */
router.post("/", authenticateUser, upload.array('images', 7), createProductValidator, createProduct);

/** @route GET /api/products/seller — Get my listings (Private) */
router.get("/seller", authenticateUser, getSellerProducts);

/** @route GET /api/products — Browse all listings with optional ?category= & ?search= (Public) */
router.get("/", getAllProducts);

/** @route GET /api/products/detail/:id — Get single listing (Public) */
router.get("/detail/:id", getProductDetails);

/** @route PATCH /api/products/:id/sold — Mark as sold (Private, Owner) */
router.patch("/:id/sold", authenticateUser, markAsSold);

/** @route PUT /api/products/:id — Edit listing (Private, Owner) */
router.put("/:id", authenticateUser, updateProduct);

/** @route DELETE /api/products/:id — Delete listing (Private, Owner) */
router.delete("/:id", authenticateUser, deleteProduct);

export default router;