
interface FormularioData {
  id: number;
  created_at: string;
  nota: number | null;
  name: string | null;
  email: string | null;
  phone: number | null;
  empresa: string | null;
  notes: string | null;
}

export const processNpsData = (data: FormularioData[]) => {
  // Filtrar apenas dados válidos (notas de 1 a 5)
  const validData = data.filter(item => 
    item.nota !== null && 
    item.nota >= 1 && 
    item.nota <= 5 &&
    !isNaN(item.nota)
  );

  console.log('Dados NPS válidos processados:', validData.length);

  // Calcular métricas gerais
  const totalRatings = validData.length;
  
  // Converter nota (1-5) para percentual (0-100%)
  const averageScore = totalRatings > 0 
    ? ((validData.reduce((sum, item) => sum + (item.nota || 0), 0) / totalRatings) - 1) * 25
    : 0;

  // Contar empresas únicas
  const uniqueCompanies = new Set(
    validData
      .filter(item => item.empresa && item.empresa.trim() !== '')
      .map(item => item.empresa!)
  ).size;

  // Empresa com melhor avaliação média
  const companyAverages = validData.reduce((acc, item) => {
    if (!item.empresa) return acc;
    const empresa = item.empresa;
    if (!acc[empresa]) {
      acc[empresa] = { total: 0, count: 0 };
    }
    acc[empresa].total += item.nota!;
    acc[empresa].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const bestCompany = Object.entries(companyAverages).length > 0
    ? Object.entries(companyAverages)
        .map(([empresa, stats]) => ({ empresa, average: ((stats.total / stats.count) - 1) * 25 }))
        .filter(item => !isNaN(item.average) && isFinite(item.average))
        .sort((a, b) => b.average - a.average)[0]?.empresa || "N/A"
    : "N/A";

  // Distribuição de notas em percentual
  const scoreDistribution = Array.from({ length: 5 }, (_, i) => {
    const originalScore = i + 1; // Notas de 1 a 5
    const percentScore = i * 25; // Convertendo para 0%, 25%, 50%, 75%, 100%
    const count = validData.filter(item => item.nota === originalScore).length;
    return { score: percentScore, count };
  });

  // Ranking das empresas
  const companyRankings = Object.entries(companyAverages)
    .map(([empresa, stats]) => {
      const rawAverage = stats.count > 0 ? ((stats.total / stats.count) - 1) * 25 : 0;
      const safeAverage = isNaN(rawAverage) || !isFinite(rawAverage) ? 0 : rawAverage;
      return {
        company: empresa,
        average: Math.round(safeAverage * 10) / 10,
        totalRatings: stats.count
      };
    })
    .filter(item => !isNaN(item.average) && isFinite(item.average) && item.average >= 0)
    .sort((a, b) => b.average - a.average);

  const bestCompanyAverage = companyRankings.length > 0 ? companyRankings[0].average : 0;
  const safeAverageScore = isNaN(averageScore) || !isFinite(averageScore) ? 0 : averageScore;

  // Feedbacks não nulos
  const feedbacks = validData
    .filter(item => item.notes && item.notes.trim() !== '')
    .map(item => ({
      feedback: item.notes!,
      empresa: item.empresa || 'Empresa não informada',
      nota: item.nota!,
      created_at: item.created_at
    }))
    .slice(0, 10); // Limitar a 10 feedbacks mais recentes

  return {
    totalRatings,
    uniqueCompanies,
    averageScore: Math.round(safeAverageScore * 10) / 10,
    bestCompany,
    scoreDistribution,
    companyRankings,
    bestCompanyAverage: Math.round(bestCompanyAverage * 10) / 10,
    feedbacks
  };
};
