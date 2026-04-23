import { body, validationResult } from "express-validator";


function validateRequest(req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();

}

export const validateProduct=[
    body("name")
        .notEmpty().withMessage("Product name is required")
        .isLength({min:3}).withMessage("Product name must be at least 3 characters long"),
    body("description")
        .notEmpty().withMessage("Product description is required")
        .isLength({min:10}).withMessage("Product description must be at least 10 characters long"),
    body("amount")
        .notEmpty().withMessage("Product price is required")
        .isNumeric().withMessage("Product price must be a number"),
    body("currency")
        .notEmpty().withMessage("Currency is required")
        .isIn(["INR","USD","EUR","GBR","JPY"]).withMessage("Invalid currency"),
    body().custom((value, { req }) => {
        if (!req.files || req.files.length === 0) {
            throw new Error("Product images are required");
        }
        return true;
    }),
    body("category")
        .notEmpty().withMessage("Category is required")
        .isIn(["Jeans","Shorts","T-Shirts","Shoes","Tracksuit","Others"]).withMessage("Invalid category"),
    body("stock")
        .notEmpty().withMessage("Stock is required")
        .isNumeric().withMessage("Stock must be a number"),
    body("attributes")
        .notEmpty().withMessage("Attributes are required")
        .custom((value) => {
            try {
            const parsed = typeof value === "string" ? JSON.parse(value) : value;

            if (typeof parsed !== "object" || Array.isArray(parsed)) {
                throw new Error();
            }

            return true;
            } catch {
            throw new Error("Attributes must be a valid JSON object");
            }
    }),
    validateRequest
];

export const validateAddVariant = [
    body("amount")
        .notEmpty().withMessage("Price is required"),
    body("currency")
        .notEmpty().withMessage("Currency is required")
        .isIn(["INR","USD","EUR","GBR","JPY"]).withMessage("Invalid currency"),
    body("stock")
        .notEmpty().withMessage("Stock is required")
        .isNumeric().withMessage("Stock must be a number"),
    body("attributes").custom((value, { req }) => {
        if (!req.body.attributes || req.body.attributes.length === 0) {
            throw new Error("Attributes are required");
        }
        return true;
    }),
    body().custom((value, { req }) => {
        if (!req.files || req.files.length === 0) {
            throw new Error("Images are required");
        }
        return true;
    }),
    validateRequest
];