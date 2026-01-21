const { PrismaClient } = require("@prisma/client");

// import { PrismaClient } from "@prisma/client";
// import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();

module.exports = { prisma };
