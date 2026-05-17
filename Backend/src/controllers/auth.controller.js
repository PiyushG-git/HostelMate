import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
import BlacklistedToken from "../models/blacklistedToken.model.js";


async function sendTokenResponse(user, res, message) {

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token)

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
        }
    })

}


export const register = async (req, res) => {
    const { email, contact, password, fullname } = req.body;

    try {
        const existingUser = await userModel.findOne({
            $or: [
                { email },
                ...(contact ? [{ contact }] : [])
            ]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or contact already exists" });
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
        })

        await sendTokenResponse(user, res, "User registered successfully")

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    await sendTokenResponse(user, res, "User logged in successfully")
}

export const googleCallback = async (req, res) => {
    const { id, displayName, emails } = req.user
    const email = emails[ 0 ].value;

    let user = await userModel.findOne({ email })

    if (!user) {
        user = await userModel.create({
            email,
            googleId: id,
            fullname: displayName,
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token)
    res.redirect("http://localhost:5173/")
}

export const getMe = async (req, res) => {
    const user = req.user;

    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            watchlist: user.watchlist || []
        }
    })
}

export const logout = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No active session" });
    }

    try {
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);

        await BlacklistedToken.create({ token, expiresAt });

        res.clearCookie("token", { httpOnly: true, sameSite: "lax" });

        return res.status(200).json({ message: "Logged out successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error during logout" });
    }
}

// ── Watchlist ──────────────────────────────────────────────

export const addToWatchlist = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const user = await userModel.findById(userId);
        if (user.watchlist.includes(productId)) {
            return res.status(400).json({ success: false, message: "Already in watchlist" });
        }

        user.watchlist.push(productId);
        await user.save();

        await user.populate('watchlist');

        return res.status(200).json({ success: true, message: "Added to watchlist", watchlist: user.watchlist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export const removeFromWatchlist = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        const user = await userModel.findById(userId);
        user.watchlist = user.watchlist.filter(id => id.toString() !== productId);
        await user.save();

        await user.populate('watchlist');

        return res.status(200).json({ success: true, message: "Removed from watchlist", watchlist: user.watchlist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export const getWatchlist = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await userModel.findById(userId).populate('watchlist');
        return res.status(200).json({ success: true, watchlist: user.watchlist });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}