import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

// ==============================
// ENV VARIABLES
// ==============================
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID || !VERIFY_TOKEN) {
  throw new Error("❌ Missing required environment variables");
}

// ==============================
// IN-MEMORY DEDUPLICATION
// ==============================
const processedMessageIds = new Set();

// ==============================
// HEALTH CHECK
// ==============================
app.get("/", (_req, res) => {
  res.status(200).send("✅ WhatsApp Webhook Server Running");
});

// ==============================
// WEBHOOK VERIFICATION (META)
// ==============================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// ==============================
// MAIN WEBHOOK HANDLER
// ==============================
app.post("/webhook", async (req, res) => {
  try {
    const incoming = parseIncomingMessage(req);

    // Always ACK Meta quickly
    if (!incoming) {
      return res.sendStatus(200);
    }

    // Prevent duplicate replies
    if (processedMessageIds.has(incoming.id)) {
      return res.sendStatus(200);
    }

    processedMessageIds.add(incoming.id);

    console.log("📥 Incoming message:", incoming);

    const reply = generateReply(incoming.text);

    // ✅ PASTE THIS LINE RIGHT HERE
    console.log("Reply generated:", reply);

    // ACK before heavy work
    res.sendStatus(200);

    if (reply) {
      await sendTextMessage(incoming.from, reply);
    }
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.sendStatus(200);
  }
});

// ==============================
// MESSAGE PARSER
// ==============================
function parseIncomingMessage(req) {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;

  if (!value?.messages?.[0]) return null;

  const message = value.messages[0];

  // Ignore messages sent by our own number
  if (message.from === value.metadata?.phone_number_id) {
    return null;
  }

  let type = "unknown";
  let text = null;

  if (message.text?.body) {
    type = "text";
    text = message.text.body;
  } else if (message.image) {
    type = "image";
  } else if (message.interactive) {
    type = "interactive";
  }

  return {
    id: message.id,
    from: message.from, 
    type,
    text,
  };
}

// ==============================
// BUSINESS LOGIC (NO WHATSAPP CODE)
// ==============================
function generateReply(text) {
  if (!text) return null;

  const msg = text.toLowerCase().trim();

  if (msg === "hi" || msg === "hello") {
    return "👋 Hi! How can I help you today?";
  }

  if (msg.includes("price")) {
    return "💰 Please visit our website for pricing details.";
  }

  if (msg.includes("help")) {
    return "🆘 Commands:\n• hi\n• price\n• help";
  }

  return "🤖 Sorry, I didn’t understand that. Type *help*.";
}

// ==============================
// SEND MESSAGE TO WHATSAPP
// ==============================
async function sendTextMessage(to, text) {
  const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });

  const data = await response.json();

  console.log("📡 WhatsApp API status:", response.status);
  console.log("📡 WhatsApp API response:", data);
}

// ==============================
// START SERVER
// ==============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
