
import { MetricsCard } from "@/components/MetricsCard";
import { ScoreDistributionChart } from "@/components/ScoreDistributionChart";
import { Users, ChartBar, MessageSquare, Table } from "lucide-react";
import { useSatisfacaoData } from "@/hooks/useSatisfacaoData";
import { processMetricsData } from "@/utils/processData";

export const WhatsAppView = () => {
  const { data, isLoading, error } = useSatisfacaoData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 dark:text-purple-400">Carregando dados dos grupos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-8">
        <p>Erro ao carregar dados dos grupos: {error.message}</p>
      </div>
    );
  }

  const processedData = data ? processMetricsData(data) : {
    totalRatings: 0,
    uniqueVoters: 0,
    averageScore: 0,
    bestGroup: "N/A",
    activeGroups: 0,
    scoreDistribution: [],
    groupRankings: [],
    bestGroupAverage: 0
  };

  return (
    <div className="space-y-8">
      {/* Cards de Métricas dos Grupos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total de Avaliações"
          value={processedData.totalRatings.toLocaleString()}
          subtitle={`${processedData.uniqueVoters > 0 ? processedData.uniqueVoters + ' pessoas votaram' : 'Registradas'}`}
          icon={<Table size={20} />}
          trend={processedData.totalRatings > 0 ? { value: 12, isPositive: true } : undefined}
        />
        <MetricsCard
          title="Satisfação Média"
          value={`${processedData.averageScore.toFixed(1)}%`}
          subtitle="De 0% a 100%"
          icon={<ChartBar size={20} />}
          trend={processedData.averageScore > 0 ? { value: 5, isPositive: true } : undefined}
        />
        <MetricsCard
          title="Melhor Grupo"
          value={processedData.bestGroup}
          subtitle={`Média: ${processedData.bestGroupAverage}%`}
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
      <div>
        <ScoreDistributionChart data={processedData.scoreDistribution} />
      </div>

      {/* Ranking dos Grupos */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-purple-200 dark:border-gray-600 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ranking dos Grupos</h3>
        <div className="space-y-3">
          {processedData.groupRankings.slice(0, 10).map((group, index) => (
            <div key={group.group} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">{group.group}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{group.totalRatings} avaliações</div>
                </div>
              </div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {group.average}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas Adicionais */}
      {processedData.totalRatings > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-purple-200 dark:border-gray-600 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resumo Executivo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round((processedData.scoreDistribution.filter(d => d.score >= 80).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Avaliações Positivas (80-100%)</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.round((processedData.scoreDistribution.filter(d => d.score >= 60 && d.score < 80).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Avaliações Neutras (60-79%)</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {Math.round((processedData.scoreDistribution.filter(d => d.score < 60).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Avaliações Negativas (0-59%)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
