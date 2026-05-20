const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    // 🔥 ДОБАВЛЯЕМ НОВЫЕ ПОЛЯ
    color: {
      type: String,
      default: "#18181b",
    },

    image: {
      type: String,
      default: "",
    },

    theme: {
      type: String,
      default: "minimal",
    },

    category: {
      type: String,
      default: "",
    },

    commentsEnabled: {
      type: Boolean,
      default: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);