const metrics = require('./metrics');

class ReportGenerator {
  generateTechHealthReport(
    repositoryInfo,
    metricsData,
    recommendations,
    benchmarks
  ) {
    const scoreData = metrics.calculateScore(metricsData);
    const scoreLevel = metrics.getScoreLevel(scoreData.total);

    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        repository: repositoryInfo.name,
        owner: repositoryInfo.owner,
      },
      score: {
        total: scoreData.total,
        estrutura: scoreData.estrutura,
        qualidade: scoreData.qualidade,
        level: scoreLevel.level,
        description: scoreLevel.description
      },
      metrics: scoreData.detalhes,
      recommendations: recommendations,
      benchmarks: benchmarks
    };

    return report;
  }

  formatReport(report) {
    return {
      ...report,
      score: {
        ...report.score,
        formatted: {
          total: `${report.score.total.toFixed(1)}/100`,
          estrutura: `${report.score.estrutura.toFixed(1)}/50`,
          qualidade: `${report.score.qualidade.toFixed(1)}/50`
        }
      }
    };
  }
}

module.exports = new ReportGenerator();
