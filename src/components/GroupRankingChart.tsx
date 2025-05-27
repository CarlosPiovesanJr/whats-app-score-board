
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GroupRankingChartProps {
  data: Array<{
    group: string;
    average: number;
    totalRatings: number;
  }>;
}

export const GroupRankingChart = ({ data }: GroupRankingChartProps) => {
  // Ordenar por média decrescente
  const sortedData = [...data].sort((a, b) => b.average - a.average);
  
  return (
    <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Ranking dos Grupos</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={sortedData} 
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number"
            domain={[0, 10]}
            stroke="#666"
            tick={{ fill: '#666' }}
          />
          <YAxis 
            type="category"
            dataKey="group" 
            width={90}
            stroke="#666"
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value, name, props) => [
              `${Number(value).toFixed(1)}`,
              'Média',
              `Total de avaliações: ${props.payload.totalRatings}`
            ]}
          />
          <Bar 
            dataKey="average" 
            fill="#7c3aed"
            radius={[0, 4, 4, 0]}
            className="hover:opacity-80 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
