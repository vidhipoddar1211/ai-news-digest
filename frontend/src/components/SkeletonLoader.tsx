export function SkeletonArticleCard() {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-800"></div>
      <div className="p-6">
        <div className="flex space-x-4 mb-3">
          <div className="h-4 w-20 bg-gray-800 rounded"></div>
          <div className="h-4 w-24 bg-gray-800 rounded"></div>
        </div>
        <div className="h-6 bg-gray-800 rounded mb-3 w-3/4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-800 rounded"></div>
          <div className="h-4 bg-gray-800 rounded w-5/6"></div>
        </div>
        <div className="h-4 w-24 bg-gray-800 rounded"></div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 animate-pulse">
      <div className="h-8 bg-gray-800 rounded mb-4 w-1/2"></div>
      <div className="h-12 bg-gray-800 rounded"></div>
    </div>
  );
}
