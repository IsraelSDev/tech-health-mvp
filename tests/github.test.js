const githubService = require('../src/github');

describe('GitHub Service', () => {
  test('deve retornar informações do repositório', async () => {
    const owner = 'octocat';
    const repo = 'Hello-World';
    
    const result = await githubService.getRepositoryInfo(owner, repo);
    
    expect(result).toHaveProperty('repository');
    expect(result).toHaveProperty('commits');
    expect(result).toHaveProperty('issues');
    expect(result).toHaveProperty('pullRequests');
  });

  test('deve retornar métricas do código', async () => {
    const owner = 'octocat';
    const repo = 'Hello-World';
    
    const result = await githubService.getCodeMetrics(owner, repo);
    
    expect(result).toHaveProperty('languages');
    expect(result).toHaveProperty('contributors');
  });

  test('deve lançar erro para repositório inexistente', async () => {
    const owner = 'inexistente';
    const repo = 'repositorio-que-nao-existe';
    
    await expect(githubService.getRepositoryInfo(owner, repo))
      .rejects
      .toThrow();
  });
}); 