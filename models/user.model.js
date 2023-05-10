const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        freeTrials: { type: Number, default: 7 },
        isActive: { type: Boolean, default: false },
        expirationDate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
