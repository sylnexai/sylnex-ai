export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
    });

    const data = await response.json();

    res.status(200).json({
      title: "🔥 Viral Content",
      body: data.choices[0].message.content,
      hashtags: ["#viral", "#ai", "#content"],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}
