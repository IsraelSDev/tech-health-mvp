# Tech Health MVP

MVP para análise de saúde técnica de repositórios usando Ollama em Docker.

## Requisitos

- Docker Desktop (Windows/Mac) ou Docker Engine (Linux)
- Node.js 16+
- npm

## Instalação do Docker

### Windows
1. Baixe o Docker Desktop em: https://www.docker.com/products/docker-desktop
2. Execute o instalador e siga as instruções
3. Reinicie o computador
4. Abra o Docker Desktop e aguarde a inicialização

### Linux
```bash
# Instale o Docker Engine
curl -fsSL https://get.docker.com | sh

# Instale o Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### macOS
1. Baixe o Docker Desktop em: https://www.docker.com/products/docker-desktop
2. Arraste o aplicativo para a pasta Applications
3. Abra o Docker Desktop e aguarde a inicialização

## Configuração do Projeto

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd tech-health-mvp
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

## Executando com Docker

### Usando Docker Desktop (Recomendado para Windows/macOS)
1. Abra o Docker Desktop
2. Vá para a aba "Containers"
3. Clique em "New container"
4. Use a imagem `ollama/ollama:latest`
5. Configure a porta 11434
6. Clique em "Run"

### Usando Linha de Comando
1. Inicie o container do Ollama:
```bash
# Windows (PowerShell)
docker compose up -d

# Linux/macOS
docker-compose up -d
```

2. Aguarde alguns minutos para o download do modelo Mistral (aproximadamente 4GB)

3. Inicie o servidor da aplicação:
```bash
npm run dev
```

4. Acesse a interface web em `http://localhost:3000`

## Comandos Úteis

- Verificar status do container:
```bash
# Windows
docker compose ps

# Linux/macOS
docker-compose ps
```

- Ver logs do Ollama:
```bash
# Windows
docker compose logs -f ollama

# Linux/macOS
docker-compose logs -f ollama
```

- Parar o container:
```bash
# Windows
docker compose down

# Linux/macOS
docker-compose down
```

- Reiniciar o container:
```bash
# Windows
docker compose restart

# Linux/macOS
docker-compose restart
```

## Solução de Problemas

1. Se o Ollama não estiver respondendo:
   - Verifique se o container está rodando: `docker-compose ps`
   - Verifique os logs: `docker-compose logs ollama`
   - Reinicie o container: `docker-compose restart`

2. Se o modelo não estiver disponível:
   - Aguarde alguns minutos para o download completo
   - Verifique os logs para progresso do download

3. Se a aplicação não conseguir se conectar:
   - Verifique se o container está rodando
   - Verifique se a porta 11434 está disponível
   - Reinicie a aplicação: `npm run dev`

## Funcionalidades

- Integração com a API do GitHub para análise de repositórios
- Análise de código automatizada
- Geração de relatórios técnicos
- Recomendações baseadas em IA para melhorias
- Benchmarking com projetos similares

## Uso

Para iniciar o servidor em modo desenvolvimento:
```bash
npm run dev
```

Para executar os testes:
```bash
npm test
```

## Estrutura do Projeto

```
tech-health-mvp/
│
├── src/
│   ├── github.js                 # Integração com a API do GitHub
│   ├── codeAnalysis.js           # Funções de análise de código
│   ├── reportGenerator.js        # Geração do Tech Health Appendix
│   ├── aiRecommendations.js      # Uso de IA para benchmarking e melhorias
│   └── server.js                 # Configuração do servidor Express
│
├── tests/
│   ├── github.test.js
│   ├── codeAnalysis.test.js
│   ├── reportGenerator.test.js
│   └── aiRecommendations.test.js
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT. 