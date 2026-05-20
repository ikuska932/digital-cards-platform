import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./components/Layout"; // 🔥 ВАЖНО
import CreateCardPage from "./pages/CreateCardPage";
import CardsPage from "./pages/CardsPage";
import HomePage from "./pages/HomePage";
import TemplatesPage from "./pages/TemplatesPage";
import FavoritesPage from "./pages/FavoritesPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { useAuth } from "./context/AuthContext";

function App() {
  const { token } = useAuth();

  return (
    <Routes>

      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="/cards/create" element={<CreateCardPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      
      <Route
        path="*"
        element={<Navigate to={token ? "/" : "/login"} replace />}
      />

    </Routes>
  );
}

export default App;