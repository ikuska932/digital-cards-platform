import api from "./api";

// 🔐 login
export const loginRequest = (data) => {
  return api.post("/auth/login", data);
};

// 📝 register
export const registerRequest = (data) => {
  return api.post("/auth/register", data);
};

// 👤 get current user
export const getMe = () => {
  return api.get("/auth/me");
};
