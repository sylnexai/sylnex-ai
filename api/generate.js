export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const userPrompt = req.body.prompt || "";

    if (!userPrompt.trim()) {
      return res.status(400).json({ error: "Prompt is empty" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are SylNex AI, a voice-first AI Growth Companion. Answer clearly, practically, and simply. Give 3 opportunities, a short action plan, and one next step. Reply in the same language as the user."
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || "OpenAI API error"
      });
    }

    const answer = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({
      result: answer,
      body: answer,
      message: answer
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
