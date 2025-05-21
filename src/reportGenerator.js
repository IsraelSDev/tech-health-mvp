class ReportGenerator {
  generateTechHealthReport(
    repositoryInfo,
    metrics,
    recommendations,
    benchmarks
  ) {
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        repository: repositoryInfo.name,
        owner: repositoryInfo.owner,
      },
      metrics: {
        estrutura: {
          hasReadme: metrics.hasReadme,
          hasLicense: metrics.hasLicense,
          hasTests: metrics.hasTests,
          hasCI: metrics.hasCI,
          hasDocumentation: metrics.hasDocumentation,
        },
        qualidade: {
          commitFrequency: metrics.commitFrequency,
          issueResolutionTime: metrics.issueResolutionTime,
          pullRequestMergeRate: metrics.pullRequestMergeRate,
          codeReviewActivity: metrics.codeReviewActivity,
        },
      },
      recommendations: recommendations,
      benchmarks: benchmarks,
      score: this.calculateHealthScore(metrics),
    };

    return report;
  }

  calculateHealthScore(metrics) {
    let score = 0;
    const weights = {
      estrutura: {
        hasReadme: 0.1,
        hasLicense: 0.1,
        hasTests: 0.2,
        hasCI: 0.2,
        hasDocumentation: 0.1,
      },
      qualidade: {
        commitFrequency: 0.1,
        issueResolutionTime: 0.1,
        pullRequestMergeRate: 0.05,
        codeReviewActivity: 0.05,
      },
    };

    if (metrics.hasReadme) score += weights.estrutura.hasReadme;
    if (metrics.hasLicense) score += weights.estrutura.hasLicense;
    if (metrics.hasTests) score += weights.estrutura.hasTests;
    if (metrics.hasCI) score += weights.estrutura.hasCI;
    if (metrics.hasDocumentation) score += weights.estrutura.hasDocumentation;

    const normalizedCommitFreq = Math.min(metrics.commitFrequency / 5, 1);
    score += normalizedCommitFreq * weights.qualidade.commitFrequency;

    const normalizedIssueTime = Math.max(
      0,
      1 - metrics.issueResolutionTime / 30
    );
    score += normalizedIssueTime * weights.qualidade.issueResolutionTime;

    score +=
      metrics.pullRequestMergeRate * weights.qualidade.pullRequestMergeRate;
    score += metrics.codeReviewActivity * weights.qualidade.codeReviewActivity;

    return Math.round(score * 100);
  }

  formatReport(report) {
    return {
      ...report,
      score: {
        value: report.score,
        level: this.getScoreLevel(report.score),
        description: this.getScoreDescription(report.score),
      },
    };
  }

  getScoreLevel(score) {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Regular";
    if (score >= 20) return "Precisa de Melhorias";
    return "Crítico";
  }

  getScoreDescription(score) {
    if (score >= 80)
      return "O repositório demonstra excelentes práticas de desenvolvimento e manutenção.";
    if (score >= 60)
      return "O repositório apresenta boas práticas, com algumas áreas para melhoria.";
    if (score >= 40)
      return "O repositório tem práticas regulares, com várias oportunidades de melhoria.";
    if (score >= 20)
      return "O repositório precisa de melhorias significativas em várias áreas.";
    return "O repositório requer atenção imediata e melhorias críticas.";
  }
}

module.exports = new ReportGenerator();
