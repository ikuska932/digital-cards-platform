import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCardById, updateCard } from "../api/cards";
import { useAuth } from "../context/AuthContext";

export default function EditCardPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  //  загрузка карточки
  useEffect(() => {
    const loadCard = async () => {
      try {
        const { data } = await getCardById(token, id);
        setTitle(data.title);
        setMessage(data.message || "");
      } catch {
        alert("Не удалось загрузить карточку");
        navigate("/cards");
      } finally {
        setLoading(false);
      }
    };

    loadCard();
  }, [id, token, navigate]);

  //  сохранение
  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateCard(token, id, { title, message });
      navigate("/cards");
    } catch {
      alert("Ошибка обновления");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Загрузка...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Редактировать карточку
      </h1>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          className="w-full border p-2 rounded text-lg"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded min-h-[160px]"
          placeholder="Сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          disabled={saving}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
