const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeClassroomImage(base64Image) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    total_students: { type: "integer" },
                    happy: { type: "integer" },
                    neutral: { type: "integer" },
                    bored: { type: "integer" },
                    sad: { type: "integer" },
                    angry: { type: "integer" },
                    surprised: { type: "integer" }
                },
                required: ["total_students", "happy", "neutral", "bored", "sad", "angry", "surprised"]
            }
        }
    });

    const prompt = "Analyze this classroom image. Count the total number of students. Detect the facial expression of each student and provide a count for the following emotions: happy, neutral, bored, sad, angry, and surprised. Ensure the sum of these emotions equals the total number of students.";

    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") if it exists
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
        inlineData: {
            data: cleanBase64,
            mimeType: "image/jpeg"
        }
    };

    const result = await model.generateContent([prompt, imagePart]);
    return JSON.parse(result.response.text());
}

module.exports = { analyzeClassroomImage };