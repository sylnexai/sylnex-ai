import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
   const { topic, platform, language, contentType } = req.body;

   const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Создай вирусный TikTok контент на тему: ${topic}`
      }
    ],
    temperature: 0.9
  })
});
        input: `Создай 10 вирусных идей для ${platform} на тему: ${topic}.
        Отвечай только на языке ${language}.

Если платформа TikTok:
— делай максимально вирусный стиль
— короткие хуки
— тренды
— челленджи
— удержание внимания

Если платформа Instagram Reels:
— эстетичный стиль
— вовлечение
— lifestyle
— эмоциональные триггеры

Если платформа YouTube Shorts:
— сильные заголовки
— образовательный стиль
— удержание зрителя
— быстрый темп

Пиши современно и профессионально.`
      })
    });

    const data = await response.json();

      const content =
  data.output?.[0]?.content?.[0]?.text ||
  "AI не смог сгенерировать ответ";

    await db.collection("generations").add({
  topic,
  platform,
  language,
  contentType,
  result: content,
  createdAt: new Date(),
});

    return res.status(200).json({
      title: "🔥 10 Viral Content Ideas",
      body: content,
      hashtags: ["#AI", "#Content", "#TikTok"]
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
