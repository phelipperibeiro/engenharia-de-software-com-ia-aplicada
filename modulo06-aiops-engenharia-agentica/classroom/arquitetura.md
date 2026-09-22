# Arquitetura Nexus

```
nexus_iac_copilot.py     menu CLI
ui/app.py                Streamlit (S3 LocalStack + OPA sandbox)
core/agents.py           fábricas CrewAI
core/llm_config.py       Groq
tools/                   k8s, obs, chatops, governance, security, policy RAG
labs/moduloN_*.py        um script por módulo
k8s/                     manifests locais
data/                    runbooks, trivy, inventário
```

Processo típico: Agent + Task + Crew. Lab 12 usa processo **hierárquico** (manager).

Lab 11 exige aprovação humana antes de ação sensível.
