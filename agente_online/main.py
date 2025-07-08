from fastapi import FastAPI
import google.generativeai as genai
import os
from pydantic import BaseModel


app = FastAPI()

class LogRequest(BaseModel):
    resumo: str

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

@app.post("/processar_resumo/")
async def processar_resumo(data: LogRequest):
    if not data.resumo:
        return {"error": "Resumo não fornecido"}

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            f"Com base no seguinte resumo técnico de segurança, gere recomendações de mitigação, boas práticas e, se aplicável, comandos de resposta ao incidente:\n{data.resumo}"
        )

        return {"recomendacoes": response.text}

    except Exception as e:
        return {"error": f"Erro ao contatar a API do Gemini: {e}"}

