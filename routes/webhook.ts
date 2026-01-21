// export async function webhook(req: Request, res: Response) {
//   try {
//     const mode = req.query['hub.mode'];
//     const token = req.query['hub.verify_token'];
//     const challenge = req.query['hub.challenge'];

//     if (mode && token) {
//       if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
//         console.log('WEBHOOK_VERIFIED');
//         res.status(200).send(challenge);
//       } else {
//         res.sendStatus(403);
//       }
//     } else {
//       res.sendStatus(400);
//     }
//   } catch (error) {
//     console.error('Error in webhook verification:', error);
//     res.sendStatus(500);
//   }
// }

// export async function postWebhook(req: Request, res: Response) {
//   const body = req.body;
//   let log;
//   try {
//     console.log('Received webhook:', JSON.stringify(body, null, 2));
//     if (body.object) {
//       log = await prisma.messageLog.create({
//         data: {
//           payload: body,
//         },
//       });
//       for (const entry of body.entry) {
//         if (entry && entry.changes) {
//           for (const change of entry.changes) {
//             const phoneNumberId = change.value.metadata.phone_number_id;

//             const account = await prisma.account.findFirst({
//               where: {
//                 phoneNumberId: phoneNumberId,
//               },
//               include: {
//                 users: true,
//               },
//             });

//             if (!account) {
//               console.log(
//                 'No account found for phone number ID:',
//                 phoneNumberId
//               );
//               continue;
//             }
//             if (change.value.contacts) {
//               for (const contact of change.value.contacts) {
//                 // Save contact information if available
//                 if (contact.profile && contact.wa_id) {
//                   try {
//                     await saveContact(
//                       contact.wa_id,
//                       contact.profile.name || 'Unknown',
//                       account.id
//                     );
//                   } catch (contactError) {
//                     console.error('Error saving contact:', contactError);
//                     // Don't fail the webhook if contact saving fails
//                   }
//                 }
//               }
//             }

//             if (change.value.messages) {
//               for (const message of change.value.messages) {
//                 // Process the message
//                 await processMessage(
//                   message,
//                   account.users.map((user) => user.id),
//                   change,
//                   account.id
//                 );
//               }
//             }
//           }
//         }
//       }
//       if (log) {
//         await prisma.messageLog.update({
//           where: {
//             id: log.id,
//           },
//           data: {
//             status: MessageLogStatus.SUCCESS,
//           },
//         });
//       }
//     }
//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Error in postWebhook:', error);
//     if (log) {
//       await prisma.messageLog.update({
//         where: {
//           id: log.id,
//         },
//         data: {
//           status: MessageLogStatus.FAILED,
//           error:
//             error instanceof Error
//               ? { message: error.message, stack: error.stack }
//               : (error as any),
//         },
//       });
//     }
//     res.sendStatus(500);
//   }
// }
