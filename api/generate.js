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
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Ты топовый AI-эксперт по вирусному контенту для TikTok, Instagram Reels и YouTube Shorts.

Создай 10 мощных вирусных идей.

Для каждой идеи дай:
1. Viral Hook
2. Короткий сценарий
3. CTA
4. Трендовые хештеги

Стиль: дерзкий, дорогой, мотивирующий, futuristic, luxury, viral.
Пиши красиво, с эмодзи и сильной энергией.`
          },
          {
            role: "user",
            content: topic
          }
        ],
        temperature: 0.8,
        max_tokens: 1200
      }),
    });

    const data = await response.json();

    const content =
      data?.choices?.[0]?.message?.content ||
      "AI не смог сгенерировать ответ";

    res.status(200).json({
      title: "🔥 10 Viral Content Ideas",
      body: content,
      hashtags: ["#AI", "#Content", "#TikTok"]
    });

  } catch (error) {
  res.status(500).json({
    error: error.message
  });
}
