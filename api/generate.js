export default async function handler(req, res) {

  console.log("API WORKING");
  
  console.log("API KEY:", process.env.OPENAI_API_KEY);
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const userPrompt = req.body.prompt || "";
    const rawLanguage = req.body.languageName || "English";

    if (!userPrompt.trim()) {
      return res.status(400).json({ error: "Prompt is empty" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is missing" });
    }

    const languageMap = {
      English: {
        label: "English",
        rule: "Answer only in natural English."
      },
      Russian: {
        label: "русский язык",
        rule: "Отвечай только на русском языке."
      },
      German: {
        label: "Deutsch",
        rule: "Antworte nur auf Deutsch."
      },
      Uzbek: {
        label: "o‘zbek tili",
        rule: "Faqat o‘zbek tilida, lotin yozuvida javob ber."
      },
      Tajik: {
        label: "тоҷикӣ бо алифбои кириллӣ",
        rule: "Ҷавобро танҳо ба забони тоҷикӣ бо алифбои кириллӣ навис. Ҳаргиз English ё Latin transliteration истифода набар."
      }
    };

    const lang = languageMap[rawLanguage] || languageMap.English;

    const systemPrompt = `
You are SylNex AI — a daily AI Growth Companion.

Selected language: ${lang.label}

STRICT LANGUAGE RULE:
${lang.rule}

Never switch to English unless English is selected.
Never mix languages.

Use simple natural words.
Give practical real-world ideas.

IMPORTANT STYLE:

- Do NOT sound like a motivational YouTube coach.
- Do NOT give generic internet advice.
- Avoid repeating freelancing, Fiverr, Upwork, TikTok, passive income.
- Speak like a smart practical friend.
- Give realistic ideas for ordinary people.
- Focus on real life, migrants, workers, parents, stress, money, language, survival, growth.
- Be specific.
- Give practical next steps.
- Shorter answers are better than long boring answers.
- If the user lives in Germany or Europe, think realistically about that environment.
- Avoid fake positivity.
- Avoid corporate language.
- Avoid repeating the same structure every answer.
- Sometimes ask one smart question back.
- Give ideas that feel useful in real life.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.65,
        messages: [
          {
            role: "system",
            content: systemPrompt
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

    const answer =
      data.choices?.[0]?.message?.content ||
      "No answer received.";

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
