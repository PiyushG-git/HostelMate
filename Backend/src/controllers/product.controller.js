import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
    const { title, description, price, category, hostelBlock, sellerYear, contactNumber, negotiable } = req.body;
    const seller = req.user;

    try {
        const images = await Promise.all(req.files.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
        }));

        const product = await productModel.create({
            title,
            description,
            price: Number(price),
            category,
            hostelBlock,
            sellerYear,
            contactNumber,
            negotiable: negotiable === 'true' || negotiable === true,
            images,
            sellerId: seller._id
        });

        res.status(201).json({
            message: "Ad posted successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export async function getSellerProducts(req, res) {
    const seller = req.user;
    const products = await productModel.find({ sellerId: seller._id }).sort({ createdAt: -1 });

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    });
}

export async function getAllProducts(req, res) {
    try {
        const { category, search } = req.query;
        const query = {};

        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { hostelBlock: { $regex: search, $options: 'i' } },
            ];
        }

        const products = await productModel.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export async function getProductDetails(req, res) {
    const { id } = req.params;
    const product = await productModel.findById(id).populate('sellerId', 'fullname email contact');

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        });
    }

    return res.status(200).json({
        message: "Product details fetched successfully",
        success: true,
        product
    });
}

export async function markAsSold(req, res) {
    const { id } = req.params;
    const seller = req.user;

    const product = await productModel.findOneAndUpdate(
        { _id: id, sellerId: seller._id },
        { isSold: true },
        { new: true }
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found or unauthorized",
            success: false
        });
    }

    return res.status(200).json({
        message: "Product marked as sold",
        success: true,
        product
    });
}

export async function updateProduct(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { title, description, price, hostelBlock, sellerYear, contactNumber, negotiable } = req.body;

    try {
        const product = await productModel.findOneAndUpdate(
            { _id: id, sellerId: userId },
            { title, description, price: Number(price), hostelBlock, sellerYear, contactNumber, negotiable: negotiable === 'true' || negotiable === true },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
        }

        return res.status(200).json({ success: true, message: "Listing updated", product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export async function deleteProduct(req, res) {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const product = await productModel.findOneAndDelete({ _id: id, sellerId: userId });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
        }

        return res.status(200).json({ success: true, message: "Listing deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}