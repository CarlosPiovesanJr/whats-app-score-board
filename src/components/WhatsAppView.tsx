
import { MetricsCard } from "@/components/MetricsCard";
import { ScoreDistributionChart } from "@/components/ScoreDistributionChart";
import { Users, ChartBar, MessageSquare, Table, TrendingUp } from "lucide-react";
import { useSatisfacaoData } from "@/hooks/useSatisfacaoData";
import { processMetricsData } from "@/utils/processData";

export const WhatsAppView = () => {
  const { data, isLoading, error } = useSatisfacaoData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dados dos grupos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
        </div>
        <p className="text-red-600 dark:text-red-400">Erro ao carregar dados dos grupos: {error.message}</p>
      </div>
    );
  }

  const processedData = data ? processMetricsData(data) : {
    totalRatings: 0,
    uniqueVoters: 0,
    csatScore: 0,
    bestGroup: "N/A",
    activeGroups: 0,
    scoreDistribution: [],
    groupRankings: [],
    bestGroupCsat: 0,
    negativeRatings: 0,
    positiveRatings: 0,
    neutralRatings: 0
  };

  return (
    <div className="space-y-8">
      {/* Cards de Métricas dos Grupos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total de Avaliações"
          value={processedData.totalRatings.toLocaleString()}
          subtitle={`${processedData.uniqueVoters > 0 ? processedData.uniqueVoters + ' pessoas votaram' : 'Registradas'}`}
          icon={<Table size={18} />}
          trend={processedData.totalRatings > 0 ? { value: 12, isPositive: true } : undefined}
        />
        <MetricsCard
          title="CSAT Score"
          value={`${processedData.csatScore.toFixed(1)}%`}
          subtitle="Satisfação geral"
          icon={<TrendingUp size={18} />}
          trend={processedData.csatScore > 0 ? { value: 8, isPositive: true } : undefined}
        />
        <MetricsCard
          title="Melhor Grupo"
          value={processedData.bestGroup}
          subtitle={`CSAT: ${processedData.bestGroupCsat}%`}
          icon={<MessageSquare size={18} />}
        />
        <MetricsCard
          title="Grupos Ativos"
          value={processedData.activeGroups}
          subtitle="Com avaliações"
          icon={<Users size={18} />}
        />
      </div>

      {/* Gráfico de Distribuição */}
      <div>
        <ScoreDistributionChart data={processedData.scoreDistribution} />
      </div>

      {/* Layout em duas colunas para desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ranking dos Grupos */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Ranking dos Grupos</h3>
          <div className="space-y-3">
            {processedData.groupRankings.slice(0, 8).map((group, index) => (
              <div key={group.group} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' :
                    'bg-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{group.group}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {group.totalRatings} avaliações • CSAT: {group.csat}%
                    </div>
                  </div>
                </div>
                <div className="text-3xl">
                  {group.emoji}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas CSAT */}
        {processedData.totalRatings > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Análise CSAT</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {processedData.csatScore.toFixed(1)}%
                </div>
                <div className="text-sm font-medium text-green-700 dark:text-green-400 mt-1">CSAT Score</div>
                <div className="text-xs text-green-600 dark:text-green-500">😀 🤩 ({processedData.positiveRatings} avaliações positivas)</div>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {Math.round((processedData.neutralRatings / processedData.totalRatings) * 100)}%
                </div>
                <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mt-1">Avaliações Neutras</div>
                <div className="text-xs text-yellow-600 dark:text-yellow-500">😐 🙁 ({processedData.neutralRatings} avaliações)</div>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {Math.round((processedData.negativeRatings / processedData.totalRatings) * 100)}%
                </div>
                <div className="text-sm font-medium text-red-700 dark:text-red-400 mt-1">Avaliações Negativas</div>
                <div className="text-xs text-red-600 dark:text-red-500">😠 ({processedData.negativeRatings} avaliações)</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Fórmula CSAT:</strong> (Avaliações 4 + Avaliações 5) ÷ Total de Avaliações × 100
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                Apenas notas 4 (😀) e 5 (🤩) são consideradas positivas no cálculo
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
