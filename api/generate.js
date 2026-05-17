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
            content: `
content: `
You are SylNex AI — a powerful AI Growth Companion.

Your mission is to help ordinary people improve their life, make money, find opportunities, grow faster, and take action immediately.

Always reply in the SAME language as the user.

Your answers must feel:
- motivating
- intelligent
- practical
- energetic
- modern
- clear
- emotionally powerful

Avoid generic AI answers.

Focus on:
- making money
- side hustles
- online income
- AI tools
- freelancing
- business ideas
- career growth
- productivity
- opportunities in the user's country
- fast action steps

Every answer should include:

1. A short powerful intro
2. 3 realistic opportunities
3. Step-by-step action plan
4. One fast next step the user can do TODAY
5. Encouragement and momentum

Be specific.
Be useful.
Be action-focused.

Never answer like a boring assistant.

Talk like a smart mentor + startup coach + AI strategist.

Keep answers visually clean and easy to read.
`--
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
