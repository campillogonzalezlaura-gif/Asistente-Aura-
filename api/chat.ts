import { getAIClient, SYSTEM_INSTRUCTION } from "./common";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "Missing message in request body." });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini/Google API key is not configured." });
  }

  try {
    const ai = getAIClient();

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history || [],
    });

    const result = await chat.sendMessage({ message });
    const aiText = result.text || "";

    const appointmentMatch = aiText.match(/nombre=(.+?)\|tratamiento=(.+?)\|fecha=(.+?)\|hora=(.+?)(?:\s|$)/i);

    if (appointmentMatch) {
      const [, patientName, treatment, date, time] = appointmentMatch;
      return res.json({
        text: aiText,
        appointment: {
          patientName: patientName.trim(),
          treatment: treatment.trim(),
          date: date.trim(),
          time: time.trim(),
        },
      });
    }

    return res.json({ text: aiText });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: error.message || "An error occurred during the chat." });
  }
}
