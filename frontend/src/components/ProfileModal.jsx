import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileModal({ open, onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.email?.[0]?.toUpperCase() || "U";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="
              fixed z-50 top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              w-full max-w-sm
              bg-zinc-900
              border border-white/10
              rounded-2xl
              p-6
              text-white
            "
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">👤 Профиль</h2>

              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* USER INFO */}
            <div className="mt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {initial}
              </div>

              <div>
                <p className="text-sm font-medium">
                  {user?.email || "user@mail.com"}
                </p>
                <p className="text-xs text-zinc-400">
                  Аккаунт пользователя
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 space-y-2">

              <button
                onClick={() => {
                  navigate("/");
                  onClose();
                }}
                className="w-full px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm"
              >
                🏠 Главная
              </button>

              <button
                onClick={() => {
                  navigate("/cards");
                  onClose();
                }}
                className="w-full px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm"
              >
                🃏 Карточки
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition text-sm"
              >
                🚪 Выйти
              </button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}