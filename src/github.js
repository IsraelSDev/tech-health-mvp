const { Octokit } = require("octokit");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

class GitHubService {
  async getRepositoryInfo(owner, repo) {
    try {
      const [repoInfo, commits, issues, pullRequests] = await Promise.all([
        octokit.rest.repos.get({ owner, repo }),
        octokit.rest.repos.listCommits({ owner, repo }),
        octokit.rest.issues.listForRepo({ owner, repo }),
        octokit.rest.pulls.list({ owner, repo }),
      ]);

      return {
        repository: repoInfo.data,
        commits: commits.data,
        issues: issues.data,
        pullRequests: pullRequests.data,
      };
    } catch (error) {
      console.error("Erro ao buscar informações do repositório:", error);
      throw error;
    }
  }

  async getCodeMetrics(owner, repo) {
    try {
      const languages = await octokit.rest.repos.listLanguages({ owner, repo });
      const contributors = await octokit.rest.repos.listContributors({
        owner,
        repo,
      });

      return {
        languages: languages.data,
        contributors: contributors.data,
      };
    } catch (error) {
      console.error("Erro ao buscar métricas do código:", error);
      throw error;
    }
  }
}

module.exports = new GitHubService();
