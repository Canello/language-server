const fs = require("fs");
const path = require("path");

exports.errorHandler = (err, req, res, next) => {
    console.log(err);

    // Garantir exclusão de audio file temporária mesmo se der erro
    const audioFile = req.file;
    if (audioFile) {
        fs.unlink(
            path.join(__dirname, "..", "uploads", audioFile.filename),
            (err) => {
                if (err) console.log(err);
            }
        );
    }

    // Erro customizado
    if (err.isCustom) {
        return res.status(err.status).send({
            error: err.toResponseError(),
        });
    }

    // Default para erros não customizados ou não previstos
    res.status(400).send({
        error: {
            type: "default",
            message: "Alguma coisa deu errado.",
        },
    });
};
