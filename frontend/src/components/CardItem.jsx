export default function CardItem({ card }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3">
      <h3 className="font-semibold text-lg mb-1">
        {card.title}
      </h3>
      <p className="text-gray-700">
        {card.message}
      </p>
    </div>
  );
}
