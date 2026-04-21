import { Router } from "express";
import { validateRegisterUser,validateLoginUser } from "../validations/auth.validator.js";
import { googleCallback, login, register,getMe } from "../controllers/auth.controller.js";
import passport from "passport";
import config from "../config/config.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @routes /api/auth/register
 * @method POST
 * @description register a new user
 * @access public
 */
router.post('/register',validateRegisterUser,register);

/**
 * @routes /api/auth/login
 * @method POST
 * @description login a user
 * @access public
 */
router.post('/login',validateLoginUser,login);

/**
 * @routes /api/auth/google
 * @method GET
 * @description google login
 * @access public
 */
router.get("/google",
    passport.authenticate("google", { scope: [ "profile", "email" ] }))
/**
 * @routes /api/auth/google/callback
 * @method GET
 * @description google callback
 * @access public
 */
router.get("/google/callback",
    passport.authenticate("google", { session: false,failureRedirect: config.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login" }),
    googleCallback,
)

/**
 * @routes /api/auth/me
 * @method GET
 * @description get current user
 * @access private
 */
router.get("/me",authenticateUser,getMe);

export default router;