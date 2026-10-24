const fs = require("fs");

function inspect(p) {
  const out = { path: p, exists: fs.existsSync(p) };
  if (!out.exists) {
    console.log(JSON.stringify(out));
    return;
  }
  const buf = fs.readFileSync(p);
  out.bytes = buf.length;
  out.utf16le = buf.length >= 2 && buf[1] === 0 && buf[0] !== 0;
  let text = buf.toString(out.utf16le ? "utf16le" : "utf8");
  out.bom = text.charCodeAt(0) === 0xfeff;
  if (out.bom) text = text.slice(1);
  const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));
  out.lineCount = lines.length;
  out.keys = lines.map((l) => {
    const i = l.indexOf("=");
    const name = i === -1 ? l : l.slice(0, i);
    const val = i === -1 ? "" : l.slice(i + 1);
    const trimmedVal = val.trim().replace(/^['"]|['"]$/g, "");
    return {
      nameJSON: JSON.stringify(name),
      exactGroq: name === "GROQ_API_KEY",
      empty: trimmedVal.length === 0,
      valueLen: trimmedVal.length,
    };
  });
  console.log(JSON.stringify(out, null, 2));
}

inspect(".env.local");
inspect(".env");
inspect(".vercel/.env.development.local");
inspect(".vercel/.env");
