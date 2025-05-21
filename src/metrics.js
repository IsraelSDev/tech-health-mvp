class Metrics {
  constructor() {
    this.weights = {
      estrutura: {
        hasReadme: 10,
        hasLicense: 5,
        hasTests: 15,
        hasCI: 10,
        hasDocumentation: 10
      },
      qualidade: {
        commitFrequency: 15,
        issueResolutionTime: 10,
        pullRequestMergeRate: 15,
        codeReviewActivity: 10
      }
    };
  }

  calculateScore(metrics) {
    const estruturaScore = this.calculateEstruturaScore(metrics);
    const qualidadeScore = this.calculateQualidadeScore(metrics);
    
    return {
      total: estruturaScore + qualidadeScore,
      estrutura: estruturaScore,
      qualidade: qualidadeScore,
      detalhes: this.generateDetailedMetrics(metrics)
    };
  }

  calculateEstruturaScore(metrics) {
    let score = 0;
    
    // Pontuação da estrutura
    if (metrics.hasReadme) score += this.weights.estrutura.hasReadme;
    if (metrics.hasLicense) score += this.weights.estrutura.hasLicense;
    if (metrics.hasTests) score += this.weights.estrutura.hasTests;
    if (metrics.hasCI) score += this.weights.estrutura.hasCI;
    if (metrics.hasDocumentation) score += this.weights.estrutura.hasDocumentation;

    return score;
  }

  calculateQualidadeScore(metrics) {
    let score = 0;
    
    // Pontuação da qualidade
    const commitScore = Math.min(metrics.commitFrequency * 2, this.weights.qualidade.commitFrequency);
    const issueScore = this.calculateIssueScore(metrics.issueResolutionTime);
    const prScore = metrics.pullRequestMergeRate * this.weights.qualidade.pullRequestMergeRate;
    const reviewScore = metrics.codeReviewActivity * this.weights.qualidade.codeReviewActivity;

    score += commitScore + issueScore + prScore + reviewScore;
    return score;
  }

  calculateIssueScore(resolutionTime) {
    // Quanto menor o tempo de resolução, maior a pontuação
    if (resolutionTime === 0) return 0;
    const maxScore = this.weights.qualidade.issueResolutionTime;
    const score = maxScore * (1 / (1 + resolutionTime / 7)); // 7 dias como referência
    return Math.min(score, maxScore);
  }

  generateDetailedMetrics(metrics) {
    return {
      estrutura: {
        readme: {
          score: metrics.hasReadme ? this.weights.estrutura.hasReadme : 0,
          maxScore: this.weights.estrutura.hasReadme,
          status: metrics.hasReadme ? '✅' : '❌'
        },
        license: {
          score: metrics.hasLicense ? this.weights.estrutura.hasLicense : 0,
          maxScore: this.weights.estrutura.hasLicense,
          status: metrics.hasLicense ? '✅' : '❌'
        },
        tests: {
          score: metrics.hasTests ? this.weights.estrutura.hasTests : 0,
          maxScore: this.weights.estrutura.hasTests,
          status: metrics.hasTests ? '✅' : '❌'
        },
        ci: {
          score: metrics.hasCI ? this.weights.estrutura.hasCI : 0,
          maxScore: this.weights.estrutura.hasCI,
          status: metrics.hasCI ? '✅' : '❌'
        },
        documentation: {
          score: metrics.hasDocumentation ? this.weights.estrutura.hasDocumentation : 0,
          maxScore: this.weights.estrutura.hasDocumentation,
          status: metrics.hasDocumentation ? '✅' : '❌'
        }
      },
      qualidade: {
        commitFrequency: {
          score: Math.min(metrics.commitFrequency * 2, this.weights.qualidade.commitFrequency),
          maxScore: this.weights.qualidade.commitFrequency,
          value: metrics.commitFrequency.toFixed(2) + ' commits/dia'
        },
        issueResolution: {
          score: this.calculateIssueScore(metrics.issueResolutionTime),
          maxScore: this.weights.qualidade.issueResolutionTime,
          value: metrics.issueResolutionTime.toFixed(1) + ' dias'
        },
        pullRequestMerge: {
          score: metrics.pullRequestMergeRate * this.weights.qualidade.pullRequestMergeRate,
          maxScore: this.weights.qualidade.pullRequestMergeRate,
          value: (metrics.pullRequestMergeRate * 100).toFixed(1) + '%'
        },
        codeReview: {
          score: metrics.codeReviewActivity * this.weights.qualidade.codeReviewActivity,
          maxScore: this.weights.qualidade.codeReviewActivity,
          value: (metrics.codeReviewActivity * 100).toFixed(1) + '%'
        }
      }
    };
  }

  getScoreLevel(score) {
    if (score >= 90) return { level: 'A', description: 'Excelente' };
    if (score >= 80) return { level: 'B', description: 'Muito Bom' };
    if (score >= 70) return { level: 'C', description: 'Bom' };
    if (score >= 60) return { level: 'D', description: 'Regular' };
    return { level: 'E', description: 'Precisa Melhorar' };
  }
}

module.exports = new Metrics(); 