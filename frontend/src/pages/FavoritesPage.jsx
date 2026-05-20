import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCards } from "../api/cards";
import { useAuth } from "../context/AuthContext";

export default function FavoritesPage() {
  const navigate = useNavigate();

  const { token } = useAuth();

  const [cards, setCards] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await getCards(token);
        console.log(data);

        const favorites = data.cards.filter(
        (card) => card.pinned
          );

        setCards(favorites);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#07070b] text-white p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-bold">
            ⭐ Избранное
          </h1>

          <p className="text-zinc-400 mt-3">
            Закреплённые карточки
          </p>
        </div>

        <button
          onClick={() => navigate("/cards/create")}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 transition"
        >
          + Новая карточка
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-zinc-400">
          Загрузка...
        </div>
      )}

      {/* EMPTY */}
      {!loading && cards.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-20 text-center">
          <div className="text-6xl mb-6">
            ⭐
          </div>

          <h2 className="text-3xl font-bold mb-3">
            Нет избранных карточек
          </h2>

          <p className="text-zinc-400">
            Закрепите карточку, чтобы она появилась здесь
          </p>
        </div>
      )}

      {/* GRID */}
      {!loading && cards.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">

          {cards.map((card) => (
            <div
              key={card._id}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#1e1b4b] p-6"
            >

              {/* IMAGE */}
              {card.image && (
                <div className="overflow-hidden rounded-2xl mb-5">
                  <img
                    src={card.image}
                    alt=""
                    className="w-full h-52 object-cover object-center"
                  />
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs">
                  ⭐ Избранное
                </div>

                <div className="text-zinc-500 text-sm">
                  {card.tags?.[0] || "карточка"}
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">
                {card.title}
              </h2>

              <p className="text-zinc-300 whitespace-pre-wrap line-clamp-5">
                {card.message}
              </p>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}