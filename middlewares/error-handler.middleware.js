const fs = require("fs");
const path = require("path");

exports.errorHandler = (err, req, res, next) => {
    console.log(err);

    const audioFile = req.file;
    if (audioFile) {
        fs.unlink(
            path.join(__dirname, "..", "uploads", audioFile.filename),
            (err) => {
                if (err) console.log(err);
            }
        );
    }

    res.status(400).send({
        error: {
            message: "Something went wrong",
        },
    });
};
