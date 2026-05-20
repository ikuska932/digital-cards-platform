import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    name: "Алиса",
    email: "",
    theme: "purple",
  });

  useEffect(() => {
    const saved = localStorage.getItem("digitalCardsSettings");

    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);

    localStorage.setItem(
      "digitalCardsSettings",
      JSON.stringify(newSettings)
    );
  };

  const deleteAccount = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("digitalCardsSettings");

    window.location.href = "/login";
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        deleteAccount,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () =>
  useContext(SettingsContext);