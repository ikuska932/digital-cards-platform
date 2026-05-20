import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const templates = [
  {
    title: "Daily Note",
    category: "Ежедневно",
    icon: "📝",
    color: "from-cyan-500/20 to-blue-500/10",
    message: "Что сделал сегодня?\n—\n—\n—",
  },

  {
    title: "Ретроспектива",
    category: "Работа",
    icon: "🚀",
    color: "from-orange-500/20 to-yellow-500/10",
    message:
      "👍 Что было хорошо:\n👎 Что было плохо:\n💡 Что улучшить:",
  },

  {
    title: "Идея",
    category: "Идея",
    icon: "💡",
    color: "from-fuchsia-500/20 to-pink-500/10",
    message:
      "Суть идеи:\nПочему это важно:\nСледующий шаг:",
  },

  {
    title: "Moodboard",
    category: "Creative",
    icon: "🎨",
    color: "from-pink-500/20 to-purple-500/10",
    message:
      "Настроение:\nРеференсы:\nЦвета:\nАссоциации:",
  },

  {
    title: "Meeting Notes",
    category: "Работа",
    icon: "📌",
    color: "from-emerald-500/20 to-green-500/10",
    message:
      "Участники:\nОсновные идеи:\nЗадачи:\nСледующий созвон:",
  },

  {
    title: "Личное",
    category: "Личное",
    icon: "❤️",
    color: "from-rose-500/20 to-red-500/10",
    message:
      "Что чувствую:\nЧто произошло:\nЧто хочу изменить:",
  },
];

export default function TemplatesPage() {
  const navigate = useNavigate();

  const handleSelect = (tpl) => {
    navigate("/cards/create", {
      state: {
        template: tpl,
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white px-10 py-10">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">

        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-purple-700/20 blur-[180px]" />

        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[180px]" />

      </div>

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-10 mb-10">

        <div className="absolute -top-32 right-0 w-[400px] h-[400px] rounded-full bg-fuchsia-600/20 blur-[140px]" />

        <div className="relative z-10">

          <p className="text-purple-400 mb-3 font-medium">
            ✨ Creative Workspace
          </p>

          <h1 className="text-6xl font-black leading-[1.05] max-w-4xl">
            Выберите шаблон
            <br />
            для вашей карточки
          </h1>

          <p className="mt-5 text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Красивые шаблоны для идей, заметок,
            daily-планирования, moodboard,
            личных записей и productivity.
          </p>

          <div className="flex gap-4 mt-8">

            <button
              onClick={() => navigate("/create")}
              className="px-7 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 transition text-lg font-medium shadow-[0_0_40px_rgba(168,85,247,0.35)]"
            >
              Создать с нуля
            </button>

            <button
              onClick={() => navigate("/cards")}
              className="px-7 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-lg"
            >
              Мои карточки
            </button>

          </div>

        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div className="flex flex-wrap gap-3 mb-10">

        {[
          "✨ Все",
          "💼 Работа",
          "💡 Идеи",
          "❤️ Личное",
          "🎨 Creative",
          "📌 Productivity",
        ].map((pill) => (
          <button
            key={pill}
            className="px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-purple-500/20 hover:border-purple-400/40 transition"
          >
            {pill}
          </button>
        ))}

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

        {templates.map((tpl, i) => (
          <motion.div
            key={i}

            whileHover={{
              y: -8,
              scale: 1.02,
            }}

            whileTap={{
              scale: 0.98,
            }}

            transition={{
              duration: 0.2,
            }}

            onClick={() => handleSelect(tpl)}

            className="
              group
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-white/10
              bg-white/[0.03]
              p-6
              cursor-pointer
              transition-all
              duration-300
              hover:border-purple-400/40
              hover:bg-white/[0.05]
              hover:shadow-[0_0_60px_rgba(168,85,247,0.12)]
            "
          >

            {/* GLOW */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">

              <div className="absolute -top-10 right-0 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />

            </div>

            {/* PREVIEW */}
            <div
              className={`relative h-36 rounded-2xl bg-gradient-to-br ${tpl.color} border border-white/10 overflow-hidden mb-5`}
            >

              <div className="absolute inset-0 bg-black/20" />

              <div className="relative z-10 p-5">

                <div className="flex items-center justify-between mb-4">

                  <div className="text-2xl">
                    {tpl.icon}
                  </div>

                  <div className="text-xs px-3 py-1 rounded-full bg-black/30 border border-white/10 text-zinc-300">
                    {tpl.category}
                  </div>

                </div>

                <div className="space-y-2">

                  <div className="h-3 w-24 rounded bg-white/30" />

                  <div className="h-3 w-full rounded bg-white/10" />

                  <div className="h-3 w-2/3 rounded bg-white/10" />

                </div>

              </div>

            </div>

            {/* CONTENT */}
            <div className="relative z-10">

              <h3 className="text-2xl font-bold mb-3">
                {tpl.title}
              </h3>

              <p className="text-zinc-400 whitespace-pre-wrap leading-relaxed line-clamp-4">
                {tpl.message}
              </p>

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-6">

                <div className="text-sm text-zinc-500">
                  Нажмите для использования
                </div>

                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.03] group-hover:bg-purple-500/20 transition">
                  →
                </div>

              </div>

            </div>

          </motion.div>
        ))}

      </div>
    </div>
  );
}