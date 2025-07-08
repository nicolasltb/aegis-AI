from fastapi import FastAPI
import google.generativeai as genai
import os

app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

@app.post("/processar_resumo/")
async def processar_resumo(data: dict):
    resumo = data.get("resumo")
    if not resumo:
        return {"error": "Resumo não fornecido"}

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            f"Com base no seguinte resumo técnico de segurança, gere recomendações de mitigação, boas práticas e, se aplicável, comandos de resposta ao incidente:\n{resumo}"
        )

        return {"recomendacoes": response.text}

    except Exception as e:
        return {"error": f"Erro ao contatar a API do Gemini: {e}"}

