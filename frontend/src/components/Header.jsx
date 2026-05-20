import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow">
      <div className="max-w-3xl mx-auto p-4 flex justify-between items-center">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/cards")}
        >
          🎴 Digital Cards
        </h1>

        {user && (
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Выйти
          </button>
        )}
      </div>
    </header>
  );
}
