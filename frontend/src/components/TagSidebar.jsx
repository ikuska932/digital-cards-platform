export default function TagSidebar({
  tags,
  activeTags,
  setActiveTags,
}) {
  const toggleTag = (tag) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter((t) => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  return (
    <div className="w-64 border-r border-white/10 p-4 hidden md:block">

      <h3 className="text-sm text-zinc-400 mb-4 flex items-center gap-2">
        🏷 Теги
      </h3>

      {tags.length === 0 ? (
        <p className="text-xs text-zinc-500">
          Нет тегов<br />
          <span className="text-zinc-600">
            добавь #теги в карточки
          </span>
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`
                px-2 py-1 text-xs rounded
                transition
                ${activeTags.includes(tag)
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"}
              `}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* 🔥 quick filters */}
      <div className="mt-8 space-y-2 text-xs text-zinc-500">
        <p>Фильтры:</p>

        <button
          onClick={() => setActiveTags([])}
          className="block text-left hover:text-white"
        >
          Сбросить всё
        </button>
      </div>
    </div>
  );
}