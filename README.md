# Aegis AI - Sistema de Análise de Logs com IA

Sistema completo de detecção e resposta a incidentes de segurança com dois microserviços baseados em agentes de IA e interface React moderna.

## 👥 Equipe

- Arthur Rafael
- Caio Bastos
- Nicolas Lopes
- Pedro Rabelo

## � Problema Abordado

### Relevância do Problema

A análise de logs de segurança é um dos maiores desafios enfrentados por organizações modernas. Segundo o **IBM Cost of a Data Breach Report 2023**, o tempo médio para identificar e conter uma violação de dados é de **277 dias**, sendo que **73% das organizações** não conseguem detectar ataques em tempo hábil devido ao volume massivo de logs gerados diariamente.

### Dor que o Projeto Resolve

**Problemas Identificados:**
- **Sobrecarga de SOCs**: Analistas de segurança são sobrecarregados com milhares de eventos por dia
- **Alto volume de falsos positivos**: 95% dos alertas são falsos positivos, causando fadiga de alerta
- **Análise manual lenta**: Tempo médio de resposta (MTTR) elevado para classificação de incidentes
- **Falta de contextualização**: Logs isolados não fornecem visão completa da situação de segurança
- **Custos elevados**: Equipes de segurança gastam 60% do tempo em tarefas repetitivas de triagem

**Solução Proposta:**
Sistema de análise automática de logs utilizando dois agentes de IA cooperativos que reduzem o tempo de análise de horas para minutos, aumentando a precisão da detecção e liberando analistas para tarefas mais estratégicas.

## 🏗️ Arquitetura do Sistema

### Componentes Principais
- **Frontend**: React.js com Tailwind CSS e visualização em tempo real
- **Agente Local**: FastAPI + Ollama (Llama3) para análise técnica inicial
- **Agente Online**: FastAPI + Google Gemini para recomendações de mitigação
- **Containerização**: Docker & Docker Compose para deployment

### Fluxo de Dados
```
[Logs de Entrada] → [Agente Local IA] → [Resumo Técnico] → [Agente Online IA] → [Recomendações]
```

## 🔐 Documentação Arquitetônica

### 🔹 Visão Inicial (Pré-modelagem de ameaças)

#### Diagrama Arquitetônico Simplificado

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Agente Local   │    │  Agente Online  │
│   (React.js)    │◄──►│   (Llama3)      │◄──►│   (Gemini)      │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 8001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                        ┌─────────────────┐
                        │     Ollama      │
                        │   Port: 11434   │
                        └─────────────────┘
```

#### Riscos Identificados na Arquitetura Inicial

| Risco | Descrição | Impacto |
|-------|-----------|---------|
| **Comunicação sem autenticação** | APIs expostas sem controle de acesso | Alto |
| **Dados sensíveis não criptografados** | Logs trafegam em texto plano | Alto |
| **Falta de validação de entrada** | Possibilidade de log injection | Médio |
| **Ausência de auditoria** | Não há registro de quem acessa o sistema | Médio |
| **Dependência de serviços externos** | Falha na API do Gemini compromete funcionalidade | Baixo |

### 🔸 Visão Final (Pós-modelagem de ameaças)

#### Diagrama Arquitetônico com Medidas de Segurança

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Agente Local   │    │  Agente Online  │
│   (React.js)    │◄──►│   (Llama3)      │◄──►│   (Gemini)      │
│   + CORS        │    │   + Sanitização │    │   + Rate Limit  │
│   + Validação   │    │   + Health Check│    │   + Timeout     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
    [HTTPS/TLS]            [Input Validation]      [API Key Auth]
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                        ┌─────────────────┐
                        │     Ollama      │
                        │   + Isolation   │
                        │   + Monitoring  │
                        └─────────────────┘
```

#### Medidas de Mitigação Implementadas

| Medida | Implementação | Justificativa |
|--------|---------------|---------------|
| **CORS configurado** | `fastapi.middleware.cors` | Controle de origem das requisições |
| **Sanitização de entrada** | Validação via Pydantic | Prevenção contra log injection |
| **Health checks** | Endpoint `/health` | Monitoramento de disponibilidade |
| **Rate limiting** | Timeout configurado (60s) | Prevenção de DoS |
| **Isolamento de containers** | Docker network segregation | Limitação de acesso entre serviços |
| **Validação de tipos** | Pydantic BaseModel | Garantia de integridade dos dados |

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose instalados
- Chave da API do Google Gemini

### Configuração

