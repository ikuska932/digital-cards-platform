export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl">

        <h2 className="text-lg font-semibold text-gray-900">
          Удалить карточку?
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Это действие нельзя отменить
        </p>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700"
          >
            Отмена
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Удалить
          </button>

        </div>
      </div>
    </div>
  );
}