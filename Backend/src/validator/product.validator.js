import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation error", errors: errors.array() });
    }

    next();
}

export const createProductValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price amount must be a number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("hostelBlock").notEmpty().withMessage("Hostel block is required"),
    body("sellerYear").notEmpty().withMessage("Seller year is required"),
    body("contactNumber").notEmpty().withMessage("Contact number is required"),
    validateRequest
]