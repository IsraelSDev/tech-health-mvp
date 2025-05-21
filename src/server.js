require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const githubService = require('./github');
const codeAnalysis = require('./codeAnalysis');
const reportGenerator = require('./reportGenerator');
const aiRecommendations = require('./aiRecommendations');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rotas
app.get("/", (req, res) => {
    console.log('Servindo página inicial');
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/analyze/:owner/:repo', async (req, res) => {
    try {
        console.log(`Analisando repositório: ${req.params.owner}/${req.params.repo}`);
        
        const { owner, repo } = req.params;

        // Busca informações do repositório
        console.log('Buscando informações do repositório...');
        const repoInfo = await githubService.getRepositoryInfo(owner, repo);
        const codeMetrics = await githubService.getCodeMetrics(owner, repo);

        // Analisa a estrutura e qualidade do código
        console.log('Analisando estrutura e qualidade do código...');
        const structureMetrics = codeAnalysis.analyzeRepositoryStructure(repoInfo.repository);
        const qualityMetrics = codeAnalysis.analyzeCodeQuality(
            repoInfo.commits,
            repoInfo.issues,
            repoInfo.pullRequests
        );

        // Gera recomendações usando IA
        console.log('Gerando recomendações...');
        const recommendations = await aiRecommendations.generateRecommendations(
            { ...structureMetrics, ...qualityMetrics },
            { name: repo, owner }
        );

        // Gera relatório
        console.log('Gerando relatório final...');
        const report = reportGenerator.generateTechHealthReport(
            { name: repo, owner },
            { ...structureMetrics, ...qualityMetrics },
            recommendations,
            await aiRecommendations.benchmarkWithSimilarProjects({ name: repo, owner })
        );

        console.log('Análise concluída com sucesso');
        res.json(report);
    } catch (error) {
        console.error('Erro detalhado ao analisar repositório:', error);
        res.status(500).json({ 
            error: 'Erro ao analisar repositório',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Tratamento de erros 404
app.use((req, res) => {
    console.log(`Rota não encontrada: ${req.url}`);
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros globais
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Inicialização do servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('Ambiente:', process.env.NODE_ENV || 'development');
});
