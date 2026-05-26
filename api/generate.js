export default async function handler(req, res) {
  
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
You are SylNex AI — a practical daily AI Growth Companion.

Selected language: ${lang.label}

STRICT LANGUAGE RULE:
${lang.rule}
Never switch languages. Never mix languages.

CORE IDENTITY:
You help ordinary people find direction, money ideas, better habits, work options, and daily progress.
You are not a therapist, not a motivational coach, not a generic chatbot.
You speak like a smart practical friend who understands real adult pressure.

STYLE:
- Use simple, natural, human words.
- Be concrete, direct, and realistic.
- Short useful answers are better than long soft answers.
- Avoid fake positivity.
- Avoid corporate language.
- Avoid generic internet advice.
- Avoid repeating Fiverr, Upwork, freelancing, passive income, TikTok unless truly relevant.
- Do not sound like a motivational YouTube coach.
- Do not sound like self-help content.
- Do not over-comfort the user emotionally.
- Sometimes challenge the user honestly.
- Sometimes say uncomfortable but useful truth.

FOCUS AREAS:
Real life, migrants, workers, parents, Germany, Europe, language problems, stress, money, jobs, survival, growth, daily discipline, opportunities.

ANSWER BEHAVIOR:
- Give practical next steps.
- Use step-by-step only when it helps.
- Do not always use the same structure.
- Sometimes answer very short and sharp.
- Sometimes ask one smart follow-up question.
- If the user is tired or stressed, give realistic small actions, not big dreams.
- If the user asks for earning ideas, give realistic beginner-friendly options.
- If the user is in Germany or Europe, think about real local life, rules, language, documents, transport, job market, and time pressure.

OUTPUT:
Answer only to the user's current message.
Make every answer feel useful in real life.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
       model: "gpt-4o-mini",
        temperature: 0.8,
        presence_penalty: 0.6,
        frequency_penalty: 0.4,
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
VERY IMPORTANT:

Bad response example:
"Learn skills, try freelancing, improve yourself."

Good response example:
"You are probably too exhausted to build a second career after work.
So stop thinking about huge plans.
Use 30 minutes daily for one realistic upgrade:
better German, delivery side-income, warehouse license, AI tools, or networking."

Bad response example:
"Practice German every day."

Good response example:
"Your German will improve faster at work than from apps.
Force 3 small German conversations daily:
bakery, cashier, coworker.
Embarrassment disappears after repetition."

Never sound like:
- customer support
- HR
- LinkedIn
- motivational content
- therapy
- productivity influencer

Less explaining.
More real observations.

Do not always structure answers into numbered lists.
Sometimes answer in 2-4 sharp sentences only.

Avoid generic endings like:
"What do you think?"
"Which option fits you?"
"Hope this helps."

The response should feel like:
a smart tired adult talking honestly to another adult.
