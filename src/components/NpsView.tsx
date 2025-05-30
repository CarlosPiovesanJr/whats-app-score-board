
import { MetricsCard } from "@/components/MetricsCard";
import { ScoreDistributionChart } from "@/components/ScoreDistributionChart";
import { Building, ChartBar, MessageSquare, Users } from "lucide-react";
import { useFormularioData } from "@/hooks/useFormularioData";
import { processNpsData } from "@/utils/processNpsData";

export const NpsView = () => {
  const { data, isLoading, error } = useFormularioData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 dark:text-purple-400">Carregando dados NPS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-8">
        <p>Erro ao carregar dados NPS: {error.message}</p>
      </div>
    );
  }

  const processedData = data ? processNpsData(data) : {
    totalRatings: 0,
    uniqueCompanies: 0,
    averageScore: 0,
    bestCompany: "N/A",
    scoreDistribution: [],
    companyRankings: [],
    bestCompanyAverage: 0,
    feedbacks: []
  };

  return (
    <div className="space-y-8">
      {/* Cards de Métricas NPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total de Avaliações NPS"
          value={processedData.totalRatings.toLocaleString()}
          subtitle="Formulários respondidos"
          icon={<MessageSquare size={20} />}
          trend={processedData.totalRatings > 0 ? { value: 8, isPositive: true } : undefined}
        />
        <MetricsCard
          title="Satisfação Média"
          value={`${processedData.averageScore.toFixed(1)}%`}
          subtitle="De 0% a 100%"
          icon={<ChartBar size={20} />}
          trend={processedData.averageScore > 0 ? { value: 3, isPositive: true } : undefined}
        />
        <MetricsCard
          title="Melhor Empresa"
          value={processedData.bestCompany}
          subtitle={`Média: ${processedData.bestCompanyAverage}%`}
          icon={<Building size={20} />}
        />
        <MetricsCard
          title="Empresas Participantes"
          value={processedData.uniqueCompanies}
          subtitle="Com avaliações"
          icon={<Users size={20} />}
        />
      </div>

      {/* Gráfico de Distribuição NPS */}
      <div>
        <ScoreDistributionChart data={processedData.scoreDistribution} />
      </div>

      {/* Feedbacks e Empresas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking das Empresas */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-purple-200 dark:border-gray-600 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ranking das Empresas</h3>
          <div className="space-y-3">
            {processedData.companyRankings.slice(0, 5).map((company, index) => (
              <div key={company.company} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">{company.company}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{company.totalRatings} avaliações</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {company.average}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedbacks Recentes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-purple-200 dark:border-gray-600 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Feedbacks Recentes</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {processedData.feedbacks.map((feedback, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {feedback.empresa}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Nota: {feedback.nota}/5
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {feedback.feedback}
                </p>
              </div>
            ))}
            {processedData.feedbacks.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhum feedback disponível
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas Adicionais */}
      {processedData.totalRatings > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-purple-200 dark:border-gray-600 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resumo Executivo NPS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round((processedData.scoreDistribution.filter(d => d.score >= 75).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Promotores (Notas 4-5)</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.round((processedData.scoreDistribution.filter(d => d.score >= 25 && d.score < 75).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Neutros (Nota 3)</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {Math.round((processedData.scoreDistribution.filter(d => d.score < 25).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Detratores (Notas 1-2)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
