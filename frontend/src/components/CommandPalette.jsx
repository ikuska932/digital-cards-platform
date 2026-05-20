import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const actions = useMemo(
    () => [
      {
        id: "home",
        title: "Перейти на главную",
        hint: "/",
        run: () => navigate("/"),
      },
      {
        id: "cards",
        title: "Открыть все карточки",
        hint: "/cards",
        run: () => navigate("/cards"),
      },
      {
        id: "templates",
        title: "Открыть шаблоны",
        hint: "/templates",
        run: () => navigate("/templates"),
      },
    ],
    [navigate]
  );

  const filtered = actions.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={() => onClose(false)}
    >
      <div className="mx-auto mt-24 w-full max-w-2xl px-4">
        <div
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#111113] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-white/10">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Введите команду..."
              className="w-full bg-transparent px-4 py-4 text-sm outline-none placeholder:text-zinc-500"
            />
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length ? (
              filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.run();
                    onClose(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm hover:bg-white/[0.05] transition"
                >
                  <span className="text-zinc-200">{item.title}</span>
                  <span className="text-xs text-zinc-500">{item.hint}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-sm text-zinc-500">
                Ничего не найдено
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}