const axios = require('axios');

class AIRecommendations {
  constructor() {
    // Configurando a URL base para o Ollama no container Docker
    this.baseUrl = 'http://localhost:11434/api';
    this.model = 'mistral';
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Verifica se o modelo está disponível
      const response = await axios.get(`${this.baseUrl}/tags`);
      const models = response.data.models || [];
      
      if (!models.some(m => m.name === this.model)) {
        console.log(`Baixando modelo ${this.model}...`);
        await axios.post(`${this.baseUrl}/pull`, {
          name: this.model
        });
      }
      
      this.initialized = true;
      console.log('Ollama inicializado com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar Ollama:', error);
      throw new Error('Não foi possível conectar ao Ollama. Verifique se o container está rodando.');
    }
  }

  async generateRecommendations(metrics, repoInfo) {
    try {
      await this.initialize();
      const prompt = this.buildPrompt(metrics, repoInfo);

      const response = await axios.post(`${this.baseUrl}/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500
        }
      });

      // Como o modelo é mais básico, vamos combinar com recomendações padrão
      const defaultRecs = this.generateDefaultRecommendations(metrics);
      const aiRecs = this.parseRecommendations(response.data.response);
      
      return this.mergeRecommendations(defaultRecs, aiRecs);
    } catch (error) {
      console.error("Erro ao gerar recomendações:", error);
      return this.generateDefaultRecommendations(metrics);
    }
  }

  mergeRecommendations(defaultRecs, aiRecs) {
    const merged = {
      estrutura: [...new Set([...defaultRecs.estrutura, ...aiRecs.estrutura])],
      desenvolvimento: [
        ...new Set([...defaultRecs.desenvolvimento, ...aiRecs.desenvolvimento]),
      ],
      revisao: [...new Set([...defaultRecs.revisao, ...aiRecs.revisao])],
      documentacao: [
        ...new Set([...defaultRecs.documentacao, ...aiRecs.documentacao]),
      ],
      testes: [...new Set([...defaultRecs.testes, ...aiRecs.testes])],
    };

    // Limita o número de recomendações por categoria
    Object.keys(merged).forEach((category) => {
      merged[category] = merged[category].slice(0, 5);
    });

    return merged;
  }

  async benchmarkWithSimilarProjects(repoInfo) {
    try {
      await this.initialize();
      const prompt = `Compare o repositório ${repoInfo.owner}/${repoInfo.name} com projetos similares.`;
      
      const response = await axios.post(`${this.baseUrl}/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 300
        }
      });

      return response.data.response || "Não foi possível gerar o benchmark neste momento.";
    } catch (error) {
      console.error("Erro ao gerar benchmark:", error);
      return "Não foi possível gerar o benchmark neste momento. Considere comparar manualmente com projetos similares no GitHub.";
    }
  }

  buildPrompt(metrics, repoInfo) {
    return `
      Analise o repositório ${repoInfo.owner}/${repoInfo.name}:
      README: ${metrics.hasReadme ? "Sim" : "Não"}
      Licença: ${metrics.hasLicense ? "Sim" : "Não"}
      Testes: ${metrics.hasTests ? "Sim" : "Não"}
      CI/CD: ${metrics.hasCI ? "Sim" : "Não"}
      Documentação: ${metrics.hasDocumentation ? "Sim" : "Não"}
      
      Forneça recomendações para melhorar o projeto, organizadas nas seguintes categorias:
      - Estrutura
      - Desenvolvimento
      - Revisão
      - Documentação
      - Testes
      
      Cada recomendação deve começar com um hífen (-).
    `;
  }

  generateDefaultRecommendations(metrics) {
    const recommendations = {
      estrutura: [],
      desenvolvimento: [],
      revisao: [],
      documentacao: [],
      testes: [],
    };

    // Recomendações baseadas nas métricas disponíveis
    if (!metrics.hasReadme) {
      recommendations.estrutura.push(
        "Adicione um arquivo README.md com instruções de instalação e uso"
      );
    }
    if (!metrics.hasLicense) {
      recommendations.estrutura.push(
        "Adicione um arquivo LICENSE para definir os termos de uso do projeto"
      );
    }
    if (!metrics.hasTests) {
      recommendations.testes.push(
        "Implemente testes automatizados para garantir a qualidade do código"
      );
    }
    if (!metrics.hasCI) {
      recommendations.desenvolvimento.push(
        "Configure um pipeline de CI/CD para automação de testes e deploy"
      );
    }
    if (!metrics.hasDocumentation) {
      recommendations.documentacao.push(
        "Crie documentação detalhada do código e APIs"
      );
    }

    // Recomendações gerais
    recommendations.desenvolvimento.push(
      "Mantenha o código atualizado com as últimas versões das dependências"
    );
    recommendations.revisao.push(
      "Implemente um processo de code review para todas as alterações"
    );
    recommendations.documentacao.push(
      "Documente as decisões de arquitetura e design"
    );
    recommendations.testes.push(
      "Aumente a cobertura de testes para melhorar a confiabilidade"
    );

    return recommendations;
  }

  parseRecommendations(aiResponse) {
    try {
      const categories = {
        estrutura: [],
        desenvolvimento: [],
        revisao: [],
        documentacao: [],
        testes: [],
      };

      const lines = aiResponse.split("\n");
      let currentCategory = null;

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        if (trimmedLine.toLowerCase().includes("estrutura")) {
          currentCategory = "estrutura";
        } else if (trimmedLine.toLowerCase().includes("desenvolvimento")) {
          currentCategory = "desenvolvimento";
        } else if (trimmedLine.toLowerCase().includes("revisão")) {
          currentCategory = "revisao";
        } else if (trimmedLine.toLowerCase().includes("documentação")) {
          currentCategory = "documentacao";
        } else if (trimmedLine.toLowerCase().includes("testes")) {
          currentCategory = "testes";
        } else if (currentCategory && trimmedLine.startsWith("-")) {
          categories[currentCategory].push(trimmedLine.substring(1).trim());
        }
      }

      return categories;
    } catch (error) {
      console.error("Erro ao processar recomendações:", error);
      return {
        estrutura: [],
        desenvolvimento: [],
        revisao: [],
        documentacao: [],
        testes: [],
      };
    }
  }
}

module.exports = new AIRecommendations();
