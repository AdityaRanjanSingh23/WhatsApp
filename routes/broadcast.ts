// const express = require("express");
// const { prisma } = require("../db/prisma");

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const { templateName, phones } = req.body;

//     if (!templateName) {
//       return res.status(400).json({ error: "templateName is required" });
//     }

//     if (!Array.isArray(phones) || phones.length === 0) {
//       return res.status(400).json({ error: "phones must be a non-empty array" });
//     }

//     const broadcast = await prisma.broadcast.create({
//       data: {
//         organizationId: "org_demo_123",
//         templateName,
//         status: "PENDING",
//       },
//     });

//     await prisma.broadcastRecipient.createMany({
//       data: phones.map(phone => ({
//         broadcastId: broadcast.id,
//         phone,
//         status: "PENDING",
//       })),
//     });

//     res.json({
//       broadcastId: broadcast.id,
//       recipients: phones.length,
//       status: "QUEUED",
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;

import express from "express";
import {prisma} from "../db/prisma";

import {Router} from "express"



module.exports = express.Router();