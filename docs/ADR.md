# Architecture Decision Record (ADR)

**Project:** PriClaim  
**Version:** 1.0  
**Status:** Accepted (MVP)  
**Last Updated:** 2026-01-22

---

## 1. Context & Goals

PriClaim is an AI-powered pre-submission insurance claim audit platform for hospitals. The system ingests medical claim PDFs, audits them against insurance policy clauses using a Retrieval-Augmented Generation (RAG) pipeline, and returns a risk score with explainable evidence.

### Primary Goals

- Reduce insurance claim rejection rates
- Provide <10s end-to-end audit latency
- Ensure explainability (no black-box AI)
- Support human-in-the-loop correction
- Comply with Indian DPDP Act + healthcare standards

### Non-Goals (MVP)

- Real-time TPA integration
- Batch uploads
- Mobile-first UX
- Multi-hospital tenancy

---

## 2. High-Level Architecture Overview

```
[Frontend (React)]
        |
        v
[FastAPI Backend]
        |
        |-- Async OCR (AWS Textract)
        |-- Embedding Generation
        |-- pgvector Search
        |-- LLM Reasoning (Groq)
        |
        v
[PostgreSQL (Supabase)]
```

> **Key Principle:** AI is a validator, not a decision-maker.

---

## 3. Core Architectural Decisions

### ADR-001: Monorepo with Frontend + Backend Separation

**Decision:**  
Use a single repository with clear separation:

```
/frontend
/backend
/docs
```

**Rationale:**
- Easier coordination between UI and backend
- Shared understanding of data contracts
- Faster iteration for a solo/founder-led build

**Alternatives Considered:**
- Separate repos → rejected (overhead too high for MVP)

---

### ADR-002: Backend Framework — FastAPI (Python 3.11)

**Decision:**  
Use FastAPI as the backend framework.

**Rationale:**
- Native async support (critical for OCR + LLM calls)
- Excellent OpenAPI support
- Strong ecosystem for AI / ML workloads
- Clean separation of sync vs async endpoints

**Alternatives Considered:**
- Django → rejected (too heavy)
- Node.js → rejected (Python ecosystem stronger for AI)

---

### ADR-003: OCR as Asynchronous Background Task

**Decision:**  
OCR and embedding generation will run asynchronously using FastAPI background tasks.

**Flow:**
1. User uploads PDF
2. API returns `job_id`
3. OCR + embeddings run in background
4. Frontend polls status endpoint

**Rationale:**
- Prevents UI blocking
- Improves perceived performance
- Matches hospital workflow (they multitask)

**Alternatives Considered:**
- Synchronous OCR → rejected (slow UX)

---

### ADR-004: OCR Engine — AWS Textract

**Decision:**  
Use AWS Textract for OCR in MVP.

**Rationale:**
- High accuracy for medical documents
- Handles tables and forms well
- Production-grade and scalable

**Risks:**
- Handwritten notes may be inaccurate

**Mitigation:**
- Low-confidence OCR fields flagged in UI for manual review

---

### ADR-005: Vector Store — PostgreSQL + pgvector

**Decision:**  
Use pgvector extension inside Supabase PostgreSQL.

**Rationale:**
- Reduces infrastructure complexity
- Keeps vectors close to relational data
- Sufficient performance for MVP scale
- Easier backups and access control

**Alternatives Considered:**
- Pinecone / Weaviate → rejected (unnecessary infra)

---

### ADR-006: RAG Strategy — Strict Context Retrieval

**Decision:**  
Use strict RAG:
- Retrieve top N policy clauses
- LLM is forbidden from answering outside retrieved context

**Rationale:**
- Prevents hallucinations
- Ensures explainability
- Critical for medical + financial domain

**Implementation Rule:**  
If no relevant clause is retrieved → AI must respond with:

> "Insufficient policy context to evaluate this claim."

---

### ADR-007: LLM Provider — Groq (Llama 3 70B)

**Decision:**  
Use Groq-hosted Llama 3 70B for reasoning.

**Rationale:**
- Sub-second latency
- Strong reasoning capability
- Cost-effective compared to GPT-4
- Suitable for real-time UX

**Alternatives Considered:**
- GPT-4 → rejected (latency + cost)
- Local models → rejected (ops overhead)

---

### ADR-008: Embeddings Model — OpenAI text-embedding-3-small

**Decision:**  
Use OpenAI embeddings for policy and claim vectorization.

**Rationale:**
- High-quality embeddings
- Stable performance
- Adequate dimension size for pgvector

> **Note:** Embeddings provider can be swapped later without changing schema.

---

### ADR-009: Human-in-the-Loop as First-Class Feature

**Decision:**  
Manual correction is part of the core flow, not an edge case.

**Implications:**
- OCR output must be editable
- Audit must be re-runnable instantly
- Edited data overrides OCR output for re-audit

**Rationale:**
- Medical data is imperfect
- Trust increases when users can intervene
- Improves real-world accuracy

---

### ADR-010: Frontend Architecture — React + Tailwind

**Decision:**  
Use React 18 with Tailwind CSS.

**Rationale:**
- Component-driven UI
- Tailwind matches Brandio-style layouts well
- Faster iteration without custom CSS debt

**Design Constraint:**  
UI components must map 1:1 with backend data contracts.

---

### ADR-011: Auth & Access Control — Supabase Auth

**Decision:**  
Use Supabase Auth for MVP.

**Roles:**
- Admin
- User

**Rationale:**
- Fast to implement
- Secure by default
- Supports future RBAC expansion

---

### ADR-012: Data Security & Privacy

**Decisions:**
- Encrypt all stored files (AES-256)
- Mask PII before sending to LLM
- No raw PDFs sent to LLM
- All LLM prompts logged for auditability

**Rationale:**
- DPDP Act compliance
- HIPAA-aligned principles
- Reduces blast radius of breaches

---

## 4. System Boundaries

> [!IMPORTANT]
> **Final authority always remains with the hospital.**

### AI Can:
- Flag risks
- Suggest corrections
- Cite policy clauses

### AI Cannot:
- Approve or reject claims
- Invent policy rules
- Modify data without human action

---

## 5. Performance Targets

| Metric | Target |
|--------|--------|
| Upload → audit score | <10 seconds |
| OCR processing | async |
| RAG query | <2 seconds |
| UI feedback | immediate |

---

## 6. Deferred Decisions (Phase 2)

The following are explicitly **out of scope** for MVP:

- Batch uploads
- Multi-tenant shared DB
- On-prem deployment
- Policy versioning
- TPA outcome feedback loop

---

## 7. Consequences

### Positive
- Clear development path
- Minimal infra complexity
- High trustworthiness
- Easy to explain to hospitals and investors

### Trade-offs
- Slightly slower OCR vs custom pipeline
- Manual polling instead of push events
- Limited scale initially

> All trade-offs are acceptable for MVP.