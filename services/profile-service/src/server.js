const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "profile-service", status: "OK" });
});

app.post("/profiles", async (req, res) => {
  try {
    const { fullName, title } = req.body || {};
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ error: "fullName invalide" });
    }

    const profile = await prisma.profile.create({
      data: {
        fullName: fullName.trim(),
        title: title ?? null,
      },
    });

    return res.status(201).json(profile);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "internal_error", details: String(error) });
  }
});

app.listen(4001, () => {
  console.log("profile-service listening on port 4001");
});
