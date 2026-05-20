const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* =======================
   🔐 CORS — ВАЖНО
======================= */
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 фронтенд
    credentials: true,               // 👈 разрешаем cookies / auth
  })
);

/* =======================
   📦 middleware
======================= */
app.use(express.json());

/* =======================
   🚏 routes
======================= */
const authRoutes = require("./routes/authRoutes");
const cardRoutes = require("./routes/cardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);

/* =======================
   🧠 db
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

/* =======================
   🧪 test route
======================= */
app.get("/", (req, res) => {
  res.send("Digital Cards API");
});

/* =======================
   🚀 server
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
