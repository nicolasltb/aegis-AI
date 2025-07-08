from fastapi import FastAPI
import httpx
import os
from pydantic import BaseModel

app = FastAPI()

class LogRequest(BaseModel):
    logs: str

OLLAMA_HOST = os.getenv("OLLAMA_HOST")
AGENT2_API_URL = os.getenv("AGENT2_API_URL")

print(OLLAMA_HOST)

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
                        "content": f"Analise os seguintes logs e gere um resumo técnico da situação de segurança:\n{request.logs}",
                    }
                ],
                "stream": False,
            }
            response_ollama = await client.post(f"{OLLAMA_HOST}/api/chat", json=payload, timeout=300.0)
            print(response_ollama)
            response_ollama.raise_for_status()
            resumo_tecnico = response_ollama.json()["message"]["content"]

        # Envio para o Agente Online
        async with httpx.AsyncClient() as client:
            response_gemini = await client.post(
                AGENT2_API_URL, json={"resumo": resumo_tecnico}
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