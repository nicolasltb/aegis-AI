from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
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
            f"""Com base no seguinte resumo técnico de segurança, gere recomendações de mitigação, boas práticas e comandos de resposta ao incidente.

**IMPORTANTE: Formate sua resposta usando Markdown com:**
- Cabeçalhos (## para seções principais, ### para subseções)
- Listas numeradas para passos sequenciais
- Listas com bullets para itens relacionados
- **Negrito** para destacar ações críticas
- `comandos` para códigos e comandos específicos
- > Citações para alertas importantes

**Resumo técnico:**
{data.resumo}

**Estrutura sugerida:**
## Avaliação de Risco
## Recomendações Imediatas
## Plano de Mitigação
## Comandos de Resposta
## Prevenção Futura"""
        )

        return {"recomendacoes": response.text}

    except Exception as e:
        return {"error": f"Erro ao contatar a API do Gemini: {e}"}

