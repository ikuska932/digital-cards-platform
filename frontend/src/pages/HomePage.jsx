// src/pages/HomePage.jsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useHomeCards } from "../hooks/useHomeCards";
import ProfileModal from "../components/ProfileModal";
import TagSidebar from "../components/TagSidebar";
import { useAuth } from "../context/AuthContext";
import { updateCard } from "../api/cards";

function CardPreview({
  card,
  onClick,
  onToggleFavorite,
  onTagClick,
}) {
  const priorityColors = {
    high: "text-red-400 bg-red-500/10 border-red-500/20",
    medium: "text-yellow-300 bg-yellow-500/10 border-yellow-500/20",
    low: "text-green-300 bg-green-500/10 border-green-500/20",
  };

  const priority =
    card.priority || ["high", "medium", "low"][Math.floor(Math.random() * 3)];

  const status =
    card.status || ["В работе", "Новая", "Завершена"][Math.floor(Math.random() * 3)];

  const updatedAt =
    card.updatedAt || "Сегодня";

  return (
    <motion.div
      layout
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      onClick={onClick}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-gradient-to-br
        from-[#14141b]
        via-[#111118]
        to-[#0c0c12]
        p-6
        cursor-pointer
        transition-all
        duration-300
        hover:border-purple-400/30
        hover:shadow-[0_0_60px_rgba(139,92,246,0.10)]
      "
    >
      {/* glow effect */}
      <div
        className="
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          transition
          duration-500
          pointer-events-none
          bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_45%)]
        "
      />

      {/* top actions */}
      <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(card);
          }}
          className="
            w-10
            h-10
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            flex
            items-center
            justify-center
            hover:bg-white/[0.08]
            transition
          "
        >
          {card.pinned ? "⭐" : "☆"}
        </button>

        <button
          className="
            w-10
            h-10
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            flex
            items-center
            justify-center
            hover:bg-white/[0.08]
            transition
          "
        >
          ⋮
        </button>
      </div>

      {/* icon */}
      <div className="text-4xl mb-6 relative z-10">
        {card.image ? "🖼️" : "📄"}
      </div>

      {/* status row */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <span
          className={`
            px-3
            py-1
            rounded-xl
            text-xs
            border
            ${priorityColors[priority]}
          `}
        >
          {priority === "high" && "Высокий приоритет"}
          {priority === "medium" && "Средний приоритет"}
          {priority === "low" && "Низкий приоритет"}
        </span>

        <span className="text-xs text-zinc-400">
          {status}
        </span>
      </div>

      {/* title */}
      <h3 className="text-xl font-semibold text-white leading-snug relative z-10">
        {card.title || "Новая карточка"}
      </h3>

      {/* content preview */}
      <p className="mt-4 text-sm text-zinc-400 leading-relaxed line-clamp-4 relative z-10">
        {card.message ||
          "Добавьте описание, цели, заметки или важные данные. Эта карточка поможет структурировать задачи и быстро находить нужную информацию."}
      </p>

      {/* metadata */}
      <div className="mt-5 flex items-center gap-3 text-xs text-zinc-500 relative z-10">
        <span>Обновлено: {updatedAt}</span>
        <span>•</span>
        <span>Личная карточка</span>
      </div>

      {/* progress line */}
      <div className="mt-5 relative z-10">
        <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
          <div
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-purple-500
              to-purple-300
              w-[65%]
            "
          />
        </div>

        <p className="text-xs text-zinc-500 mt-2">
          Прогресс выполнения: 65%
        </p>
      </div>

      {/* tags */}
      {card.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6 relative z-10">
          {card.tags.map((tag) => (
            <span
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="
                px-3
                py-1.5
                rounded-xl
                text-xs
                bg-purple-500/10
                border
                border-purple-500/10
                text-purple-300
                hover:bg-purple-500/20
                hover:border-purple-400/20
                transition
              "
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* footer action */}
      <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between relative z-10">
        <span className="text-sm text-zinc-400">
          Открыть подробнее
        </span>

        <span className="text-lg text-purple-300 group-hover:translate-x-1 transition">
          →
        </span>
      </div>
    </motion.div>
  );
}

function FilterButton({
  children,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl text-sm transition-all duration-200 ${
        active
          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/10"
          : "bg-white/[0.03] border border-white/10 text-zinc-300 hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </button>
  );
}

function FilterBar({
  filters,
  setFilters,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <FilterButton
        active={filters.favorites}
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            favorites: !prev.favorites,
          }))
        }
      >
        ❤️ Избранное
      </FilterButton>

      <FilterButton
        active={filters.withText}
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            withText: !prev.withText,
          }))
        }
      >
        📝 С текстом
      </FilterButton>

      <FilterButton
        active={filters.withImage}
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            withImage: !prev.withImage,
          }))
        }
      >
        🖼 С изображением
      </FilterButton>
    </div>
  );
}

function StatsCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-white mt-2">
            {value}
          </h3>

          <p className="text-xs text-zinc-500 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="text-3xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function RightPanel({
  filters,
  activeTags,
  total,
  favoritesCount,
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-semibold text-white text-lg mb-5">
          Фильтры
        </h3>

        <div className="space-y-3 text-sm text-zinc-300">
          <p>Карточек: {total}</p>
          <p>Активных тегов: {activeTags.length}</p>
          <p>Избранных: {favoritesCount}</p>
          <p>
            Фильтр избранного:{" "}
            {filters.favorites ? "включён" : "выключен"}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#181822] to-[#101018] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          ✨ Подсказка дня
        </h3>

        <p className="text-sm text-zinc-400 leading-relaxed">
          Используйте несколько тегов одновременно,
          чтобы быстрее находить нужные карточки.
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="py-28 text-center">
      <div className="text-6xl mb-5">
        📭
      </div>

      <h3 className="text-2xl font-semibold text-white">
        Ничего не найдено
      </h3>

      <p className="mt-3 text-zinc-400">
        Попробуйте изменить фильтры
      </p>

      <button
        onClick={onCreate}
        className="mt-8 px-7 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 transition font-medium"
      >
        Создать карточку
      </button>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] =
    useState([]);

  const [filters, setFilters] = useState({
    favorites: false,
    withText: false,
    withImage: false,
  });

  const {
    pinned,
    recent,
    loading,
  } = useHomeCards();

  const enrichCards = (cards) =>
    cards.map((card) => ({
      ...card,
      tags:
        card.tags ||
        ["работа", "идея", "ежедневно"],
    }));

  const allCards = enrichCards([
    ...pinned,
    ...recent,
  ]);

  const favoritesCount =
    allCards.filter((c) => c.pinned).length;

  const allTags = useMemo(() => {
    return [
      ...new Set(
        allCards.flatMap((c) => c.tags || [])
      ),
    ];
  }, [pinned, recent]);

  const toggleTag = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleToggleFavorite = async (card) => {
    try {
      await updateCard(token, card._id, {
        pinned: !card.pinned,
      });
    } catch {
      alert("Ошибка");
    }
  };

  const filteredCards = useMemo(() => {
    return enrichCards(recent).filter((card) => {
      const matchesSearch =
        card.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        card.message
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) =>
          card.tags.includes(tag)
        );

      const matchesFavorites =
        !filters.favorites || card.pinned;

      const matchesText =
        !filters.withText || card.message;

      const matchesImage =
        !filters.withImage || card.image;

      return (
        matchesSearch &&
        matchesTags &&
        matchesFavorites &&
        matchesText &&
        matchesImage
      );
    });
  }, [recent, search, activeTags, filters]);

  return (
    <div className="min-h-screen bg-[#07070b] text-white flex">
      <TagSidebar
        tags={allTags}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
      />

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-xl px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                Добро пожаловать 👋
              </h1>

              <p className="text-zinc-400 mt-2">
                У вас {filteredCards.length} карточек
              </p>
            </div>

            <div className="flex items-center gap-4">
              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Поиск..."
                className="w-[320px] px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10 outline-none"
              />

              <button
                onClick={() =>
                  navigate("/cards/create")
                }
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 transition"
              >
                + Новая карточка
              </button>

              <button
                onClick={() =>
                  setProfileOpen(true)
                }
                className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10"
              >
                👤
              </button>
            </div>
          </div>
        </div>

        <ProfileModal
          open={profileOpen}
          onClose={() =>
            setProfileOpen(false)
          }
        />

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-4 gap-5">
            <StatsCard
              title="Всего карточек"
              value={allCards.length}
              subtitle="Общее количество"
              icon="📚"
            />

            <StatsCard
              title="Избранные"
              value={favoritesCount}
              subtitle="Закреплённые"
              icon="⭐"
            />

            <StatsCard
              title="Теги"
              value={allTags.length}
              subtitle="Категории"
              icon="🏷️"
            />

            <StatsCard
              title="Сегодня"
              value={filteredCards.length}
              subtitle="Доступно сейчас"
              icon="⚡"
            />
          </div>

          <FilterBar
            filters={filters}
            setFilters={setFilters}
          />

          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3">
              {loading ? (
                <p className="text-zinc-400">
                  Загрузка...
                </p>
              ) : filteredCards.length === 0 ? (
                <EmptyState
                  onCreate={() =>
                    navigate("/cards/create")
                  }
                />
              ) : (
                <div className="grid grid-cols-3 gap-5">
                  {filteredCards.map((card) => (
                    <CardPreview
                      key={card._id}
                      card={card}
                      onClick={() =>
                        navigate(`/cards/${card._id}`)
                      }
                      onToggleFavorite={
                        handleToggleFavorite
                      }
                      onTagClick={toggleTag}
                    />
                  ))}
                </div>
              )}
            </div>

            <RightPanel
              filters={filters}
              activeTags={activeTags}
              total={filteredCards.length}
              favoritesCount={favoritesCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}