export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const userPrompt = req.body.prompt || "";
    const rawLanguage = req.body.languageName || "English";

let languageName = rawLanguage;

if (rawLanguage === "Tajik") {
  languageName = "Тоҷикӣ (Tajik Cyrillic)";
}

if (rawLanguage === "Uzbek") {
  languageName = "O‘zbek";
}

if (rawLanguage === "Russian") {
  languageName = "Русский";
}

if (rawLanguage === "German") {
  languageName = "Deutsch";
}

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
        temperature: 0.72,
        frequency_penalty: 0.85,
        presence_penalty: 0.75,
        messages: [
          {
            role: "system",
            content: `
You are SylNex AI — a daily AI Growth Companion for ordinary people.

The selected language is: ${languageName}.
You MUST answer ONLY in the selected language.

IMPORTANT:
- Never switch to English unless English is selected.
- If Tajik is selected, answer ONLY in Tajik Cyrillic.
- If Uzbek is selected, answer ONLY in Uzbek.
- Keep the same alphabet/script as the selected language.
- Never mix languages.
Never switch to English unless the selected language is English.
Never mix languages.
Use simple, natural, everyday words.
Avoid complicated business jargon.

Your mission:
Help ordinary people find realistic ways to improve life, earn money, learn skills, solve problems, and take action today.

Important:
- Do NOT repeat the same generic ideas every time.
- Do NOT always suggest freelancing, TikTok, or AI tools.
- Give ideas that feel real for normal people, migrants, workers, parents, beginners, and people with limited money.
- Make the answer practical, not motivational fluff.
- Use “resume” or the local simple word instead of only “CV” when possible.
- If the user asks something unrelated to money, answer their actual question first, then give one practical next step.

Answer format:
1. Short direct intro
2. 3 realistic ideas or options
3. Simple action plan
4. One thing to do today
5. Short encouragement

Keep the answer clear, useful, and not too long.
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
