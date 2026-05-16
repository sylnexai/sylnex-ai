const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export default async function handler(req, res) {
  try {
    const { topic, platform, language, contentType } = req.body;

    const prompt = `
You are a multilingual AI content creator.

The user topic may be in ANY language.

IMPORTANT:
You MUST ALWAYS answer ONLY in ${language}.
Even if the topic is written in English or another language.

Platform: ${platform}
Content Type: ${contentType}

Topic:
${topic}
Mode:
${req.body.mode || "viral"}
Rules:
- Response language = ${language}
- No English words
- No translations
- Viral style
- Add hashtags
`;

    console.log("LANGUAGE:", language);
console.log("PROMPT:", prompt);
    
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
         model: "gpt-4.1-mini",
          temperature: 0.3,
          messages: [
  {
    role: "system",
    content: `You must answer ONLY in ${language}. Never answer in English unless selected language is English.`,
  },
  {
    role: "user",
    content: prompt,
  },
],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        error: data.error?.message || "OpenAI response error",
      });
    }

    res.status(200).json({
      title: `🔥 ${contentType} for ${platform}`,
      body: data.choices[0].message.content,
      hashtags: ["#viral", "#ai", "#content"],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

// force redeploy
// redeploy 2
