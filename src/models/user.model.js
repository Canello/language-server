const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        freeTrials: { type: Number, default: 7 },
        expirationDate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.isActive = new Date(ret.expirationDate) > new Date();
                delete ret.password;
                delete ret.__v;
            },
        },
        virtuals: {
            isActive: {
                get() {
                    return new Date(this.expirationDate) > new Date();
                },
            },
        },
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
