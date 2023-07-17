const { SYSTEM_PROMPT, USER_PROMPT_COMPLEMENT } = require("../constants");

class MessagesProcessor {
    static process(messages) {
        this.#addSystemPromptInFirstPosition(messages);
        this.#complementUserPrompt(messages);
    }

    static #addSystemPromptInFirstPosition(messages) {
        messages.unshift({ role: "system", content: SYSTEM_PROMPT });
    }

    static #complementUserPrompt(messages) {
        const lastUserMessage = messages[messages.length - 1];

        lastUserMessage.content =
            USER_PROMPT_COMPLEMENT +
            `MY MESSAGE (DELIMITED BY \`\`\`):
\`\`\`
${lastUserMessage.content}
\`\`\``;
    }
}

module.exports = { MessagesProcessor };
