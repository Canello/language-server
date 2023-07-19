import { SYSTEM_PROMPT, USER_PROMPT_COMPLEMENT } from "../constants";

export class MessagesProcessor {
    static process(messages: Array<{ role: string; content: string }>) {
        this.#addSystemPromptInFirstPosition(messages);
        this.#complementUserPrompt(messages);
    }

    static #addSystemPromptInFirstPosition(
        messages: Array<{ role: string; content: string }>
    ) {
        messages.unshift({ role: "system", content: SYSTEM_PROMPT });
    }

    static #complementUserPrompt(
        messages: Array<{ role: string; content: string }>
    ) {
        const lastUserMessage = messages[messages.length - 1];

        lastUserMessage.content =
            USER_PROMPT_COMPLEMENT +
            `MY MESSAGE (DELIMITED BY \`\`\`):
\`\`\`
${lastUserMessage.content}
\`\`\``;
    }
}
