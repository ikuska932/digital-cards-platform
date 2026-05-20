import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import { useSettings } from "../context/SettingsContext";

export default function Layout() {
  const { settings } = useSettings();

  const glowColors = {
    purple: "bg-purple-600/10",
    ocean: "bg-cyan-500/10",
    nature: "bg-emerald-500/10",
    rose: "bg-rose-500/10",
  };

  return (
    <div className="min-h-screen flex bg-[#07070b] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 relative overflow-hidden">

        {/* background glow */}
        <div
          className={`absolute top-0 right-0 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none ${
            glowColors[settings?.theme] ||
            "bg-purple-600/10"
          }`}
        />

        {/* page content */}
        <div className="relative z-10 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}