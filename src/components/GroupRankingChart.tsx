
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GroupRankingChartProps {
  data: Array<{
    group: string;
    average: number;
    totalRatings: number;
  }>;
}

export const GroupRankingChart = ({ data }: GroupRankingChartProps) => {
  console.log('GroupRankingChart data received:', data);
  
  // Filtrar e validar dados de forma mais rigorosa
  const validData = data
    .filter(item => {
      const isValidGroup = item.group && typeof item.group === 'string' && item.group.trim() !== '';
      const isValidAverage = typeof item.average === 'number' && 
                           !isNaN(item.average) && 
                           isFinite(item.average) && 
                           item.average >= 0 && 
                           item.average <= 10;
      const isValidRatings = typeof item.totalRatings === 'number' && 
                            !isNaN(item.totalRatings) && 
                            isFinite(item.totalRatings) && 
                            item.totalRatings >= 0;
      
      console.log(`Validating item:`, item, { isValidGroup, isValidAverage, isValidRatings });
      return isValidGroup && isValidAverage && isValidRatings;
    })
    .map(item => ({
      group: item.group,
      average: Number(item.average.toFixed(1)), // Garantir que é um número válido
      totalRatings: item.totalRatings
    }));
  
  const sortedData = [...validData].sort((a, b) => b.average - a.average);
  
  console.log('GroupRankingChart processed data:', sortedData);
  
  // Se não há dados válidos, mostrar mensagem
  if (sortedData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ranking dos Grupos</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Nenhum dado disponível para exibir
        </div>
      </div>
    );
  }
  
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
