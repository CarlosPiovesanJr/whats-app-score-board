
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ScoreDistributionChartProps {
  data: Array<{
    score: number;
    count: number;
  }>;
}

export const ScoreDistributionChart = ({
  data,
}: ScoreDistributionChartProps) => {
  console.log("ScoreDistributionChart data received:", data);

  const validData = data
    .filter((item) => {
      const isValidScore =
        typeof item.score === "number" &&
        !isNaN(item.score) &&
        isFinite(item.score) &&
        item.score >= 20 &&
        item.score <= 100;
      const isValidCount =
        typeof item.count === "number" &&
        !isNaN(item.count) &&
        isFinite(item.count) &&
        item.count >= 0;

      return isValidScore && isValidCount;
    })
    .map((item) => ({
      score: item.score,
      count: Math.max(0, item.count),
    }));

  console.log("ScoreDistributionChart processed data:", validData);

  if (validData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Distribuição de Notas (%)
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
              📊
            </div>
            <p>Nenhum dado disponível para exibir</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Distribuição de Notas (%)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={validData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            className="dark:stroke-gray-600"
          />
          <XAxis
            dataKey="score"
            stroke="#6b7280"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            className="dark:stroke-gray-400"
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            className="dark:stroke-gray-400"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
            }}
            formatter={(value) => [`${value} avaliações`, "Quantidade"]}
            labelFormatter={(label) => `Nota: ${label}%`}
          />
          <Bar
            dataKey="count"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