1. Clone o repositório e configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env e adicione sua GEMINI_API_KEY
```

2. Execute com Docker Compose:
```bash
docker-compose up --build
```

### Acessos

- **Frontend**: http://localhost:3000
- **API Local**: http://localhost:8000
- **API Online**: http://localhost:8001
- **Ollama**: http://localhost:11434

## 📋 Funcionalidades

### Interface React
- ✅ Design moderno e responsivo com Tailwind CSS
- ✅ Upload de arquivos de log (.log, .txt)
- ✅ Análise em tempo real com indicadores de progresso
- ✅ Visualização de resultados com renderização de Markdown
- ✅ Status de conexão dos serviços em tempo real
- ✅ Indicadores de severidade por cor (crítico, warning, sucesso)
- ✅ Histórico de análises realizadas

### Backend
- ✅ Análise de logs com Llama3 (processamento local)
- ✅ Recomendações inteligentes com Gemini (processamento online)
- ✅ API RESTful com FastAPI e documentação automática
- ✅ CORS configurado para desenvolvimento e produção
- ✅ Health checks para monitoramento de serviços
- ✅ Tratamento robusto de erros e timeouts

## 🧩 Componentes da Solução

| Componente | Tecnologia | Função |
|------------|------------|--------|
| **Frontend** | React.js + Tailwind CSS | Interface moderna para upload e visualização de logs |
| **Agente Local** | FastAPI + Ollama (Llama3) | Análise técnica inicial e geração de resumos |
| **Agente Online** | FastAPI + Google Gemini | Geração de recomendações de mitigação |
| **Containerização** | Docker + Docker Compose | Orquestração e isolamento de serviços |

## ⚙️ Tecnologias Utilizadas

- **Frontend**: React.js, Tailwind CSS, React Markdown, Lucide Icons
- **Backend**: FastAPI, Pydantic, HTTPX, Python 3.10+
- **IA**: Ollama (Llama3), Google Gemini API
- **Containerização**: Docker, Docker Compose
- **Comunicação**: HTTP/REST APIs com CORS

## 📚 Referências

1. **IBM Security**. *Cost of a Data Breach Report 2023*. Disponível em: [https://www.ibm.com/reports/data-breach](https://www.ibm.com/reports/data-breach). Acesso em: 07 jul. 2024.

2. **Verizon**. *2023 Data Breach Investigations Report*. Disponível em: [https://www.verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/). Acesso em: 07 jul. 2024.

3. **NIST**. *Guide to Computer Security Log Management (SP 800-92)*. National Institute of Standards and Technology, 2006. Disponível em: [https://csrc.nist.gov/publications/detail/sp/800-92/final](https://csrc.nist.gov/publications/detail/sp/800-92/final)

4. **OWASP**. *Logging and Monitoring Failures - OWASP Top 10 2021*. Disponível em: [https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/](https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/)

5. **SANS Institute**. *Log Management: Centralizing Your Logs*. SANS Reading Room, 2013. Disponível em: [https://www.sans.org/reading-room/whitepapers/logging/](https://www.sans.org/reading-room/whitepapers/logging/)

6. **Ponemon Institute**. *The Cost of Malicious Insider Threats*. IBM Security, 2022. Disponível em: [https://www.ibm.com/security/data-breach/threat-intelligence/](https://www.ibm.com/security/data-breach/threat-intelligence/)

7. **Gartner**. *Market Guide for Security Information and Event Management*. Gartner Research, 2023.

8. **MITRE ATT&CK Framework**. *Defense Evasion - Indicator Removal on Host*. Disponível em: [https://attack.mitre.org/techniques/T1070/](https://attack.mitre.org/techniques/T1070/)

## 📦 Estrutura do Projeto

```
📁 aegis-AI/
├── 📁 frontend/                 # Interface React
│   ├── 📁 src/
│   │   ├── 📁 components/      # Componentes React
│   │   │   ├── Header.js       # Cabeçalho com status
│   │   │   ├── LogInput.js     # Input de logs
│   │   │   └── AnalysisResults.js # Resultados da análise
│   │   ├── 📁 services/        # Serviços de API
│   │   │   └── api.js         # Cliente HTTP
│   │   ├── App.js             # Componente principal
│   │   └── index.css          # Estilos Tailwind
│   ├── Dockerfile             # Container frontend
│   └── package.json           # Dependências React
├── 📁 agente_local/            # Agente de análise local
│   ├── main.py                # API FastAPI + Ollama
│   ├── requirements.txt       # Dependências Python
│   └── Dockerfile             # Container agente local
├── 📁 agente_online/           # Agente de recomendações
│   ├── main.py                # API FastAPI + Gemini
│   ├── requirements.txt       # Dependências Python
│   └── Dockerfile             # Container agente online
├── docker-compose.yml         # Orquestração dos serviços
├── .env.example              # Variáveis de ambiente
├── start.bat                 # Script de inicialização
└── README.md                 # Documentação do projeto
```

## 🚀 Exemplo de Uso

### 1. Análise de Logs via Interface Web

1. Acesse http://localhost:3000
2. Cole ou faça upload de logs no formato:
```
2024-07-08 10:15:23 INFO [Authentication] User login successful: user@example.com
2024-07-08 10:16:45 WARNING [Security] Multiple failed login attempts from IP 192.168.1.100
2024-07-08 10:17:12 ERROR [Database] Connection timeout to primary database
2024-07-08 10:17:30 CRITICAL [Security] Potential SQL injection attempt detected
```

3. Clique em "Analisar Logs" e visualize os resultados em tempo real

### 2. Análise via API REST

```bash
curl -X POST "http://localhost:8000/analisar_logs/" \
  -H "Content-Type: application/json" \
  -d '{"logs": "2024-07-08 10:17:30 CRITICAL [Security] Potential SQL injection attempt detected"}'
```

### 3. Resposta Esperada

```json
{
  "resumo_tecnico": "## Resumo Executivo\n\nDetectado **evento crítico** de segurança...",
  "recomendacoes_gemini": {
    "recomendacoes": "## Recomendações de Mitigação\n\n1. **Implementar WAF**..."
  }
}
```

---

*Desenvolvido pela equipe Aegis AI - UFLA 2025*
