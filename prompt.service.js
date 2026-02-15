function generatePrompt(userMessage, scanData = '') {
    return `Use the following website info: ${scanData}\nRespond to user query: ${userMessage}`;
}

module.exports = { generatePrompt };
