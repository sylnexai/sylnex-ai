export default async function handler(req, res) {
  try {
    const { topic, platform, language, contentType } = req.body;

    const prompt = `
Create ${contentType} for ${platform}.
Topic: ${topic}
Language: ${language}

Important:
- Write ONLY in ${language}
- Make it viral and engaging
- Add short hashtags
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
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
