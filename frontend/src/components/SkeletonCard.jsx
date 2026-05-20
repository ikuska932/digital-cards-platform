export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3 animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  );
}
