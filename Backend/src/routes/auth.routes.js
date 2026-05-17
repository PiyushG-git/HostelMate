import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import { getMe, googleCallback, login, logout, register, addToWatchlist, removeFromWatchlist, getWatchlist } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', validateRegisterUser, register)

router.post("/login", validateLoginUser, login)

// Google OAuth
router.get("/google",
    passport.authenticate("google", { scope: [ "profile", "email" ] }))

router.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
    }),
    googleCallback,
)

/** @route GET /api/auth/me — Get authenticated user profile (Private) */
router.get('/me', authenticateUser, getMe)

/** @route POST /api/auth/logout — Logout (Private) */
router.post('/logout', authenticateUser, logout)

/** @route GET /api/auth/watchlist — Get user's watchlist (Private) */
router.get('/watchlist', authenticateUser, getWatchlist)

/** @route POST /api/auth/watchlist/:productId — Add to watchlist (Private) */
router.post('/watchlist/:productId', authenticateUser, addToWatchlist)

/** @route DELETE /api/auth/watchlist/:productId — Remove from watchlist (Private) */
router.delete('/watchlist/:productId', authenticateUser, removeFromWatchlist)

export default router;