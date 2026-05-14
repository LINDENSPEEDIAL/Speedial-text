const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// ============================================
// YOUR SETTINGS - FILL IN YOUR DETAILS BELOW
// ============================================
const CLAUDE_API_KEY = "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";
const WHATSAPP_TOKEN = "EAAOc5xUGNBwBRdgy4sWTpNvZAcAxvHjsA2ZAoHTovzfCNESZA8zFUEobXNstpBBVe90I7klDUr5ZAluv8jo09RaZAXTtZBhgXsx7QpuHVaQNZA4vV7uWDx0f85ZAZBkK2Jv4tqNeZAJutl0eRQuLeUDFwtjhuNUgEcsy93ePEy93OZCGgJJNwHrLHUOL4kjaZA1uOHrQAZAigyRg6SCvMooOZAdZBZCEb95bhoevBWaBFltIeMj9Yyamk0No6eNkYbw0k3ZABpO9EZAXkhOe7wouBynXCSAOY7mVQv9R8ZD";
const PHONE_NUMBER_ID = "1185305807988713";
const VERIFY_TOKEN = "speedial123";

// ============================================
// YOUR DIRECTORY DATA - ADD YOUR LISTINGS HERE
// ============================================
const DIRECTORY_DATA = `
You are the Speedial local directory assistant. You help people find local businesses and services in the area.
Here is the directory information you can answer questions about:

EXAMPLE LISTINGS (replace with your real data):
- Mike's Plumbing: Tel 555-0101, Available 24/7, All plumbing repairs
- City Electricians: Tel 555-0102, Mon-Fri 8am-6pm, Residential & commercial
- Quick Taxi: Tel 555-0103, Available 24/7, Local & airport rides
- Rosa's Restaurant: Tel 555-0104, Open daily 9am-10pm, Italian cuisine
- ABC Hardware Store: Tel 555-0105, Mon-Sat 8am-7pm, Tools & supplies

Always be friendly and helpful. If someone asks for a service, give them the name and phone number.
If you don't have the information they need, apologize and suggest they call our main number.
`;

// ============================================
// WEBHOOK VERIFICATION (required by Meta)
// ============================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ============================================
// RECEIVE & REPLY TO WHATSAPP MESSAGES
// ============================================
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message && message.type === "text") {
        const userMessage = message.text.body;
        const userPhone = message.from;

        console.log(`Message from ${userPhone}: ${userMessage}`);

        // Ask Claude for an answer
        const claudeResponse = await axios.post(
          "https://api.anthropic.com/v1/messages",
          {
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: DIRECTORY_DATA,
            messages: [{ role: "user", content: userMessage }],
          },
          {
            headers: {
              "x-api-key": CLAUDE_API_KEY,
              "anthropic-version": "2023-06-01",
              "content-type": "application/json",
            },
          }
        );

        const reply = claudeResponse.data.content[0].text;

        // Send reply back to WhatsApp
        await axios.post(
          `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: userPhone,
            text: { body: reply },
          },
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`Replied to ${userPhone}: ${reply}`);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error.message);
    res.sendStatus(500);
  }
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Speedial bot is running on port ${PORT}`);
});
