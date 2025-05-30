
import { MetricsCard } from "@/components/MetricsCard";
import { ScoreDistributionChart } from "@/components/ScoreDistributionChart";
import { Building, ChartBar, MessageSquare, Users } from "lucide-react";
import { useFormularioData } from "@/hooks/useFormularioData";
import { processNpsData } from "@/utils/processNpsData";

export const NpsView = () => {
  const { data, isLoading, error } = useFormularioData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dados NPS...</p>
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
        <p className="text-red-600 dark:text-red-400">Erro ao carregar dados NPS: {error.message}</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total de Avaliações NPS"
          value={processedData.totalRatings.toLocaleString()}
          subtitle="Formulários respondidos"
          icon={<MessageSquare size={18} />}
          trend={processedData.totalRatings > 0 ? { value: 8, isPositive: true } : undefined}
        />
        <MetricsCard
          title="Satisfação Média"
          value={`${processedData.averageScore.toFixed(1)}%`}
          subtitle="De 0% a 100%"
          icon={<ChartBar size={18} />}
          trend={processedData.averageScore > 0 ? { value: 3, isPositive: true } : undefined}
        />
        <MetricsCard
          title="Melhor Empresa"
          value={processedData.bestCompany}
          subtitle={`Média: ${processedData.bestCompanyAverage}%`}
          icon={<Building size={18} />}
        />
        <MetricsCard
          title="Empresas Participantes"
          value={processedData.uniqueCompanies}
          subtitle="Com avaliações"
          icon={<Users size={18} />}
        />
      </div>

      {/* Gráfico de Distribuição NPS */}
      <div>
        <ScoreDistributionChart data={processedData.scoreDistribution} />
      </div>

      {/* Layout em duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ranking das Empresas */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Ranking das Empresas</h3>
          <div className="space-y-3">
            {processedData.companyRankings.slice(0, 6).map((company, index) => (
              <div key={company.company} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
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
                    <div className="font-medium text-gray-900 dark:text-white">{company.company}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{company.totalRatings} avaliações</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {company.average}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedbacks Recentes */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Feedbacks Recentes</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {processedData.feedbacks.map((feedback, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                    {feedback.empresa}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < feedback.nota ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {feedback.feedback}
                </p>
              </div>
            ))}
            {processedData.feedbacks.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  💬
                </div>
                <p className="text-gray-500 dark:text-gray-400">Nenhum feedback disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas NPS */}
      {processedData.totalRatings > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Resumo Executivo NPS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {Math.round((processedData.scoreDistribution.filter(d => d.score >= 75).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
              </div>
              <div className="text-sm font-medium text-green-700 dark:text-green-400 mt-1">Promotores</div>
              <div className="text-xs text-green-600 dark:text-green-500">Notas 4-5 ⭐⭐⭐⭐⭐</div>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                {Math.round((processedData.scoreDistribution.filter(d => d.score >= 25 && d.score < 75).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
              </div>
              <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mt-1">Neutros</div>
              <div className="text-xs text-yellow-600 dark:text-yellow-500">Nota 3 ⭐⭐⭐</div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                {Math.round((processedData.scoreDistribution.filter(d => d.score < 25).reduce((acc, d) => acc + d.count, 0) / processedData.totalRatings) * 100)}%
              </div>
              <div className="text-sm font-medium text-red-700 dark:text-red-400 mt-1">Detratores</div>
              <div className="text-xs text-red-600 dark:text-red-500">Notas 1-2 ⭐⭐</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
