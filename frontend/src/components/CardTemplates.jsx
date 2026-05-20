import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cardTemplates } from "../data/cardTemplates";
import { templateCategories } from "../data/templateCategories";

const themes = {
  idea: "from-purple-600 via-pink-500 to-orange-400",
  work: "from-blue-600 via-indigo-500 to-purple-500",
  daily: "from-emerald-500 via-teal-400 to-cyan-400",
  personal: "from-pink-500 via-rose-400 to-red-400",
  default: "from-zinc-700 to-zinc-800",
};

export default function CardTemplates({ onCreate }) {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [flying, setFlying] = useState(null);

  const filtered =
    category === "all"
      ? cardTemplates
      : cardTemplates.filter((t) => t.category === category);

  const handleCreate = (tpl) => {
    setFlying(tpl);

    setTimeout(() => {
      onCreate(tpl);
    }, 500);
  };

  return (
    <div className="mb-12">

      {/* HEADER */}
      <h3 className="text-sm font-semibold text-zinc-400 mb-5">
        ✨ Шаблоны
      </h3>

      {/* КАТЕГОРИИ */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {templateCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm transition border
              ${
                category === cat.id
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-white/[0.05] text-zinc-300 border-white/10 hover:bg-white/[0.1]"
              }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-[1fr_420px] gap-8">

        {/* LEFT LIST */}
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((tpl) => {
            const bg =
              themes[tpl.category] || themes.default;

            return (
              <motion.div
                key={tpl.id}
                onClick={() => {
                  setSelected(tpl);
                  handleCreate(tpl);
                }}
                onMouseEnter={() => setSelected(tpl)}
                whileHover={{ scale: 1.04, y: -4 }}
                className={`cursor-pointer rounded-xl p-4 text-white bg-gradient-to-br ${bg}`}
              >
                <div className="text-xl mb-2">
                  {tpl.icon || "✨"}
                </div>

                <h4 className="text-sm font-semibold">
                  {tpl.title}
                </h4>

                <p className="text-xs mt-2 opacity-80 line-clamp-3">
                  {tpl.message}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="relative">

          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl p-6 text-white bg-gradient-to-br ${
                  themes[selected.category] || themes.default
                } shadow-xl`}
              >
                <div className="text-2xl mb-3">
                  {selected.icon || "✨"}
                </div>

                <h2 className="text-xl font-bold">
                  {selected.title}
                </h2>

                <p className="mt-4 text-sm opacity-90 whitespace-pre-line">
                  {selected.message}
                </p>

                <div className="mt-6">
                  <span className="text-xs bg-black/30 px-3 py-1 rounded-xl">
                    #{selected.category}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* 🚀 FLYING CARD */}
      <AnimatePresence>
        {flying && (
          <motion.div
            initial={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            animate={{
              scale: 1.3,
              y: -200,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="bg-purple-600 text-white px-6 py-4 rounded-xl shadow-xl">
              ✨ Создаём карточку...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}