# PriClaim

PriClaim is an AI-powered medical insurance claim auditing platform.
It ingests medical claim PDFs, audits them against insurance policies using
retrieval-augmented generation (RAG), and produces risk-scored audit reports
with explainable policy evidence.

## MVP Scope
- Single hospital
- Desktop-first
- Admin + User roles
- PDF-only claims
- Human-in-the-loop corrections

## Tech Stack
**Backend**
- FastAPI (Python 3.11)
- Supabase (Postgres + Auth + Storage)
- AWS Textract (OCR)
- pgvector (policy embeddings)
- Groq (Llama 3 70B)

**Frontend**
- React 18
- Vite
- Tailwind CSS
- Supabase Auth

## Repository Structure
