import axios from "axios";

const apiKey = import.meta.env.GEMINI_API_KEY;

export const getCropSuggestion = async (prompt) => {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.data.candidates[0]?.content?.parts[0]?.text;
};

export default getCropSuggestion;
