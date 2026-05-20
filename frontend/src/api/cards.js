import axios from "axios";

const API_URL = "http://localhost:5000/api/cards";

// 🔹 получить карточки
export const getCards = async (token) => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 🔹 создать карточку
export const createCard = async (token, data) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 🔹 удалить карточку
export const deleteCard = async (token, id) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCard = async (token, id, data) => {
  const res = await axios.put(
    `${API_URL}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// 🔹 сохранить порядок карточек
export const reorderCards = async (token, items) => {
  await axios.put(
    `${API_URL}/reorder`,
    { items },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

