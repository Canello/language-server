const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        freeTrials: { type: Number, default: 7 },
        expiresAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.isActive = new Date(ret.expiresAt) > new Date();
                delete ret.password;
                delete ret.__v;
            },
        },
        virtuals: {
            isActive: {
                get() {
                    return new Date(this.expiresAt) > new Date();
                },
            },
            subscribedAt: {
                get() {
                    let subscribedAt = new Date(this.expiresAt);
                    subscribedAt.setMonth(subscribedAt.getMonth() - 1);
                    return subscribedAt;
                },
            },
        },
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
