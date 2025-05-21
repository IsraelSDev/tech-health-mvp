const reportGenerator = require('../src/reportGenerator');

describe('Report Generator', () => {
  test('deve gerar relatório com todas as informações', () => {
    const repositoryInfo = {
      name: 'test-repo',
      owner: 'test-owner'
    };

    const metrics = {
      hasReadme: true,
      hasLicense: true,
      hasTests: true,
      hasCI: true,
      hasDocumentation: true,
      commitFrequency: 2.5,
      issueResolutionTime: 3,
      pullRequestMergeRate: 0.8,
      codeReviewActivity: 0.9
    };

    const recommendations = {
      estrutura: ['Adicionar mais documentação'],
      desenvolvimento: ['Implementar mais testes'],
      revisao: ['Melhorar processo de code review'],
      documentacao: ['Atualizar README'],
      testes: ['Aumentar cobertura de testes']
    };

    const benchmarks = 'Comparação com projetos similares...';

    const report = reportGenerator.generateTechHealthReport(
      repositoryInfo,
      metrics,
      recommendations,
      benchmarks
    );

    expect(report).toHaveProperty('metadata');
    expect(report).toHaveProperty('metrics');
    expect(report).toHaveProperty('recommendations');
    expect(report).toHaveProperty('benchmarks');
    expect(report).toHaveProperty('score');
  });

  test('deve calcular score corretamente', () => {
    const metrics = {
      hasReadme: true,
      hasLicense: true,
      hasTests: true,
      hasCI: true,
      hasDocumentation: true,
      commitFrequency: 5,
      issueResolutionTime: 1,
      pullRequestMergeRate: 1,
      codeReviewActivity: 1
    };

    const score = reportGenerator.calculateHealthScore(metrics);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('deve formatar relatório com nível e descrição do score', () => {
    const report = {
      score: 85
    };

    const formattedReport = reportGenerator.formatReport(report);

    expect(formattedReport.score).toHaveProperty('value', 85);
    expect(formattedReport.score).toHaveProperty('level');
    expect(formattedReport.score).toHaveProperty('description');
  });

  test('deve retornar nível correto para diferentes scores', () => {
    expect(reportGenerator.getScoreLevel(90)).toBe('Excelente');
    expect(reportGenerator.getScoreLevel(70)).toBe('Bom');
    expect(reportGenerator.getScoreLevel(50)).toBe('Regular');
    expect(reportGenerator.getScoreLevel(30)).toBe('Precisa de Melhorias');
    expect(reportGenerator.getScoreLevel(10)).toBe('Crítico');
  });
}); 