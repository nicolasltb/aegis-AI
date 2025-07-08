#!/bin/sh

# Inicia o servidor Ollama em segundo plano
ollama serve &

# Espera alguns segundos pra garantir que o serve está ativo
sleep 5

# Inicializa o modelo llama3 (mantém o processo rodando)
ollama run llama3
