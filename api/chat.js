// Serverless function (Vercel). Keeps your Gemini API key on the server —
// it is NEVER sent to the browser. Reads GEMINI_API_KEY from environment vars.
// Uses Google's Gemini API, which has a genuine free tier (no credit card needed).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server misconfigured: GEMINI_API_KEY is not set." });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing 'messages' array in request body." });
  }

  // Convert our {role, content} turns into Gemini's {role, parts} shape.
  // Gemini uses "model" instead of "assistant" for the AI's turns.
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const model = "gemini-2.5-flash"; // stable, free-tier eligible
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data.error?.message || "Upstream API error" });
    }

    const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") || "";

    if (!text) {
      return res.status(200).json({ text: "(No response — the message may have been blocked by Gemini's safety filters.)" });
    }

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: "Request to Gemini API failed: " + err.message });
  }
}

