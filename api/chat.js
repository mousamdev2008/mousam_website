const fs = require("fs");
const path = require("path");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b";
const MAX_MESSAGE_LENGTH = 1000;

function loadLocalEnvFile() {
  if (process.env.GROQ_API_KEY) {
    return;
  }

  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    const text = fs.readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");

    text.split(/\r?\n/).forEach(function (rawLine) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) {
        return;
      }

      const eq = line.indexOf("=");
      if (eq === -1) {
        return;
      }

      const name = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (name && process.env[name] === undefined) {
        process.env[name] = value;
      }
    });
  } catch (error) {
    // Local file is optional. Production uses platform environment variables.
  }
}

const SYSTEM_PROMPT = `You are a helpful portfolio assistant for Mousam Kumari.

Use only these verified facts:
- Name: Mousam Kumari
- Education: B.Tech Computer Science and Engineering student
- Description: B.Tech CSE Student | Aspiring Software Developer
- Introduction: She is a B.Tech Computer Science and Engineering student interested in programming and software development.
- She is learning C++, Python, Data Structures and Algorithms, and web development to improve her technical skills.
- Skills: C++, Python, HTML, CSS, JavaScript, Data Structures and Algorithms
- Project 1: Python Programs Collection — a collection of Python programs including factorial, Fibonacci, and structure-to-dictionary conversion. Factorial uses a loop and handles negative inputs. Fibonacci prints a requested number of terms. Structure-to-dictionary uses a Python class for student details and converts object attributes with __dict__. Technologies: Python 3, classes and objects, loops, conditional statements, dictionaries.
- Project 2: Messy Python Code Improvement — improving messy Python code with AI tools (Cursor AI). The code was refactored into separate functions. It calculates sum, average, and the maximum number, and uses meaningful names, comments, and docstrings. Technologies: Python 3, Cursor AI.
- Project 3: Bug Fixing Using Cursor AI — identifying and correcting errors in a program using Cursor AI. The original program assigned each number to total instead of adding it, so it showed only the last number. The fix was total += numbers[i]. Expected output: Sum of numbers: 150. Technologies: Python 3, Cursor AI.
- Project 4: Interactive Quiz Application — an interactive quiz created using concepts learned in the lab. Technologies: HTML, CSS, and JavaScript.
- Project 5: Book Reading List Application — an application to maintain and manage a personal book reading list. Features: add books with titles and reading status; statuses Want to Read, Reading, or Finished; filter by status; prevent duplicate titles (case and extra spaces ignored); title limit of 60 characters; delete individual books; display total books, currently reading, and finished counts; responsive design. Technologies: React, TypeScript, HTML and CSS, Vite. Live demo: https://reading-list-app-woad.vercel.app
- GitHub: https://github.com/mousamdev2008 (username mousamdev2008)
- Email: mousamkumari@gmail.com
- Answer in clear, natural English using short paragraphs or bullet points.
- Do not use Markdown tables.
- Do not display raw Markdown table syntax or unnecessary formatting symbols.
- When listing projects, show each project name clearly with a short description.

Rules:
- Answer questions about Mousam Kumari's introduction, education, skills, projects, technologies, GitHub, and email using only the facts above.
- Do not invent qualifications, achievements, college names, years, internships, statistics, or extra project features.
- If a question is unrelated or the answer is not in these facts, politely explain that you are a portfolio assistant and can only help with this portfolio.`;

function collectBody(req) {
  if (req.body !== undefined) {
    return Promise.resolve(req.body);
  }

  return new Promise(function (resolve, reject) {
    let raw = "";

    req.on("data", function (chunk) {
      raw += chunk;
      if (raw.length > 20000) {
        reject(new Error("Request body is too large."));
      }
    });

    req.on("end", function () {
      resolve(raw);
    });

    req.on("error", reject);
  });
}

function readMessage(body) {
  if (typeof body === "string") {
    if (!body.trim()) {
      return { error: "Request body must be JSON with a message." };
    }

    try {
      body = JSON.parse(body);
    } catch (error) {
      return { error: "Invalid JSON body." };
    }
  }

  if (!body || typeof body !== "object") {
    return { error: "Request body must be JSON with a message." };
  }

  if (typeof body.message !== "string") {
    return { error: "Please provide a message string." };
  }

  const message = body.message.trim();

  if (!message) {
    return { error: "Message cannot be empty." };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { error: "Message is too long." };
  }

  return { message };
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Please send a POST request." });
    return;
  }

  let body;

  try {
    body = await collectBody(req);
  } catch (error) {
    sendJson(res, 400, { error: "Could not read the request body." });
    return;
  }

  const parsed = readMessage(body);

  if (parsed.error) {
    sendJson(res, 400, { error: parsed.error });
    return;
  }

  loadLocalEnvFile();

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    sendJson(res, 500, {
      error: "The chat service is not configured yet.",
    });
    return;
  }

  try {
    const groqResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: parsed.message },
        ],
      }),
    });

    let groqData = null;

    try {
      groqData = await groqResponse.json();
    } catch (error) {
      sendJson(res, 502, {
        error: "The chat service returned an unreadable response.",
      });
      return;
    }

    if (groqResponse.status === 429) {
      sendJson(res, 429, {
        error: "The assistant is busy right now. Please try again in a moment.",
      });
      return;
    }

    if (!groqResponse.ok) {
      console.error("Groq API error:", groqResponse.status, groqData);
      sendJson(res, 502, {
        error: "The chat service could not complete this request.",
      });
      return;
    }

    const reply =
      groqData &&
      groqData.choices &&
      groqData.choices[0] &&
      groqData.choices[0].message &&
      groqData.choices[0].message.content;

    if (!reply || typeof reply !== "string") {
      sendJson(res, 502, {
        error: "The chat service returned an empty reply.",
      });
      return;
    }

    sendJson(res, 200, { reply: reply.trim() });
  } catch (error) {
    sendJson(res, 500, {
      error: "Something went wrong while contacting the assistant.",
    });
  }
};
