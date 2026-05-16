const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export default async function handler(req, res) {
  try {
    const { topic, platform, language, contentType } = req.body;

 const prompt = `
You are SylNex AI, a highly intelligent modern AI assistant.

Your goals:
- Give practical, smart, modern, realistic answers.
- Avoid generic or low-quality advice.
- Never give lazy tips like "sell old stuff" unless truly relevant.
- Think like a successful entrepreneur, AI strategist, marketer, creator and business consultant.
- Adapt automatically to the user's language.
- Give useful, actionable and modern responses.
- Focus on real-world value, speed, monetization, creativity and leverage.
- Make responses engaging, clean and premium quality.
- If the user asks about money, business or content creation:
  - prioritize scalable online opportunities
  - AI tools
  - automation
  - social media
  - digital business
  - freelancing
  - content creation
  - modern trends
- Give structured answers.
- Be concise but valuable.
- Sound like a premium AI advisor.

User request:
${prompt}
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
