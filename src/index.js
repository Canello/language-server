const mongoose = require("mongoose");
require("dotenv").config();
const { app } = require("./app");

const start = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.u6ck6wo.mongodb.net/?retryWrites=true&w=majority`
        );

        console.log(
            "MongoDB is",
            mongoose.STATES[mongoose.connection.readyState]
        );
    } catch (err) {
        console.log(err);
    }

    app.listen(process.env.PORT, async () => {
        console.log("Listening on port", process.env.PORT);
    });
};

start();
