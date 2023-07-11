const fs = require("fs");
const path = require("path");

exports.errorHandler = async (err, req, res, next) => {
    console.log(err);

    // Garantir exclusão de audio file temporária mesmo se der erro
    const audioFile = req.file;
    if (audioFile) {
        try {
            await fs.promises.unlink(
                path.join(__dirname, "..", "uploads", audioFile.filename)
            );
        } catch (err) {
            console.log("Erro ao excluir arquivo de áudio.");
            console.log(err);
        }
    }

    // Erro customizado
    if (err.isCustom) {
        return res.status(err.status).send({
            error: err.toResponseError(),
        });
    }

    // Default para erros não customizados ou não previstos
    res.status(500).send({
        error: {
            type: "default",
            message: "Alguma coisa deu errado.",
        },
    });
};
