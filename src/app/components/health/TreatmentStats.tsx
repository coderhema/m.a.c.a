export default function TreatmentStats() {
  return (
    <div className="mb-24">
      <h2 className="text-white text-lg font-bold mb-4">My Treatment</h2>
      <div className="bg-[#1C1C1E] rounded-3xl p-6 flex justify-between items-center bg-opacity-50">
        
        {/* Chart 1 */}
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 flex items-center justify-center">
            {/* Simple SVG Donut Chart */}
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                className="text-gray-700"
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-red-500"
                strokeDasharray="25, 100"
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-white text-sm font-semibold">25%</div>
            <div className="text-gray-400 text-xs">Affected cells</div>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                className="text-gray-700"
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-blue-500"
                strokeDasharray="75, 100"
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-white text-sm font-semibold">75%</div>
            <div className="text-gray-400 text-xs">Normal cells</div>
          </div>
        </div>

      </div>
    </div>
  );
}
