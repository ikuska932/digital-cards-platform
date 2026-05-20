export default function Card({ card }) {
  return (
    <div className="border p-4 mb-4 rounded">
      <h3 className="font-bold">{card.title}</h3>
      <p>{card.description}</p>
    </div>
  );
}