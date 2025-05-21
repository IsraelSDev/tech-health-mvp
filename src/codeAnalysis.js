class CodeAnalysis {
  analyzeRepositoryStructure(repository) {
    const metrics = {
      hasReadme: false,
      hasLicense: false,
      hasTests: false,
      hasCI: false,
      hasDocumentation: false,
    };

    if (repository.files) {
      metrics.hasReadme = repository.files.some((file) =>
        file.toLowerCase().includes("readme.md")
      );
      metrics.hasLicense = repository.files.some((file) =>
        file.toLowerCase().includes("license")
      );
      metrics.hasTests = repository.files.some(
        (file) =>
          file.toLowerCase().includes("test") ||
          file.toLowerCase().includes("spec")
      );
      metrics.hasCI = repository.files.some(
        (file) =>
          file.toLowerCase().includes(".github/workflows") ||
          file.toLowerCase().includes(".gitlab-ci.yml") ||
          file.toLowerCase().includes("travis.yml")
      );
      metrics.hasDocumentation = repository.files.some(
        (file) =>
          file.toLowerCase().includes("docs/") ||
          file.toLowerCase().includes("documentation")
      );
    }

    return metrics;
  }

  analyzeCodeQuality(commits, issues, pullRequests) {
    return {
      commitFrequency: this.calculateCommitFrequency(commits),
      issueResolutionTime: this.calculateIssueResolutionTime(issues),
      pullRequestMergeRate: this.calculatePullRequestMergeRate(pullRequests),
      codeReviewActivity: this.analyzeCodeReviewActivity(pullRequests),
    };
  }

  calculateCommitFrequency(commits) {
    if (!commits || commits.length === 0) return 0;

    const firstCommit = new Date(
      commits[commits.length - 1].commit.author.date
    );
    const lastCommit = new Date(commits[0].commit.author.date);
    const daysDiff = (lastCommit - firstCommit) / (1000 * 60 * 60 * 24);

    return commits.length / Math.max(daysDiff, 1);
  }

  calculateIssueResolutionTime(issues) {
    if (!issues || issues.length === 0) return 0;

    const resolvedIssues = issues.filter((issue) => issue.closed_at);
    if (resolvedIssues.length === 0) return 0;

    const totalResolutionTime = resolvedIssues.reduce((total, issue) => {
      const created = new Date(issue.created_at);
      const closed = new Date(issue.closed_at);
      return total + (closed - created);
    }, 0);

    return totalResolutionTime / resolvedIssues.length / (1000 * 60 * 60 * 24); // em dias
  }

  calculatePullRequestMergeRate(pullRequests) {
    if (!pullRequests || pullRequests.length === 0) return 0;

    const mergedPRs = pullRequests.filter((pr) => pr.merged_at);
    return mergedPRs.length / pullRequests.length;
  }

  analyzeCodeReviewActivity(pullRequests) {
    if (!pullRequests || pullRequests.length === 0) return 0;

    const prsWithReviews = pullRequests.filter((pr) => pr.review_comments > 0);
    return prsWithReviews.length / pullRequests.length;
  }
}

module.exports = new CodeAnalysis();
