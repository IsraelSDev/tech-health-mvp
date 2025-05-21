const codeAnalysis = require('../src/codeAnalysis');

describe('Code Analysis', () => {
  test('deve analisar estrutura do repositório', () => {
    const repository = {
      files: [
        'README.md',
        'LICENSE',
        'src/test.js',
        '.github/workflows/ci.yml',
        'docs/api.md'
      ]
    };

    const result = codeAnalysis.analyzeRepositoryStructure(repository);

    expect(result).toEqual({
      hasReadme: true,
      hasLicense: true,
      hasTests: true,
      hasCI: true,
      hasDocumentation: true
    });
  });

  test('deve calcular métricas de qualidade do código', () => {
    const commits = [
      { commit: { author: { date: '2024-01-01T00:00:00Z' } } },
      { commit: { author: { date: '2024-01-02T00:00:00Z' } } }
    ];

    const issues = [
      { created_at: '2024-01-01T00:00:00Z', closed_at: '2024-01-03T00:00:00Z' },
      { created_at: '2024-01-02T00:00:00Z', closed_at: '2024-01-04T00:00:00Z' }
    ];

    const pullRequests = [
      { merged_at: '2024-01-03T00:00:00Z', review_comments: 2 },
      { merged_at: null, review_comments: 0 }
    ];

    const result = codeAnalysis.analyzeCodeQuality(commits, issues, pullRequests);

    expect(result).toHaveProperty('commitFrequency');
    expect(result).toHaveProperty('issueResolutionTime');
    expect(result).toHaveProperty('pullRequestMergeRate');
    expect(result).toHaveProperty('codeReviewActivity');
  });

  test('deve lidar com arrays vazios', () => {
    const result = codeAnalysis.analyzeCodeQuality([], [], []);

    expect(result.commitFrequency).toBe(0);
    expect(result.issueResolutionTime).toBe(0);
    expect(result.pullRequestMergeRate).toBe(0);
    expect(result.codeReviewActivity).toBe(0);
  });
}); 