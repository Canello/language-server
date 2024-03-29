import axios from "axios";
import { TRANSCRIPTION_PROMPT } from "../utils/constants";

export default class OpenAI {
    static async transcript(filename: string, file: any, temperature = 0) {
        const formData = new FormData();
        formData.append("file", new Blob([file]), filename);
        formData.append("model", process.env.TRANSCRIPTION_MODEL!);
        formData.append("temperature", String(temperature));
        formData.append("prompt", TRANSCRIPTION_PROMPT);

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

    static async chat(
        messages: Array<{ role: string; content: string }>,
        temperature = 0
    ) {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: process.env.CHAT_MODEL,
                messages,
                temperature,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
                },
            }
        );
        const reply = response.data.choices[0].message.content;
        const { prompt_tokens, completion_tokens, total_tokens } =
            response.data.usage;

        return {
            reply,
            promptTokens: prompt_tokens,
            completionTokens: completion_tokens,
            totalTokens: total_tokens,
        };
    }
}
