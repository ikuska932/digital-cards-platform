
import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import * as htmlToImage from "html-to-image";

import { useAuth } from "../context/AuthContext";
import { updateCard } from "../api/cards";

const themes = {
  minimal: "from-[#241545] via-[#18122b] to-[#111827]",
  gradient: "from-fuchsia-600 via-purple-600 to-orange-400",
  dark: "from-[#0f172a] via-[#111827] to-[#312e81]",
  pastel: "from-pink-200 via-purple-200 to-cyan-200",
};

export default function SortableCard({
  card,
  onDelete,
  onOptimisticUpdate,
}) {
  const { token } = useAuth();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id });

  const cardRef = useRef(null);

  const dndStyle = {
  transform: transform
    ? CSS.Transform.toString(transform)
    : undefined,
  transition,
};

  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [title, setTitle] = useState(card.title || "");
  const [message, setMessage] = useState(card.message || "");
  const [pinned, setPinned] = useState(card.pinned || false);
  const [image, setImage] = useState(card.image || "");
  const [color, setColor] = useState(card.color || "#9333ea");
  const [theme, setTheme] = useState(card.theme || "minimal");

  const [tags, setTags] = useState(card.tags || []);
  const [tagInput, setTagInput] = useState("");

  const themeBg = themes[theme || card.theme] || themes.minimal;

  useEffect(() => {
    setTitle(card.title || "");
    setMessage(card.message || "");
    setPinned(card.pinned || false);
    setImage(card.image || "");
    setColor(card.color || "#9333ea");
    setTheme(card.theme || "minimal");
    setTags(card.tags || []);
  }, [card]);

  const handleAddTag = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const value = tagInput.trim();

    if (!value) return;

    if (!tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }

    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const handleExport = async () => {
  if (!cardRef.current) return;

  try {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 50));
    const dataUrl = await htmlToImage.toPng(cardRef.current, {
      backgroundColor: "#0b0b0c",
      pixelRatio: 2,
    });
    const link = document.createElement("a");
    link.download = `${card.title || "card"}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error(error);
    alert("Ошибка экспорта");
  } finally {
    setIsExporting(false);
  }
};

  const togglePin = async () => {
    const newValue = !pinned;

    setPinned(newValue);

    try {
      await updateCard(token, card._id, {
        pinned: newValue,
      });

      onOptimisticUpdate(card._id, {
        pinned: newValue,
      });
    } catch (error) {
      console.error(error);
      setPinned(card.pinned || false);
      alert("Ошибка обновления избранного");
    }
  };

  const handleSave = async () => {
    const previousCard = { ...card };

    const updatedCard = {
      title: title.trim() || "Без заголовка",
      message,
      pinned,
      image: image.trim(),
      tags,
      color,
      theme,
    };

    onOptimisticUpdate(card._id, updatedCard);
    setIsEditing(false);

    try {
      await updateCard(token, card._id, updatedCard);
    } catch (error) {
      console.error(error);
      onOptimisticUpdate(card._id, previousCard);
      alert("Ошибка сохранения карточки");
    }
  };

  const handleCancelEdit = () => {
    setTitle(card.title || "");
    setMessage(card.message || "");
    setPinned(card.pinned || false);
    setImage(card.image || "");
    setColor(card.color || "#9333ea");
    setTheme(card.theme || "minimal");
    setTags(card.tags || []);
    setIsEditing(false);
  };

  return (
  <motion.div
    ref={(node) => {
      setNodeRef(node);
      cardRef.current = node;
    }}
    style={dndStyle}
    layout
    animate={{
      opacity: isDragging ? 0.45 : 1,
      scale: isDragging ? 0.99 : 1,
    }}
    whileHover={{ y: -3 }}
    className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${themeBg} p-5 text-white shadow-lg transition hover:border-purple-300/40 hover:shadow-purple-500/10`}
  >
    {/* glow */}
    <div
      className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-40"
      style={{ backgroundColor: color }}
    />

    <div className="pointer-events-none absolute inset-0 bg-black/10" />

    <div className="relative z-10 flex justify-between gap-4">

      {/* LEFT */}
      <div className="min-w-0 flex-1 space-y-4">

        {isEditing ? (
          <>
            {/* TITLE */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок"
              className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white"
            />

            {/* MESSAGE */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white"
            />

            {/* IMAGE INPUT */}
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="URL изображения"
              className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white"
            />

            {/* IMAGE PREVIEW */}
            {image && (
              <img
                src={image}
                alt=""
                className="h-48 w-full object-cover rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}

            {/* TAGS */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="rounded-lg bg-purple-500/20 px-3 py-1 text-xs"
                >
                  #{tag} ×
                </button>
              ))}
            </div>

            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Добавить тег"
              className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-2 text-white"
            />

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-purple-600 px-4 py-2 rounded-xl"
              >
                Сохранить
              </button>

              <button
                onClick={handleCancelEdit}
                className="border px-4 py-2 rounded-xl"
              >
                Отмена
              </button>
            </div>
          </>
        ) : (
          <>
            {/* TITLE */}
            <div className="flex items-start justify-between">
              <h3
                onClick={() => setIsEditing(true)}
                className="text-xl font-bold cursor-pointer"
              >
                {card.title || "Без заголовка"}
              </h3>

              {pinned && <span>⭐</span>}
            </div>

            {/* IMAGE */}
            {card.image && typeof card.image === "string" && (
              <div className="relative w-full aspect-[16/6] overflow-hidden rounded-xl">

                <img
                  src={card.image}
                  alt=""
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />

              </div>
            )}

            {/* TEXT */}
            {card.message && (
              <div
                onClick={() => setIsEditing(true)}
                className="prose prose-sm cursor-pointer text-white"
              >
                <ReactMarkdown>
                  {typeof card.message === "string"
                    ? card.message
                    : JSON.stringify(card.message || "")}
                </ReactMarkdown>
              </div>
            )}

            {/* TAGS */}
            {card.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-black/30 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* RIGHT ACTIONS */}
      {!isExporting && (
        <div className="flex flex-col items-end gap-2">
          {!isEditing && (
            <>
              <button onClick={togglePin}>
                {pinned ? "⭐" : "☆"}
              </button>

              <button onClick={() => setIsEditing(true)}>
                ✏️
              </button>

              <button onClick={() => onDelete(card._id)}>
                🗑
              </button>
            </>
          )}

          <button onClick={handleExport}>💾</button>

          <button {...attributes} {...listeners}>
            ☰
          </button>
        </div>
      )}

    </div>
  </motion.div>
);
}