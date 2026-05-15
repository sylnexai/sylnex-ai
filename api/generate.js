export default async function handler(req, res) {
  res.status(200).json({
    title: "🔥 Test Success",
    body: "Sylnex AI работает!",
    hashtags: ["#ai", "#viral"]
  });
}
