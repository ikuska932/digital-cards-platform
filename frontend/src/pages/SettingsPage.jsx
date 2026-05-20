import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

const themePresets = [
  {
    id: "purple",
    name: "Purple",
    emoji: "💜",
    gradient: "from-fuchsia-600 to-purple-700",
    accent: "#9333ea",
  },
  {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    gradient: "from-cyan-500 to-blue-700",
    accent: "#0ea5e9",
  },
  {
    id: "nature",
    name: "Nature",
    emoji: "🌿",
    gradient: "from-emerald-500 to-green-700",
    accent: "#10b981",
  },
  {
    id: "rose",
    name: "Rose",
    emoji: "🌹",
    gradient: "from-rose-500 to-pink-700",
    accent: "#e11d48",
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();

  const {
    settings,
    updateSettings,
    deleteAccount,
  } = useSettings();

  const [name, setName] = useState("Алиса");
  const [email, setEmail] = useState("gptmybf@gmail.com");
  const [theme, setTheme] = useState("purple");

  const [pushEnabled, setPushEnabled] =
    useState(true);

  const [emailEnabled, setEmailEnabled] =
    useState(false);

  const [autoSave, setAutoSave] =
    useState(true);

  const [compactMode, setCompactMode] =
    useState(false);

  const [savedMessage, setSavedMessage] =
    useState("");

  /* =========================
     LOAD SETTINGS
  ========================= */

  useEffect(() => {
    if (!settings) return;

    setName(settings.name || "Алиса");

    setEmail(
      settings.email || "gptmybf@gmail.com"
    );

    setTheme(settings.theme || "purple");

    setPushEnabled(
      settings.pushEnabled ?? true
    );

    setEmailEnabled(
      settings.emailEnabled ?? false
    );

    setAutoSave(
      settings.autoSave ?? true
    );

    setCompactMode(
      settings.compactMode ?? false
    );
  }, [settings]);

  /* =========================
     COMPACT MODE
  ========================= */

  useEffect(() => {
    document.body.classList.toggle(
      "compact-mode",
      compactMode
    );
  }, [compactMode]);

  const currentTheme =
    themePresets.find(
      (item) => item.id === theme
    ) || themePresets[0];

  /* =========================
     SAVE
  ========================= */

  const handleSave = () => {
    const newSettings = {
      name,
      email,
      theme,
      pushEnabled,
      emailEnabled,
      autoSave,
      compactMode,
    };

    updateSettings(newSettings);

    setSavedMessage(
      "Настройки сохранены"
    );

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */

  const handleChangePassword = () => {
    const oldPassword = prompt(
      "Введите старый пароль"
    );

    if (!oldPassword) return;

    const newPassword = prompt(
      "Введите новый пароль"
    );

    if (!newPassword) return;

    if (newPassword.length < 4) {
      alert(
        "Пароль должен быть минимум 4 символа"
      );

      return;
    }

    localStorage.setItem(
      "userPassword",
      newPassword
    );

    alert("Пароль изменён");
  };

  /* =========================
     DELETE ACCOUNT
  ========================= */

  const handleDeleteAccount = () => {
    const confirmDelete =
      window.confirm(
        "Удалить аккаунт?"
      );

    if (!confirmDelete) return;

    deleteAccount();

    navigate("/register");
  };

  /* =========================
     TOGGLE
  ========================= */

  const Toggle = ({
    enabled,
    onClick,
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`h-7 w-14 rounded-full p-1 transition ${
          enabled
            ? "bg-purple-600"
            : "bg-zinc-700"
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white transition ${
            enabled
              ? "translate-x-7"
              : "translate-x-0"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-white p-8">

      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10">

        <div
          className={`absolute right-0 top-0 h-[600px] w-[600px] rounded-full blur-[180px] ${
            theme === "purple"
              ? "bg-purple-700/20"
              : theme === "ocean"
              ? "bg-cyan-500/20"
              : theme === "nature"
              ? "bg-emerald-500/20"
              : "bg-rose-500/20"
          }`}
        />

        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />
      </div>

      {/* HEADER */}
      <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">

        <div>
          <h1 className="flex items-center gap-4 text-5xl font-bold tracking-tight">
            ⚙️ Настройки
          </h1>

          <p className="mt-3 text-lg text-zinc-400">
            Управление профилем
          </p>
        </div>

        <div className="flex items-center gap-4">

          {savedMessage && (
            <div className="rounded-2xl border border-green-400/20 bg-green-500/10 px-5 py-3 text-sm text-green-300">
              {savedMessage}
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-purple-600 px-6 py-3 font-medium transition hover:bg-purple-500"
          >
            Сохранить изменения
          </button>

        </div>
      </div>

      <div className="space-y-8">

        {/* PROFILE */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <div className="mb-8 flex items-center gap-5">

            <div
              className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${currentTheme.gradient} text-3xl font-bold`}
            >
              {name?.[0]?.toUpperCase() || "A"}
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {name}
              </h2>

              <p className="mt-1 text-zinc-400">
                Premium User
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Имя
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Email
              </label>

              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              />
            </div>

          </div>
        </section>

        {/* THEMES */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-bold">
            🎨 Внешний вид
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {themePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  setTheme(preset.id)
                }
                className={`rounded-2xl border bg-gradient-to-br ${preset.gradient} p-5 text-left transition hover:-translate-y-1 ${
                  theme === preset.id
                    ? "border-white shadow-lg"
                    : "border-white/10"
                }`}
              >

                <div className="mb-8 h-20 rounded-xl bg-black/30" />

                <div className="flex items-center justify-between">

                  <div>
                    <div className="font-semibold">
                      {preset.name}
                    </div>

                    <div className="mt-1 text-sm text-white/70">
                      {preset.emoji} Theme
                    </div>
                  </div>

                  {theme === preset.id && (
                    <div className="rounded-full bg-white/20 px-3 py-1 text-xs">
                      active
                    </div>
                  )}

                </div>

              </button>
            ))}

          </div>
        </section>

        {/* APP SETTINGS */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-bold">
            🧩 Параметры приложения
          </h2>

          <div className="space-y-5">

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-5">

              <div>
                <h3 className="font-semibold">
                  Автосохранение
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  Автоматически сохранять изменения
                </p>
              </div>

              <Toggle
                enabled={autoSave}
                onClick={() =>
                  setAutoSave(!autoSave)
                }
              />

            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-5">

              <div>
                <h3 className="font-semibold">
                  Компактный режим
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  Уменьшить размер карточек
                </p>
              </div>

              <Toggle
                enabled={compactMode}
                onClick={() =>
                  setCompactMode(!compactMode)
                }
              />

            </div>

          </div>
        </section>

        {/* SECURITY */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="mb-6 text-2xl font-bold">
            🔒 Безопасность
          </h2>

          <div className="space-y-5">

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

              <h3 className="font-semibold">
                Смена пароля
              </h3>

              <button
                type="button"
                onClick={handleChangePassword}
                className="mt-4 rounded-xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10"
              >
                Изменить пароль
              </button>

            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">

              <h3 className="font-semibold text-red-300">
                Опасная зона
              </h3>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="mt-4 rounded-xl bg-red-600 px-5 py-3 transition hover:bg-red-500"
              >
                Удалить аккаунт
              </button>

            </div>

          </div>
        </section>

      </div>
    </div>
  );
}