delete process.env.GROQ_API_KEY;

const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, ".env.local");
const text = fs.readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
let apiKey = "";
text.split(/\r?\n/).forEach(function (rawLine) {
  const line = rawLine.trim();
  if (!line.startsWith("GROQ_API_KEY=")) return;
  apiKey = line.slice("GROQ_API_KEY=".length).trim().replace(/^['"]|['"]$/g, "");
});

if (!apiKey) {
  console.log(JSON.stringify({ loaded: false }));
  process.exit(0);
}

fetch("https://api.groq.com/openai/v1/models", {
  headers: {
    Authorization: "Bearer " + apiKey,
  },
})
  .then(async function (res) {
    const data = await res.json();
    const ids = (data.data || [])
      .map(function (item) {
        return item.id;
      })
      .filter(function (id) {
        return /llama|gpt-oss|qwen|scout|maverick|instant|versatile/i.test(id);
      });
    console.log(JSON.stringify({ status: res.status, ids: ids }));
  })
  .catch(function (error) {
    console.log(JSON.stringify({ network: error.name }));
  });
