export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const userPrompt = req.body.prompt || "";

    if (!userPrompt.trim()) {
      return res.status(400).json({ error: "Prompt is empty" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is missing" });
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
            content: `
You are SylNex AI — an AI Growth Companion.

Help ordinary people:
- find opportunities
- make money
- improve life
- grow faster
- take action today

Always reply in the language requested by the user prompt.

Your answers must be:
- short
- practical
- motivating
- clear
- action-focused

Every answer should include:
1. A short motivating intro
2. 3 realistic opportunities
3. A simple action plan
4. One next step for today

Avoid long boring answers.
Be useful and direct.
`
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

    const answer = data.choices?.[0]?.message?.content || "No answer received.";

    return res.status(200).json({
      result: answer,
      text: answer,
      message: answer
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
