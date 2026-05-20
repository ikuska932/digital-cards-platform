
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import SortableCard from "../components/SortableCard";
import CardTemplates from "../components/CardTemplates";

import {
  getCards,
  deleteCard,
  reorderCards,
} from "../api/cards";

import { useAuth } from "../context/AuthContext";

export default function CardsPage() {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollInterval = useRef(null);

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTemplates, setShowTemplates] = useState(false);

  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [error, setError] = useState(null);

  /* =========================
     LOAD CARDS
  ========================= */

  const loadCards = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);

        const res = await getCards(token, {
          limit: 20,
          search,
          cursor: reset ? null : cursor,
        });

        setCards((prev) =>
          reset ? res.cards : [...prev, ...res.cards]
        );

        setCursor(res.nextCursor);
        setHasMore(res.hasMore);
      } catch {
        setError("Ошибка загрузки карточек");
      } finally {
        setLoading(false);
      }
    },
    [token, search, cursor]
  );

  useEffect(() => {
  loadCards(true);
}, [search, token]);
  /* =========================
     OPTIMISTIC UPDATE
  ========================= */

  const optimisticUpdateCard = (id, patch) => {
    setCards((prev) =>
      prev.map((card) =>
        card._id === id
          ? { ...card, ...patch }
          : card
      )
    );
  };

  /* =========================
     NAVIGATION TO CREATE PAGE
  ========================= */

  const handleCreate = () => {
    navigate("/cards/create");
  };

  const handleCreateFromTemplate = (template) => {
  navigate("/cards/create", {
    state: { template },
  });
};

  /* =========================
     DELETE
  ========================= */

  const handleDelete = (id) => {
    const removedCard = cards.find(
      (card) => card._id === id
    );

    if (!removedCard) return;

    setCards((prev) =>
      prev.filter((card) => card._id !== id)
    );

    deleteCard(token, id).catch(() => {
      alert("Ошибка удаления");

      setCards((prev) => [
        removedCard,
        ...prev,
      ]);
    });
  };

  /* =========================
     DND SORT
  ========================= */

  const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!over) return;
  if (active.id === over.id) return;
  const oldIndex = cards.findIndex(
    (card) => card._id === active.id
  );
  const newIndex = cards.findIndex(
    (card) => card._id === over.id
  );
  if (oldIndex === -1 || newIndex === -1) return;
  const newCards = arrayMove(cards, oldIndex, newIndex);
  setCards(newCards);
  reorderCards(
    token,
    newCards.map((card) => ({
      _id: card._id,
    }))
  ).catch(() => {
    alert("Ошибка сортировки");
  });
};

  /* =========================
     FILTER
  ========================= */

  const filteredCards = cards.filter((card) => {
  const text = search.toLowerCase();
  return (
    (card.title || "")
      .toLowerCase()
      .includes(text) ||
    (card.message || "")
      .toLowerCase()
      .includes(text)
  );
});

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Все карточки
          </h1>

          <p className="text-zinc-400 mt-2">
            Управляйте всеми созданными карточками
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() =>
              setShowTemplates((v) => !v)
            }
            className="px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition"
          >
            ✨ Шаблоны
          </button>

          <button
           type="button" onClick={handleCreate}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-500/20"
          >
            + Создать карточку
          </button>
        </div>
      </div>

      {/* TEMPLATES */}
      {showTemplates && (
        <CardTemplates
          onCreate={handleCreateFromTemplate}
        />
      )}

      {/* SEARCH */}
      <div>
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Поиск карточек..."
          className="w-full max-w-md px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10 outline-none focus:border-purple-400 transition"
        />
      </div>

      {/* LIST */}
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredCards.map(
            (card) => card._id
          )}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {filteredCards.map((card) => (
              <SortableCard
                key={card._id}
                card={card}
                onDelete={handleDelete}
                onOptimisticUpdate={
                  optimisticUpdateCard
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* STATES */}
      {loading && (
        <p className="text-sm text-zinc-500">
          Загрузка карточек...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading &&
        filteredCards.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-zinc-400">
              Карточки не найдены
            </p>

            <button
              onClick={handleCreate}
              className="mt-5 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 transition"
            >
              Создать первую карточку
            </button>
          </div>
        )}
    </div>
  );
}