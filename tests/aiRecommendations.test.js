const aiRecommendations = require('../src/aiRecommendations');

// Mock do OpenAI
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'Recomendações de teste...'
            }
          }]
        })
      }
    }
  }))
}));

describe('AI Recommendations', () => {
  test('deve gerar recomendações baseadas em métricas', async () => {
    const metrics = {
      hasReadme: true,
      hasLicense: true,
      hasTests: false,
      hasCI: false,
      hasDocumentation: false,
      commitFrequency: 1.5,
      issueResolutionTime: 5,
      pullRequestMergeRate: 0.6,
      codeReviewActivity: 0.4
    };

    const repositoryInfo = {
      name: 'test-repo',
      owner: 'test-owner'
    };

    const recommendations = await aiRecommendations.generateRecommendations(
      metrics,
      repositoryInfo
    );

    expect(recommendations).toHaveProperty('estrutura');
    expect(recommendations).toHaveProperty('desenvolvimento');
    expect(recommendations).toHaveProperty('revisao');
    expect(recommendations).toHaveProperty('documentacao');
    expect(recommendations).toHaveProperty('testes');
  });

  test('deve realizar benchmarking com projetos similares', async () => {
    const repositoryInfo = {
      name: 'test-repo',
      owner: 'test-owner'
    };

    const benchmarks = await aiRecommendations.benchmarkWithSimilarProjects(
      repositoryInfo
    );

    expect(typeof benchmarks).toBe('string');
    expect(benchmarks.length).toBeGreaterThan(0);
  });

  test('deve construir prompt corretamente', () => {
    const metrics = {
      hasReadme: true,
      hasLicense: false,
      hasTests: true,
      hasCI: false,
      hasDocumentation: true,
      commitFrequency: 2.5,
      issueResolutionTime: 3,
      pullRequestMergeRate: 0.8,
      codeReviewActivity: 0.9
    };

    const repositoryInfo = {
      name: 'test-repo'
    };

    const prompt = aiRecommendations.buildPrompt(metrics, repositoryInfo);

    expect(prompt).toContain('test-repo');
    expect(prompt).toContain('Presente');
    expect(prompt).toContain('Ausente');
    expect(prompt).toContain('2.5');
    expect(prompt).toContain('3');
    expect(prompt).toContain('80%');
    expect(prompt).toContain('90%');
  });

  test('deve parsear recomendações corretamente', () => {
    const aiResponse = `
      1. Estrutura
      - Adicionar mais documentação
      - Melhorar organização do código
      
      2. Desenvolvimento
      - Implementar mais testes
      - Adicionar CI/CD
      
      3. Revisão
      - Melhorar processo de code review
      - Implementar checklist de revisão
      
      4. Documentação
      - Atualizar README
      - Adicionar documentação de API
      
      5. Testes
      - Aumentar cobertura de testes
      - Adicionar testes de integração
    `;

    const recommendations = aiRecommendations.parseRecommendations(aiResponse);

    expect(recommendations.estrutura).toHaveLength(2);
    expect(recommendations.desenvolvimento).toHaveLength(2);
    expect(recommendations.revisao).toHaveLength(2);
    expect(recommendations.documentacao).toHaveLength(2);
    expect(recommendations.testes).toHaveLength(2);
  });
}); 