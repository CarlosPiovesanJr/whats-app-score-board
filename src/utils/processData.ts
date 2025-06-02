
interface SatisfacaoData {
  id: number;
  created_at: string;
  nota_convertida: number | null;
  avaliacao: string | null;
  grupo: string | null;
  usuario: string | null;
}

// Mapeamento de notas para emojis
const getEmojiFromNota = (nota: number): string => {
  switch (nota) {
    case 10: return "🤩"; // Nota 5 original
    case 8: return "😀"; // Nota 4 original
    case 6: return "😐"; // Nota 3 original
    case 4: return "🙁"; // Nota 2 original
    case 2: return "😠"; // Nota 1 original
    default: return "😐";
  }
};

// Classificação das avaliações
const getAvaliacaoType = (nota: number): 'positive' | 'neutral' | 'negative' => {
  if (nota >= 8) return 'positive'; // 4 e 5 (😀 e 🤩)
  if (nota === 6) return 'neutral'; // 3 (😐)
  if (nota === 4) return 'neutral'; // 2 (🙁)
  return 'negative'; // 1 (😠)
};

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
  
  // Contar votos únicos por usuário
  const uniqueVoters = new Set(
    validData
      .filter(item => item.usuario && item.usuario.trim() !== '')
      .map(item => item.usuario!)
  ).size;

  // Calcular DSAT - todas as notas 1, 2 e 3 são consideradas negativas
  const negativeRatings = validData.filter(item => item.nota_convertida! <= 6).length;
  const dsatScore = totalRatings > 0 ? (negativeRatings / totalRatings) * 100 : 0;

  // Calcular satisfação média baseada na nova lógica
  const positiveRatings = validData.filter(item => item.nota_convertida! >= 8).length;
  const satisfactionScore = totalRatings > 0 ? (positiveRatings / totalRatings) * 100 : 0;

  // Encontrar melhor grupo
  const groupAverages = validData.reduce((acc, item) => {
    const grupo = item.grupo!;
    if (!acc[grupo]) {
      acc[grupo] = { 
        total: 0, 
        count: 0, 
        positive: 0, 
        negative: 0,
        ratings: [] 
      };
    }
    acc[grupo].total += item.nota_convertida!;
    acc[grupo].count += 1;
    acc[grupo].ratings.push(item.nota_convertida!);
    
    if (item.nota_convertida! >= 8) acc[grupo].positive += 1;
    if (item.nota_convertida! <= 6) acc[grupo].negative += 1;
    
    return acc;
  }, {} as Record<string, { 
    total: number; 
    count: number; 
    positive: number; 
    negative: number;
    ratings: number[];
  }>);

  // Melhor grupo baseado em menor DSAT
  const bestGroup = Object.entries(groupAverages).length > 0
    ? Object.entries(groupAverages)
        .map(([grupo, stats]) => ({ 
          grupo, 
          dsat: (stats.negative / stats.count) * 100,
          satisfaction: (stats.positive / stats.count) * 100
        }))
        .filter(item => !isNaN(item.dsat) && isFinite(item.dsat))
        .sort((a, b) => a.dsat - b.dsat)[0]?.grupo || "N/A"
    : "N/A";

  const activeGroups = Object.keys(groupAverages).length;

  // Distribuição de notas por emoji
  const scoreDistribution = [
    { score: 0, count: validData.filter(item => item.nota_convertida === 2).length, emoji: "😠" },
    { score: 20, count: validData.filter(item => item.nota_convertida === 4).length, emoji: "🙁" },
    { score: 40, count: validData.filter(item => item.nota_convertida === 6).length, emoji: "😐" },
    { score: 60, count: 0, emoji: "" }, // Placeholder para manter estrutura
    { score: 80, count: validData.filter(item => item.nota_convertida === 8).length, emoji: "😀" },
    { score: 100, count: validData.filter(item => item.nota_convertida === 10).length, emoji: "🤩" }
  ].filter(item => item.count > 0 || item.score === 60);

  // Ranking dos grupos com emoji da média
  const groupRankings = Object.entries(groupAverages)
    .map(([grupo, stats]) => {
      const averageNote = stats.count > 0 ? stats.total / stats.count : 0;
      const dsat = stats.count > 0 ? (stats.negative / stats.count) * 100 : 0;
      const satisfaction = stats.count > 0 ? (stats.positive / stats.count) * 100 : 0;
      const emoji = getEmojiFromNota(Math.round(averageNote));
      
      return {
        group: grupo,
        average: Math.round(averageNote * 10) / 10,
        dsat: Math.round(dsat * 10) / 10,
        satisfaction: Math.round(satisfaction * 10) / 10,
        emoji: emoji,
        totalRatings: stats.count
      };
    })
    .filter(item => !isNaN(item.average) && isFinite(item.average) && item.average >= 0)
    .sort((a, b) => a.dsat - b.dsat); // Ordenar por menor DSAT (melhor)

  const bestGroupDsat = groupRankings.length > 0 ? groupRankings[0].dsat : 0;
  const safeDsatScore = isNaN(dsatScore) || !isFinite(dsatScore) ? 0 : dsatScore;
  const safeSatisfactionScore = isNaN(satisfactionScore) || !isFinite(satisfactionScore) ? 0 : satisfactionScore;

  return {
    totalRatings,
    uniqueVoters,
    dsatScore: Math.round(safeDsatScore * 10) / 10,
    satisfactionScore: Math.round(safeSatisfactionScore * 10) / 10,
    bestGroup,
    activeGroups,
    scoreDistribution,
    groupRankings,
    bestGroupDsat: Math.round(bestGroupDsat * 10) / 10,
    negativeRatings,
    positiveRatings
  };
};
