import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['coolers', 'tables', 'chairs', 'cycles', 'books', 'electronics', 'mattresses', 'buckets', 'study lamps', 'extension boards', 'others']
    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    hostelBlock: {
        type: String,
        required: true
    },
    sellerYear: {
        type: String,
        required: true,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni']
    },
    contactNumber: {
        type: String,
        required: true
    },
    negotiable: {
        type: Boolean,
        default: false
    },
    isSold: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const productModel = mongoose.model('product', productSchema);

export default productModel;