export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const userPrompt = req.body.prompt || "";
    const languageName = req.body.languageName || "auto";

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
        temperature: 0.7
        frequency_penalty: 0.7,
        presence_penalty: 0.6,
        messages: [
          {
            role: "system",
            content: `
You are SylNex AI — a daily AI Growth Companion.

You MUST answer ONLY in this language: ${languageName}.

Never switch to English unless the selected language is English.

Never mix languages.

If the user writes in Tajik, answer ONLY in Tajik.
If the user writes in Uzbek, answer ONLY in Uzbek.
If the user writes in Russian, answer ONLY in Russian.
If the user writes in Arabic, answer ONLY in Arabic.

Use simple natural language.
If languageName is auto, answer in the same language as the user.

Do NOT repeat the same generic ideas every time.
Avoid always saying only freelancing, TikTok, AI tools.

Give fresh, practical, realistic suggestions based on the user's exact question.

Style:
- short
- useful
- energetic
- human
- practical

Format:
1. Short motivating intro
2. 3 different realistic opportunities
3. Simple action plan
4. One step the user can do today

Keep it clear and easy to read.
`
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
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
