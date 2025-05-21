document.addEventListener('DOMContentLoaded', () => {
    const repoForm = document.getElementById('repoForm');
    let scoreChart = null;
    let metricsChart = null;

    // Função para extrair owner e repo de uma URL do GitHub
    function extractRepoInfo(input) {
        // Se for uma URL do GitHub
        if (input.includes('github.com')) {
            const match = input.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (match) {
                return {
                    owner: match[1],
                    repo: match[2].replace(/\.git$/, '')
                };
            }
        }
        
        // Se for apenas o nome do repositório (formato: owner/repo)
        const parts = input.split('/');
        if (parts.length === 2) {
            return {
                owner: parts[0].trim(),
                repo: parts[1].trim()
            };
        }

        return null;
    }

    // Adiciona indicador de carregamento
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading';
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2">Analisando repositório...</p>
        `;
        document.body.appendChild(loadingDiv);
    }

    function hideLoading() {
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    // Adiciona mensagem de erro
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.role = 'alert';
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.querySelector('.container').insertBefore(errorDiv, document.querySelector('.row'));
    }

    repoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const input = document.getElementById('repo').value;
        const repoInfo = extractRepoInfo(input);

        if (!repoInfo) {
            showError('Formato inválido. Use "owner/repo" ou uma URL do GitHub.');
            return;
        }

        try {
            showLoading();
            const response = await fetch(`/api/analyze/${encodeURIComponent(repoInfo.owner)}/${encodeURIComponent(repoInfo.repo)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Erro ao analisar repositório');
            }

            const data = await response.json();
            updateDashboard(data);
        } catch (error) {
            console.error('Erro ao analisar repositório:', error);
            showError(error.message || 'Erro ao analisar repositório. Verifique o console para mais detalhes.');
        } finally {
            hideLoading();
        }
    });

    function updateDashboard(data) {
        try {
            updateScoreChart(data.score);
            updateMetricsChart(data.metrics);
            updateRecommendations(data.recommendations);
        } catch (error) {
            console.error('Erro ao atualizar dashboard:', error);
            showError('Erro ao atualizar visualização. Verifique o console para mais detalhes.');
        }
    }

    function updateScoreChart(score) {
        const ctx = document.getElementById('scoreChart');
        
        if (scoreChart) {
            scoreChart.destroy();
        }

        scoreChart = new Chart(ctx, {
            type: 'gauge',
            data: {
                datasets: [{
                    value: score.value,
                    data: [0, 20, 40, 60, 80, 100],
                    backgroundColor: [
                        '#dc3545', // Crítico
                        '#ffc107', // Precisa de Melhorias
                        '#17a2b8', // Regular
                        '#28a745', // Bom
                        '#007bff'  // Excelente
                    ]
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Score de Saúde Técnica'
                },
                needle: {
                    radiusPercentage: 2,
                    widthPercentage: 3.2,
                    lengthPercentage: 80,
                    color: 'rgba(0, 0, 0, 1)'
                },
                valueLabel: {
                    display: true,
                    formatter: (value) => `${value}%`,
                    color: 'rgba(0, 0, 0, 1)',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderRadius: 5,
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            }
        });
    }

    function updateMetricsChart(metrics) {
        const ctx = document.getElementById('metricsChart');
        
        if (metricsChart) {
            metricsChart.destroy();
        }

        const estruturaData = [
            metrics.estrutura.hasReadme ? 1 : 0,
            metrics.estrutura.hasLicense ? 1 : 0,
            metrics.estrutura.hasTests ? 1 : 0,
            metrics.estrutura.hasCI ? 1 : 0,
            metrics.estrutura.hasDocumentation ? 1 : 0
        ];

        metricsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'README',
                    'Licença',
                    'Testes',
                    'CI/CD',
                    'Documentação'
                ],
                datasets: [{
                    label: 'Estrutura do Projeto',
                    data: estruturaData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });
    }

    function updateRecommendations(recommendations) {
        const container = document.getElementById('recommendations');
        container.innerHTML = '';

        Object.entries(recommendations).forEach(([category, items]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'mb-4';
            
            const categoryTitle = document.createElement('h6');
            categoryTitle.className = 'text-uppercase mb-3';
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'recommendation-item';
                
                const itemText = document.createElement('p');
                itemText.textContent = item;
                itemDiv.appendChild(itemText);
                
                categoryDiv.appendChild(itemDiv);
            });

            container.appendChild(categoryDiv);
        });
    }
}); 