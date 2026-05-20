const Card = require("../models/Card");
const mongoose = require("mongoose");

exports.getCards = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const cursor = req.query.cursor;
    const search = req.query.search;

    const query = { user: req.user._id };

    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      query._id = { $lt: cursor };
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const cards = await Card.find(query)
      .sort({ order: 1, _id: -1 })
      .limit(limit + 1);

    const hasMore = cards.length > limit;
    if (hasMore) cards.pop();

    res.json({
      cards,
      nextCursor: hasMore ? cards[cards.length - 1]?._id : null,
      hasMore,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Ошибка получения открыток" });
  }
};

exports.createCard = async (req, res) => {
  try {
    const {
      title,
      message,
      color,
      image,
      theme,
      category,
      commentsEnabled,
      tags,
      pinned,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Название обязательно" });
    }

    const count = await Card.countDocuments({ user: req.user._id });

    const card = await Card.create({
      title,
      message: message || "",
      user: req.user._id,
      order: count,

      color: color || "#18181b",
      image: image || "",
      theme: theme || "minimal",
      category: category || "",
      commentsEnabled: commentsEnabled ?? true,
      tags: tags || [],
      pinned: pinned || false,
    });

    res.status(201).json(card);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Ошибка создания открытки" });
  }
};


exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ message: "Открытка не найдена" });
    }

    res.json(card);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Ошибка обновления открытки" });
  }
};


exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!card) {
      return res.status(404).json({ message: "Открытка не найдена" });
    }

    res.json({ message: "Открытка удалена" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Ошибка удаления открытки" });
  }
};

exports.reorderCards = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Неверный формат данных" });
    }

    const bulk = items.map((item, index) => ({
      updateOne: {
        filter: { _id: item._id, user: req.user._id },
        update: { order: index },
      },
    }));

    await Card.bulkWrite(bulk);

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Ошибка сортировки открыток" });
  }
};

