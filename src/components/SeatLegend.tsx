export const SeatLegend: React.FC = () => (
  <div className="mt-6 flex justify-center gap-6">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-gray-500 rounded" />
      <span>Available</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-cyan-900 bg-cyan-900 rounded" />
      <span>Selected</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-gray-400 bg-gray-400 rounded" />
      <span>Occupied</span>
    </div>
  </div>
);
