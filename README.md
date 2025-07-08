# Aegis-AI

Sistema Distribuído Inteligente para Detecção e Análise Automatizada de Incidentes de Segurança

---

## 🎯 Objetivo do Projeto

Desenvolver um sistema distribuído utilizando dois agentes de Inteligência Artificial que cooperam para:

- Detectar anomalias em logs de rede e sistema (IA 1 - Sensor)
- Classificar eventos como incidentes ou falsos positivos (IA 2 - Analista)
- Registrar e disponibilizar os eventos analisados via API REST

---

## 🧩 Componentes da Solução

| Componente      | Função                                                                     |
| --------------- | -------------------------------------------------------------------------- |
| IA 1 – Sensor   | Detecta anomalias com modelos locais (PyOD, Isolation Forest)              |
| IA 2 – Analista | Classifica o incidente com base em técnicas supervisionadas (scikit-learn) |
| RabbitMQ / gRPC | Comunicação entre agentes                                                  |
| API REST        | Exposição dos incidentes analisados                                        |

---

## ⚙️ Tecnologias Utilizadas

- **Docker**: containerização dos agentes
- **Python**: desenvolvimento dos agentes e API
- **FastAPI**: criação da API REST
- **RabbitMQ** ou **gRPC**: comunicação entre agentes
- **PyOD**, **Scikit-learn**: detecção e classificação de anomalias

---

## 🔐 Documentação Arquitetônica

### 🔹 Visão Inicial (Pré-modelagem de ameaças)

#### Diagrama Simplificado

```
[ Fontes de Log ]
       ↓
  [ IA 1: Sensor ] ← Docker
       ↓ gRPC / MQ
  [ IA 2: Analista ]
       ↓
    [ API REST ]
```

#### Riscos

- Comunicação entre agentes sem autenticação
- Dados sensíveis sem criptografia
- API sem controle de acesso
- Possibilidade de spoofing/log injection

### 🔸 Visão Final (Pós-modelagem de ameaças)

| Medida                      | Justificativa                  |
| --------------------------- | ------------------------------ |
| TLS em gRPC/RabbitMQ        | Criptografia de ponta-a-ponta  |
| JWT entre agentes           | Autenticação e autorização     |
| Sanitização de entradas     | Prevenção contra log injection |
| API com autenticação        | Controle de acesso básico      |
| Logging assíncrono e seguro | Auditabilidade e desempenho    |

---

## ✅ Validação do Problema

### Relevância

Empresas lidam com grandes volumes de logs, mas a maioria dos ataques é detectada tardiamente por falta de análise contextual automatizada.

### Dor

- Sobrecarga de SOCs (centros de operação de segurança)
- Alto volume de falsos positivos
- Tempo médio de resposta elevado (MTTR)

Este projeto busca aplicar IA para reduzir o esforço humano e acelerar a triagem de incidentes.

---

## 📚 Referências

- IBM. *Cost of a Data Breach Report 2023*. Disponível em: [https://www.ibm.com/reports/data-breach](https://www.ibm.com/reports/data-breach)
- VERIZON. *Data Breach Investigations Report 2024*. Disponível em: [https://www.verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/)
- NIST. *Guide to Intrusion Detection and Prevention Systems (SP 800-94)*. 2007.
- OWASP. *Logging and Monitoring Failures*. [https://owasp.org/Top10/A09\_2021-Logging\_and\_Monitoring\_Failures/](https://owasp.org/Top10/A09_2021-Logging_and_Monitoring_Failures/)
- SCARFONE, K.; MELL, P. *Guide to Intrusion Detection and Prevention Systems*. NIST, 2007.

---

## 📦 Estrutura Esperada

```
📁 aegis-ai/
├── ia_sensor/
│   └── main.py
├── ia_analista/
│   └── main.py
├── api/
│   └── main.py
├── docker-compose.yml
└── README.md
```

---

## 🚀 Execução (simulada)

```bash
# Subir os containers
$ docker-compose up --build

# Testar a API
GET http://localhost:8000/analisar_logs
```

---

## 👥 Equipe

- Arthur Rafael
- Caio Bastos
- Nicolas Lopes
- Pedro Rabelo

Nome do Projeto: **Aegis-AI**

