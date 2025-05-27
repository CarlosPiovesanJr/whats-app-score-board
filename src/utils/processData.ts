
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
    item.nota_convertida <= 10 &&
    !isNaN(item.nota_convertida)
  );

  console.log('Dados válidos processados:', validData.length);

  // Calcular métricas gerais
  const totalRatings = validData.length;
  
  // Contar votos únicos por usuário (se o campo usuario estiver preenchido)
  const uniqueVoters = new Set(
    validData
      .filter(item => item.usuario && item.usuario.trim() !== '')
      .map(item => item.usuario!)
  ).size;

  // Converter nota (0-10) para percentual (0-100%)
  const averageScore = totalRatings > 0 
    ? (validData.reduce((sum, item) => sum + (item.nota_convertida || 0), 0) / totalRatings) * 10
    : 0;

  // Encontrar melhor grupo (com percentual)
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
        .map(([grupo, stats]) => ({ grupo, average: (stats.total / stats.count) * 10 }))
        .filter(item => !isNaN(item.average) && isFinite(item.average))
        .sort((a, b) => b.average - a.average)[0]?.grupo || "N/A"
    : "N/A";

  const activeGroups = Object.keys(groupAverages).length;

  // Distribuição de notas em percentual (0%, 20%, 40%, 60%, 80%, 100%)
  const scoreDistribution = Array.from({ length: 6 }, (_, i) => {
    const score = i * 20; // Convertendo para percentual
    const originalScore = i * 2; // Score original (0, 2, 4, 6, 8, 10)
    const count = validData.filter(item => item.nota_convertida === originalScore).length;
    return { score, count };
  });

  // Ranking dos grupos com percentual
  const groupRankings = Object.entries(groupAverages)
    .map(([grupo, stats]) => {
      const rawAverage = stats.count > 0 ? (stats.total / stats.count) * 10 : 0;
      const safeAverage = isNaN(rawAverage) || !isFinite(rawAverage) ? 0 : rawAverage;
      return {
        group: grupo,
        average: Math.round(safeAverage * 10) / 10,
        totalRatings: stats.count
      };
    })
    .filter(item => !isNaN(item.average) && isFinite(item.average) && item.average >= 0)
    .sort((a, b) => b.average - a.average);

  const bestGroupAverage = groupRankings.length > 0 ? groupRankings[0].average : 0;
  const safeAverageScore = isNaN(averageScore) || !isFinite(averageScore) ? 0 : averageScore;

  return {
    totalRatings,
    uniqueVoters,
    averageScore: Math.round(safeAverageScore * 10) / 10,
    bestGroup,
    activeGroups,
    scoreDistribution,
    groupRankings,
    bestGroupAverage: Math.round(bestGroupAverage * 10) / 10
  };
};
