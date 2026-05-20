import { useEffect, useState } from "react";
import { getCards } from "../api/cards";
import { useAuth } from "../context/AuthContext";

export function useHomeCards() {
  const { token } = useAuth();

  const [pinned, setPinned] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        setLoading(true);

        const res = await getCards(token, {
          limit: 8,
          sort: "updatedAt:desc",
        });

        const pinnedCards = res.cards.filter(c => c.pinned);
        const recentCards = res.cards.filter(c => !c.pinned);

        setPinned(pinnedCards.slice(0, 4));
        setRecent(recentCards.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  return { pinned, recent, loading };
}
