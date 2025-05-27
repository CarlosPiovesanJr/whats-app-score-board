
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ScoreDistributionChartProps {
  data: Array<{
    score: number;
    count: number;
  }>;
}

export const ScoreDistributionChart = ({ data }: ScoreDistributionChartProps) => {
  console.log('ScoreDistributionChart data received:', data);
  
  const validData = data
    .filter(item => {
      const isValidScore = typeof item.score === 'number' && 
                          !isNaN(item.score) && 
                          isFinite(item.score) &&
                          item.score >= 0 && 
                          item.score <= 100;
      const isValidCount = typeof item.count === 'number' && 
                          !isNaN(item.count) && 
                          isFinite(item.count) &&
                          item.count >= 0;
      
      return isValidScore && isValidCount;
    })
    .map(item => ({
      score: item.score,
      count: Math.max(0, item.count)
    }));

  console.log('ScoreDistributionChart processed data:', validData);

  if (validData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-purple-200 dark:border-gray-600 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Distribuição de Notas (%)</h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          Nenhum dado disponível para exibir
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-purple-200 dark:border-gray-600 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Distribuição de Notas (%)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={validData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-600" />
          <XAxis 
            dataKey="score" 
            stroke="#666"
            tick={{ fill: '#666' }}
            className="dark:stroke-gray-300"
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            stroke="#666"
            tick={{ fill: '#666' }}
            className="dark:stroke-gray-300"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => [`${value} avaliações`, 'Quantidade']}
            labelFormatter={(label) => `Nota: ${label}%`}
          />
          <Bar 
            dataKey="count" 
            fill="#9333ea"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
