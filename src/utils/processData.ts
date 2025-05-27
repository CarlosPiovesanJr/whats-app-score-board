
interface SatisfacaoData {
  id: number;
  created_at: string;
  nota_convertida: number | null;
  avaliacao: string | null;
  grupo: string | null;
  usuario: string | null;
}

export const processMetricsData = (data: SatisfacaoData[]) => {
  // Filtrar apenas dados válidos
  const validData = data.filter(item => 
    item.nota_convertida !== null && 
    item.grupo !== null &&
    item.nota_convertida >= 0 && 
    item.nota_convertida <= 10
  );

  console.log('Dados válidos processados:', validData.length);

  // Calcular métricas gerais
  const totalRatings = validData.length;
  const averageScore = totalRatings > 0 
    ? validData.reduce((sum, item) => sum + (item.nota_convertida || 0), 0) / totalRatings 
    : 0;

  // Encontrar melhor grupo
  const groupAverages = validData.reduce((acc, item) => {
    const grupo = item.grupo!;
    if (!acc[grupo]) {
      acc[grupo] = { total: 0, count: 0 };
    }
    acc[grupo].total += item.nota_convertida!;
    acc[grupo].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const bestGroup = Object.entries(groupAverages).length > 0
    ? Object.entries(groupAverages)
        .map(([grupo, stats]) => ({ grupo, average: stats.total / stats.count }))
        .sort((a, b) => b.average - a.average)[0]?.grupo || "N/A"
    : "N/A";

  const activeGroups = Object.keys(groupAverages).length;

  // Distribuição de notas
  const scoreDistribution = Array.from({ length: 6 }, (_, i) => {
    const score = i * 2;
    const count = validData.filter(item => item.nota_convertida === score).length;
    return { score, count };
  });

  // Ranking dos grupos
  const groupRankings = Object.entries(groupAverages)
    .map(([grupo, stats]) => ({
      group: grupo,
      average: Number((stats.total / stats.count).toFixed(1)),
      totalRatings: stats.count
    }))
    .sort((a, b) => b.average - a.average);

  return {
    totalRatings,
    averageScore: Number(averageScore.toFixed(1)),
    bestGroup,
    activeGroups,
    scoreDistribution,
    groupRankings,
    bestGroupAverage: groupRankings[0]?.average || 0
  };
};
