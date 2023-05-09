const axios = require("axios");

class OpenAI {
    static async transcript(filename, file) {
        const formData = new FormData();
        formData.append("file", new Blob([file]), filename);
        formData.append("model", "whisper-1");

        const response = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
                },
            }
        );
        const transcription = response.data.text;

        return transcription;
    }

    static async chat(messages) {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
                },
            }
        );
        const reply = response.data.choices[0].message.content;
        const tokensUsed = response.data.usage.total_tokens;

        return { reply, tokensUsed };
    }
}

module.exports = OpenAI;
