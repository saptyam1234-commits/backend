const OpenAI = require("openai");

async function getChatResponse(message) {

    // ✅ Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
        console.error("❌ OPENAI_API_KEY is missing");
        return "AI service not configured.";
    }

    try {

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7
        });

        // ✅ Safe return
        if (
            response &&
            response.choices &&
            response.choices.length > 0
        ) {
            return response.choices[0].message.content;
        } else {
            return "No response from AI.";
        }

    } catch (error) {

        console.error("🔥 OpenAI Full Error:", error);

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }

        return "Namaste 🙏 Aapka message receive ho gaya hai. Hamari team jald reply karegi.";
    }
}

module.exports = { getChatResponse };
