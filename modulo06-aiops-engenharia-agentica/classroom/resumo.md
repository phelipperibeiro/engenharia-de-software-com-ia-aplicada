# Módulo 06 — resumo

## Setup

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
pip install streamlit
# GROQ API key
python3 nexus_iac_copilot.py
```

Python 3.10–3.13. Docker + kubectl para labs de Kubernetes.

## Takeaways

1. Cada lab é um script CrewAI com tools de ops reais ou simuladas.
2. Governança (OPA, Trivy, human approval) entra antes da remediação cega.
3. O projeto final (lab 12) compõe os especialistas num manager.
