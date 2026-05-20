import React from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useSettings } from "../context/SettingsContext";

export default function Sidebar() {
  const navigate = useNavigate();

  const location = useLocation();

  const { settings } = useSettings();

  const menuItems = [
    {
      name: "Главная",
      path: "/",
      icon: "🏠",
    },
    {
      name: "Все карточки",
      path: "/cards",
      icon: "🃏",
    },
    {
      name: "Шаблоны",
      path: "/templates",
      icon: "📁",
    },
    {
      name: "Избранное",
      path: "/favorites",
      icon: "⭐",
    },
    {
      name: "Настройки",
      path: "/settings",
      icon: "⚙️",
    },
  ];

  const tags = [
    "работа",
    "идея",
    "ежедневно",
    "важное",
    "личное",
  ];

  const accentClasses = {
    purple:
      "bg-purple-600 shadow-purple-500/10",
    ocean:
      "bg-cyan-500 shadow-cyan-500/10",
    nature:
      "bg-emerald-500 shadow-emerald-500/10",
    rose:
      "bg-rose-500 shadow-rose-500/10",
  };

  const userGradient = {
    purple:
      "from-fuchsia-600 to-purple-700",
    ocean:
      "from-cyan-500 to-blue-700",
    nature:
      "from-emerald-500 to-green-700",
    rose:
      "from-rose-500 to-pink-700",
  };

  return (
    <aside className="relative w-[280px] min-h-screen border-r border-white/10 bg-black/30 backdrop-blur-xl p-6">
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">
          Digital Cards
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Premium Dashboard
        </p>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() =>
                navigate(item.path)
              }
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                isActive
                  ? `${
                      accentClasses[
                        settings?.theme
                      ] ||
                      accentClasses.purple
                    } text-white shadow-lg`
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span>{item.icon}</span>

              <span className="text-sm font-medium">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tags */}
      <div className="mt-10">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
          Теги
        </h3>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300 transition hover:border-purple-400/20 hover:bg-purple-500/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* User block */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white ${
                userGradient[
                  settings?.theme
                ] || userGradient.purple
              }`}
            >
              {settings?.name?.[0]?.toUpperCase() ||
                "A"}
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                {settings?.name || "Алиса"}
              </p>

              <p className="text-xs text-zinc-500">
                Premium User
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}