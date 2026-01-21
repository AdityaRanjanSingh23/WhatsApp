// import fetch from "node-fetch";

// const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;
// const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID!;

// export async function sendTextMessage(to: string, text: string) {
//   const url = `https://graph.facebook.com/v24.0/${PHONE_NUMBER_ID}/messages`;

//   await fetch(url, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${WHATSAPP_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       messaging_product: "whatsapp",
//       to,
//       type: "text",
//       text: { body: text },
//     }),
//   });
// }
