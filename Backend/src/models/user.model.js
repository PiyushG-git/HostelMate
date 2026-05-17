import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: false },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    fullname: { type: String, required: true },
    googleId: {
        type: String,
    },
    watchlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        }
    ]
}, { timestamps: true })

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


const userModel = mongoose.model('user', userSchema);

export default userModel;