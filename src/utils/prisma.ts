import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: "file:prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

export default prisma;
