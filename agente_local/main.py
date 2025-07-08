from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LogRequest(BaseModel):
    logs: str

OLLAMA_HOST = os.getenv("OLLAMA_HOST")
AGENT2_API_URL = os.getenv("AGENT2_API_URL")

print(OLLAMA_HOST)

@app.get("/health")
async def health_check():
    """
    Health check endpoint for frontend connection status.
    """
    return {"status": "healthy", "service": "agente_local"}

@app.post("/analisar_logs/")
async def analisar_logs(request: LogRequest):
    """
    Recebe logs, analisa com a API do Ollama e envia o resumo para o agente online.
    """
    try:
        # Análise com Ollama via API HTTP
        async with httpx.AsyncClient() as client:
            payload = {
                "model": "llama3",
                "messages": [
                    {
                        "role": "user",
                        "content": f"""Analise os seguintes logs e gere um resumo técnico em Português (PT-BR) da situação de segurança.

**IMPORTANTE: Formate sua resposta usando Markdown com:**
- Cabeçalhos (## para seções principais, ### para subseções)
- Listas numeradas ou com bullets para organizar informações
- **Negrito** para destacar pontos importantes
- `código` para destacar IPs, comandos ou identificadores técnicos
- > Citações para destacar alertas ou informações críticas

**Logs para análise:**
{request.logs}

**Estrutura sugerida:**
## Resumo Executivo
## Eventos Críticos Identificados
## Análise de Segurança
## Indicadores de Comprometimento""",
                    }
                ],
                "stream": False,
            }
            response_ollama = await client.post(f"{OLLAMA_HOST}/api/chat", json=payload, timeout=500.0)
            print(response_ollama.json())
            response_ollama.raise_for_status()
            resumo_tecnico = response_ollama.json()["message"]["content"]

        # Envio para o Agente Online
        async with httpx.AsyncClient() as client:
            response_gemini = await client.post(
                AGENT2_API_URL, json={"resumo": resumo_tecnico}, timeout=500.0
            )
            response_gemini.raise_for_status()
            recomendacoes = response_gemini.json()

        return {
            "resumo_tecnico": resumo_tecnico,
            "recomendacoes_gemini": recomendacoes,
        }

    except httpx.RequestError as e:
        return {"error": f"Erro de comunicação com um dos serviços: {e}"}
    except Exception as e:
        return {"error": f"Erro inesperado: {e}"}