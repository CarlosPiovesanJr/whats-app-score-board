
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsCard } from "@/components/MetricsCard";
import { ScoreDistributionChart } from "@/components/ScoreDistributionChart";
import { Users, ChartBar, MessageSquare, Table } from "lucide-react";
import { useSatisfacaoData } from "@/hooks/useSatisfacaoData";
import { processMetricsData } from "@/utils/processData";

const Index = () => {
  const { data, isLoading, error } = useSatisfacaoData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Erro ao carregar dados: {error.message}</p>
        </div>
      </div>
    );
  }

  const processedData = data ? processMetricsData(data) : {
    totalRatings: 0,
    averageScore: 0,
    bestGroup: "N/A",
    activeGroups: 0,
    scoreDistribution: [],
    groupRankings: [],
    bestGroupAverage: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total de Avaliações"
            value={processedData.totalRatings.toLocaleString()}
            subtitle="Registradas"
            icon={<Table size={20} />}
            trend={processedData.totalRatings > 0 ? { value: 12, isPositive: true } : undefined}
          />
          <MetricsCard
            title="Nota Média Geral"
            value={processedData.averageScore.toFixed(1)}
            subtitle="De 0 a 10"
            icon={<ChartBar size={20} />}
            trend={processedData.averageScore > 0 ? { value: 5, isPositive: true } : undefined}
          />
          <MetricsCard
            title="Melhor Grupo"
            value={processedData.bestGroup}
            subtitle={`Média: ${processedData.bestGroupAverage}`}
            icon={<MessageSquare size={20} />}
          />
          <MetricsCard
            title="Grupos Ativos"
            value={processedData.activeGroups}
            subtitle="Com avaliações"
            icon={<Users size={20} />}
          />
        </div>

        {/* Gráfico de Distribuição */}
        <div className="mb-8">
          <ScoreDistributionChart data={processedData.scoreDistribution} />
        </div>

        {/* Estatísticas Adicionais */}
        {processedData.totalRatings > 0 && (
          <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo Executivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((processedData.scoreDistribution.filter(d => d.score >= 8).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Avaliações Positivas (8-10)</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round((processedData.scoreDistribution.filter(d => d.score >= 6 && d.score < 8).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Avaliações Neutras (6-7)</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {Math.round((processedData.scoreDistribution.filter(d => d.score < 6).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Avaliações Negativas (0-5)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
