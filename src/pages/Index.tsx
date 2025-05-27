
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsCard } from "@/components/MetricsCard";
import { ScoreDistributionChart } from "@/components/ScoreDistributionChart";
import { GroupRankingChart } from "@/components/GroupRankingChart";
import { Users, ChartBar, MessageSquare, Table } from "lucide-react";

// Dados mockados para demonstração
const mockData = {
  totalRatings: 342,
  averageScore: 7.8,
  bestGroup: "Suporte Técnico",
  activeGroups: 8,
  
  scoreDistribution: [
    { score: 0, count: 2 },
    { score: 2, count: 8 },
    { score: 4, count: 15 },
    { score: 6, count: 45 },
    { score: 8, count: 178 },
    { score: 10, count: 94 },
  ],
  
  groupRankings: [
    { group: "Suporte Técnico", average: 8.9, totalRatings: 67 },
    { group: "Vendas Premium", average: 8.4, totalRatings: 52 },
    { group: "Atendimento Geral", average: 7.8, totalRatings: 89 },
    { group: "Pós-Vendas", average: 7.6, totalRatings: 43 },
    { group: "Financeiro", average: 7.2, totalRatings: 31 },
    { group: "SAC Básico", average: 6.9, totalRatings: 38 },
    { group: "Reclamações", average: 6.1, totalRatings: 22 },
  ]
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total de Avaliações"
            value={mockData.totalRatings.toLocaleString()}
            subtitle="Este mês"
            icon={<Table size={20} />}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricsCard
            title="Nota Média Geral"
            value={mockData.averageScore.toFixed(1)}
            subtitle="De 0 a 10"
            icon={<ChartBar size={20} />}
            trend={{ value: 5, isPositive: true }}
          />
          <MetricsCard
            title="Melhor Grupo"
            value={mockData.bestGroup}
            subtitle={`Média: ${mockData.groupRankings[0].average}`}
            icon={<MessageSquare size={20} />}
          />
          <MetricsCard
            title="Grupos Ativos"
            value={mockData.activeGroups}
            subtitle="Com avaliações"
            icon={<Users size={20} />}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ScoreDistributionChart data={mockData.scoreDistribution} />
          <div className="lg:row-span-2">
            <GroupRankingChart data={mockData.groupRankings} />
          </div>
        </div>

        {/* Estatísticas Adicionais */}
        <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo Executivo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((mockData.scoreDistribution.filter(d => d.score >= 8).reduce((acc, d) => acc + d.count, 0) / mockData.totalRatings) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avaliações Positivas (8-10)</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round((mockData.scoreDistribution.filter(d => d.score >= 6 && d.score < 8).reduce((acc, d) => acc + d.count, 0) / mockData.totalRatings) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avaliações Neutras (6-7)</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {Math.round((mockData.scoreDistribution.filter(d => d.score < 6).reduce((acc, d) => acc + d.count, 0) / mockData.totalRatings) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avaliações Negativas (0-5)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
