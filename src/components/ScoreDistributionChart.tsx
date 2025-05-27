
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ScoreDistributionChartProps {
  data: Array<{
    score: number;
    count: number;
  }>;
}

export const ScoreDistributionChart = ({ data }: ScoreDistributionChartProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Notas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="score" 
            stroke="#666"
            tick={{ fill: '#666' }}
          />
          <YAxis 
            stroke="#666"
            tick={{ fill: '#666' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => [`${value} avaliações`, 'Quantidade']}
            labelFormatter={(label) => `Nota: ${label}`}
          />
          <Bar 
            dataKey="count" 
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
