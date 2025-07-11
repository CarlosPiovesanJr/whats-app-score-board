
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

export const processMetricsData = (data: SatisfacaoData[], startDate?: Date, endDate?: Date) => {
  // Filtrar dados por data se fornecidas
  let filteredData = data;
  
  if (startDate || endDate) {
    filteredData = data.filter(item => {
      const itemDate = new Date(item.created_at);
      const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      
      if (startDate && endDate) {
        const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        return itemDateOnly >= start && itemDateOnly <= end;
      } else if (startDate) {
        const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        return itemDateOnly >= start;
      } else if (endDate) {
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        return itemDateOnly <= end;
      }
      return true;
    });
  }

  // Filtrar apenas dados válidos
  const validData = filteredData.filter(item => 
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

  // Calcular CSAT - apenas notas 4 (😀) e 5 (🤩) são consideradas positivas
  const positiveRatings = validData.filter(item => item.nota_convertida! >= 8).length; // notas 4 e 5
  const csatScore = totalRatings > 0 ? (positiveRatings / totalRatings) * 100 : 0;

  // Contadores para análise
  const negativeRatings = validData.filter(item => item.nota_convertida! === 2).length; // nota 1
  const neutralRatings = validData.filter(item => item.nota_convertida! === 4 || item.nota_convertida! === 6).length; // notas 2 e 3

  // Encontrar melhor grupo baseado em maior CSAT
  const groupAverages = validData.reduce((acc, item) => {
    const grupo = item.grupo!;
    if (!acc[grupo]) {
      acc[grupo] = { 
        total: 0, 
        count: 0, 
        positive: 0, 
        negative: 0,
        neutral: 0,
        ratings: [],
        lastEvaluation: item.created_at
      };
    }
    acc[grupo].total += item.nota_convertida!;
    acc[grupo].count += 1;
    acc[grupo].ratings.push(item.nota_convertida!);
    
    // Atualizar última avaliação se for mais recente
    if (new Date(item.created_at) > new Date(acc[grupo].lastEvaluation)) {
      acc[grupo].lastEvaluation = item.created_at;
    }
    
    if (item.nota_convertida! >= 8) acc[grupo].positive += 1; // notas 4 e 5
    if (item.nota_convertida! === 2) acc[grupo].negative += 1; // nota 1
    if (item.nota_convertida! === 4 || item.nota_convertida! === 6) acc[grupo].neutral += 1; // notas 2 e 3
    
    return acc;
  }, {} as Record<string, { 
    total: number; 
    count: number; 
    positive: number; 
    negative: number;
    neutral: number;
    ratings: number[];
    lastEvaluation: string;
  }>);

  // Melhor grupo baseado em maior CSAT
  const bestGroup = Object.entries(groupAverages).length > 0
    ? Object.entries(groupAverages)
        .map(([grupo, stats]) => ({ 
          grupo, 
          csat: (stats.positive / stats.count) * 100,
          positiveCount: stats.positive,
          totalCount: stats.count
        }))
        .filter(item => !isNaN(item.csat) && isFinite(item.csat))
        .sort((a, b) => b.csat - a.csat)[0]?.grupo || "N/A"
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

  // Últimos grupos com avaliações (ordenados por data mais recente)
  const recentGroups = Object.entries(groupAverages)
    .map(([grupo, stats]) => {
      const averageNote = stats.count > 0 ? stats.total / stats.count : 0;
      const emoji = getEmojiFromNota(Math.round(averageNote));
      
      return {
        group: grupo,
        average: Math.round(averageNote * 10) / 10,
        emoji: emoji,
        totalRatings: stats.count,
        lastEvaluation: stats.lastEvaluation,
        lastEvaluationDate: new Date(stats.lastEvaluation)
      };
    })
    .filter(item => !isNaN(item.average) && isFinite(item.average) && item.average >= 0)
    .sort((a, b) => b.lastEvaluationDate.getTime() - a.lastEvaluationDate.getTime())
    .slice(0, 8); // Mostrar apenas os 8 mais recentes

  const bestGroupCsat = Object.entries(groupAverages).length > 0
    ? Math.max(...Object.entries(groupAverages)
        .map(([, stats]) => (stats.positive / stats.count) * 100)
        .filter(csat => !isNaN(csat) && isFinite(csat))) || 0
    : 0;

  const safeCsatScore = isNaN(csatScore) || !isFinite(csatScore) ? 0 : csatScore;

  return {
    totalRatings,
    uniqueVoters,
    csatScore: Math.round(safeCsatScore * 10) / 10,
    bestGroup,
    activeGroups,
    scoreDistribution,
    recentGroups,
    bestGroupCsat: Math.round(bestGroupCsat * 10) / 10,
    negativeRatings,
    positiveRatings,
    neutralRatings
  };
};
