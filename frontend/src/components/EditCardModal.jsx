import { useState, useEffect } from "react";

export default function EditCardModal({
  card,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [pinned, setPinned] = useState(false);
  const [image, setImage] = useState("");

  useEffect(() => {
    setTitle(card.title || "");
    setMessage(card.message || "");
    setPinned(card.pinned || false);
    setImage(card.image || "");
  }, [card]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSave({
      ...card,
      title,
      message,
      pinned,
      image,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl h-[80vh] rounded-2xl shadow-xl p-6 flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Редактор</h2>

          <button onClick={onClose}>✕</button>
        </div>

        {/* TITLE */}
        <input
          className="w-full border rounded-lg px-4 py-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название"
        />

        {/* MESSAGE */}
        <textarea
          className="flex-1 w-full border rounded-lg px-4 py-3 resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Описание"
        />

        {/* IMAGE */}
        <input
          type="file"
          className="mt-3"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImage(URL.createObjectURL(file));
            }
          }}
        />

        {image && (
          <img src={image} className="mt-3 max-h-32 rounded-lg" />
        )}

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4">

          <button onClick={() => setPinned(!pinned)}>
            {pinned ? "⭐ В избранном" : "☆ В избранное"}
          </button>

          <div className="flex gap-3">
            <button onClick={onClose}>Отмена</button>

            <button
              onClick={handleSubmit}
              className="bg-purple-600 text-white px-5 py-2 rounded-lg"
            >
              Сохранить
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}