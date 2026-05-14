export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:"Ты профессиональный AI-маркетолог и создатель вирусного контента. Ты создаёшь очень цепляющие TikTok, Instagram Reels и YouTube Shorts сценарии с мощным hook, эмоциями, вирусными триггерами, призывом к действию и трендовыми hashtags. Ответ должен быть максимально вовлекающим и выглядеть как контент топовых блогеров."
          },
          {
            role: "user",
            content: topic
          }
        ],
        temperature: 0.8
      }),
    });

    const data = await response.json();

    res.status(200).json({
      title: "AI написал пост",
      body: data.choices[0].message.content,
      hashtags: ["#AI", "#Content", "#TikTok"]
    });

  } catch (error) {
    res.status(500).json({
      error: "Ошибка генерации"
    });
  }
}
