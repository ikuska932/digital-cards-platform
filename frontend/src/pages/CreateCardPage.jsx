import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { createCard } from "../api/cards";
import { useAuth } from "../context/AuthContext";


const themes = [
  {
    id: "minimal",
    title: "Минимализм",
    desc: "Простой и чистый",
  },
  {
    id: "gradient",
    title: "Градиент",
    desc: "Яркий стиль",
  },
  {
    id: "dark",
    title: "Тёмная",
    desc: "Глубокий дизайн",
  },
  {
    id: "pastel",
    title: "Пастель",
    desc: "Мягкие цвета",
  },
];


const themeClasses = {
  minimal: "from-[#18181b] to-[#27272a]",
  gradient: "from-fuchsia-600 to-purple-700",
  dark: "from-[#0f172a] to-[#1e293b]",
  pastel: "from-pink-300 to-cyan-200",
};


const colors = [
  "#9333ea",
  "#6366f1",
  "#3b82f6",
  "#22d3ee",
  "#10b981",
  "#84cc16",
  "#facc15",
  "#fb923c",
  "#ef4444",
  "#ec4899",
  "#18181b",
  "#374151",
];


export default function CreateCardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useAuth();

  const template = location.state?.template;

  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState(
    template?.title || ""
  );

  const [category, setCategory] = useState(
    template?.category || ""
  );

  const [description, setDescription] = useState("");

  const [content, setContent] = useState(
    template?.message || ""
  );

  const [selectedTheme, setSelectedTheme] = useState(
    template?.theme || "minimal"
  );

  const [selectedColor, setSelectedColor] = useState(
    template?.color || "#9333ea"
  );

  const [image, setImage] = useState("");

  const [comments, setComments] = useState(true);

  const [favorite, setFavorite] = useState(false);


  useEffect(() => {
    if (!template) return;

    setTitle(template.title ?? "");

    setContent(template.message ?? "");

    setCategory(template.category ?? "");

    setSelectedTheme(
      template.theme ?? "minimal"
    );

    setSelectedColor(
      template.color ?? "#9333ea"
    );
  }, [template]);

 
  const handleCreateCard = async () => {
    if (
      !title.trim() &&
      !description.trim() &&
      !content.trim()
    ) {
      alert("Заполните хотя бы одно поле");
      return;
    }

    try {
      setCreating(true);

      const newCard = {
        title: title.trim(),

        message: content.trim(),

        description: description.trim(),

        tags: category ? [category] : [],

        pinned: favorite,

        color: selectedColor,

        theme: selectedTheme,

        image: image?.trim() || "",

        commentsEnabled: comments,

        category,
      };

      await createCard(token, newCard);

      navigate("/cards");
    } catch (error) {
      console.error(error);

      alert("Ошибка создания карточки");
    } finally {
      setCreating(false);
    }
  };

 
  return (
    <div className="min-h-screen bg-[#07070b] text-white px-8 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Создание открытки ✨
          </h1>

          <p className="text-zinc-400 mt-2">
            Создайте красивую карточку
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/cards")}
            className="px-5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            Отмена
          </button>

          <button
            onClick={handleCreateCard}
            disabled={creating}
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 transition"
          >
            {creating
              ? "Создание..."
              : "Создать"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_400px] gap-8">
        {/* LEFT */}
        <div className="space-y-8">
          {/* INFO */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 className="text-2xl mb-5">
              Информация
            </h2>

            {/* IMAGE */}
            <input
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              placeholder="URL картинки"
              className="w-full mb-4 px-4 py-3 rounded-xl bg-black/30 border border-white/10"
            />

            {image && (
              <img
                src={image}
                alt=""
                className="w-full h-48 object-cover object-center rounded-xl mb-4"
              />
            )}

            {/* TITLE */}
            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Заголовок"
              className="w-full mb-4 px-4 py-3 rounded-xl bg-black/30 border border-white/10"
            />

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full mb-4 px-4 py-3 rounded-xl bg-black/30 border border-white/10"
            >
              <option value="">
                Категория
              </option>

              <option value="работа">
                Работа
              </option>

              <option value="идея">
                Идея
              </option>

              <option value="важное">
                Важное
              </option>

              <option value="ежедневно">
                Ежедневно
              </option>

              <option value="личное">
                Личное
              </option>
            </select>

            {/* DESCRIPTION */}
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Описание"
              className="w-full mb-4 px-4 py-3 rounded-xl bg-black/30 border border-white/10"
            />

            {/* CONTENT */}
            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Содержимое"
              rows={8}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10"
            />
          </div>

          {/* DESIGN */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 className="text-2xl mb-5">
              Дизайн
            </h2>

            {/* THEMES */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    setSelectedTheme(t.id)
                  }
                  className={`p-4 rounded-xl border transition text-left ${
                    selectedTheme === t.id
                      ? "border-purple-400 bg-purple-500/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="font-semibold">
                    {t.title}
                  </div>

                  <div className="text-sm text-zinc-400 mt-1">
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* COLORS */}
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() =>
                    setSelectedColor(c)
                  }
                  style={{ background: c }}
                  className={`w-10 h-10 rounded-full border-2 transition ${
                    selectedColor === c
                      ? "border-white scale-110"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div
            className={`rounded-2xl p-6 border border-white/10 bg-gradient-to-br ${themeClasses[selectedTheme]} shadow-2xl sticky top-8 overflow-hidden`}
          >
            {/* GLOW */}
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-30"
              style={{
                background: selectedColor,
              }}
            />

            {/* CONTENT */}
            <div className="relative z-10">
              {image && (
                <div className="relative overflow-hidden rounded-2xl mb-5">
                  <img
                    src={image}
                    alt=""
                    className="w-full h-56 object-cover object-center"
                  />

                  <div className="absolute inset-0 bg-black/20" />
                </div>
              )}

              <h2 className="text-3xl font-bold leading-tight">
                {title || "Заголовок"}
              </h2>

              <p className="mt-4 text-white/80 leading-relaxed">
                {description || "Описание"}
              </p>

              <div className="mt-5 whitespace-pre-wrap text-white/90">
                {content || "Текст карточки"}
              </div>

              <div className="mt-6 flex items-center gap-2 flex-wrap">
                <div className="px-3 py-1 rounded-full bg-black/30 text-sm">
                  #
                  {category ||
                    "категория"}
                </div>

                {favorite && (
                  <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
                    ⭐ Избранное
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SETTINGS */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-4">
              Настройки
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span>
                  Комментарии
                </span>

                <input
                  type="checkbox"
                  checked={comments}
                  onChange={(e) =>
                    setComments(
                      e.target.checked
                    )
                  }
                />
              </label>

              <label className="flex items-center justify-between">
                <span>
                  Избранное
                </span>

                <input
                  type="checkbox"
                  checked={favorite}
                  onChange={(e) =>
                    setFavorite(
                      e.target.checked
                    )
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}