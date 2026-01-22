# PriClaim – MVP Todo List

**Status:** Active  
**Scope:** Phase 1 (Single hospital, desktop-first)  
**Last Updated:** 2026-01-22

---

## 0. Repo & Project Setup (Foundation)

- [ ] Create monorepo structure
  ```
  /frontend
  /backend
  /docs
  ```
- [ ] Add `README.md` (high-level product + setup)
- [ ] Add `ADR.md`, `schemas.md`, `todo.md` to `/docs`
- [ ] Initialize Git repository
- [ ] Create `.gitignore` for Python + Node
- [ ] Create `.env.example` for both frontend and backend
- [ ] Create main branch protection rules

---

## 1. Backend Setup (FastAPI)

### 1.1 Core Backend Skeleton

- [ ] Initialize FastAPI app (Python 3.11)
- [ ] Setup virtual environment
- [ ] Configure project structure:
  ```
  backend/
   ├─ app/
   │  ├─ main.py
   │  ├─ api/
   │  ├─ core/
   │  ├─ services/
   │  ├─ models/
   │  └─ schemas/
  ```
- [ ] Enable CORS (frontend access)
- [ ] Setup environment variable management (python-dotenv)
- [ ] Configure logging (structured JSON logs)
- [ ] Add health check endpoint (`GET /health`)
- [ ] Add global error handling middleware

### 1.2 Supabase Integration

- [ ] Create Supabase project
- [ ] Enable pgvector extension
- [ ] Setup database connection
- [ ] Implement base DB session handler
- [ ] Create tables:
  - [ ] `hospitals`
  - [ ] `users`
  - [ ] `insurance_policies`
  - [ ] `claims`
  - [ ] `audit_reports`

### 1.3 Authentication & Roles

- [ ] Integrate Supabase Auth
- [ ] Implement middleware for auth validation
- [ ] Implement role-based access (`admin` / `user`)
- [ ] Restrict policy management to admin only

---

## 2. Document Ingestion & OCR Pipeline

### 2.1 File Upload

- [ ] Implement `POST /api/v1/ingest`
- [ ] Validate file type (PDF only for MVP)
- [ ] Store file securely (Supabase Storage)
- [ ] Generate `job_id`
- [ ] Create claim record with `status = queued`

### 2.2 Async OCR Processing

- [ ] Integrate AWS Textract
- [ ] Implement background task for OCR
- [ ] Extract raw OCR output
- [ ] Persist OCR metadata
- [ ] Update job status → `ocr_processing`

### 2.3 OCR Normalization

- [ ] Normalize OCR output into Normalized Claim Schema
- [ ] Attach confidence scores
- [ ] Flag low-confidence fields (`< 0.90`)
- [ ] Persist normalized claim data
- [ ] Update job status → `auditing`

---

## 3. Policy Management (Admin)

### 3.1 Policy Upload

- [ ] Implement policy upload endpoint
- [ ] Store raw policy PDF
- [ ] Extract text from policy
- [ ] Chunk policy text (500 tokens, 50 overlap)

### 3.2 Policy Vectorization

- [ ] Generate embeddings (OpenAI `text-embedding-3-small`)
- [ ] Store embeddings in pgvector
- [ ] Associate chunks with policy ID
- [ ] Validate vector search correctness

---

## 4. RAG Audit Engine

### 4.1 Clause Retrieval

- [ ] Implement vector similarity search
- [ ] Retrieve top N relevant clauses
- [ ] Reject audit if no clauses found
- [ ] Log similarity scores for debugging

### 4.2 LLM Reasoning

- [ ] Integrate Groq (Llama 3 70B)
- [ ] Create strict audit prompt
- [ ] Enforce schema-constrained output (JSON mode)
- [ ] Block hallucinations (context-only rule)

### 4.3 Risk Scoring

- [ ] Compute `risk_score` (0–100)
- [ ] Assign `risk_level` (`LOW` / `MEDIUM` / `HIGH`)
- [ ] Generate summary + findings
- [ ] Persist audit result

---

## 5. Human-in-the-Loop Editing

### 5.1 Editable Claim Data

- [ ] Expose normalized claim data to frontend
- [ ] Allow field-level edits
- [ ] Track user overrides vs OCR values

### 5.2 Re-Audit Flow

- [ ] Re-run RAG on edited data
- [ ] Invalidate previous audit
- [ ] Persist new audit report
- [ ] Maintain audit history

---

## 6. API Endpoints (Public Contract)

- [ ] `GET /api/v1/status/{job_id}` — Get job status
- [ ] `GET /api/v1/report/{claim_id}` — Get audit report
- [ ] `POST /api/v1/finalize` — Finalize claim
- [ ] Validate responses against `schemas.md`
- [ ] Add basic rate limiting
- [ ] Generate OpenAPI documentation (auto from FastAPI)

---

## 7. Frontend Setup (React + Tailwind)

### 7.1 Frontend Skeleton

- [ ] Initialize React 18 + Vite
- [ ] Setup Tailwind CSS
- [ ] Configure global theme (Lumina design system)
- [ ] Setup API client (axios/fetch wrapper)
- [ ] Add error boundary components
- [ ] Add global loading states / skeletons

### 7.2 Auth UI

- [ ] Login page
- [ ] Auth-protected routes
- [ ] Role-based UI visibility (admin vs user)

---

## 8. Core App UI Pages

### 8.1 Dashboard

- [ ] KPI cards (total claims, approval rate, etc.)
- [ ] Recent claims table
- [ ] Status badges (color-coded)

### 8.2 Claims List

- [ ] Claims table with pagination
- [ ] Search & filters
- [ ] "Upload Claim" CTA button

### 8.3 Claim Upload

- [ ] Drag & drop upload zone
- [ ] Upload progress indicator
- [ ] Polling job status with loading state

### 8.4 Claim Audit (Core Page) ⭐

> This is the most critical page in the app.

- [ ] Split-pane layout (PDF | Data)
- [ ] PDF viewer (embedded)
- [ ] Editable extracted fields
- [ ] Risk indicator (color + score)
- [ ] Policy evidence viewer (cited clauses)
- [ ] "Re-run Audit" CTA

### 8.5 Policy Management (Admin)

- [ ] Upload policy UI
- [ ] Policy list table

---

## 9. Security & Compliance

- [ ] Mask PII before LLM calls
- [ ] Encrypt stored files (AES-256)
- [ ] Validate access per hospital (row-level security)
- [ ] Add audit logging (who did what, when)
- [ ] Implement DPDP Act compliance checklist

---

## 10. Testing & Validation

- [ ] Create dummy claim dataset (5-10 samples)
- [ ] Test OCR edge cases (handwritten, poor scans)
- [ ] Test hallucination prevention (no context = no answer)
- [ ] UI manual testing (all flows)
- [ ] End-to-end latency check (`< 10s`)
- [ ] Write API integration tests (pytest)

---

## 11. DevOps & Deployment

- [ ] Setup deployment platform (Railway / Render / Vercel)
- [ ] Configure CI/CD pipeline (GitHub Actions)
- [ ] Setup staging environment
- [ ] Configure environment secrets
- [ ] Setup monitoring / error tracking (Sentry optional)

---

## 12. GitHub & Code Quality

- [ ] Push repo to GitHub
- [ ] Setup CodeRabbit for PR reviews
- [ ] Enable PR-based development (no direct main commits)
- [ ] Resolve CodeRabbit findings

---

## 13. Alpha Readiness

- [ ] Internal demo walkthrough
- [ ] Fix critical UX issues
- [ ] Prepare pilot hospital onboarding docs
- [ ] Freeze MVP scope

---

## 🚀 Definition of MVP Done

> All of the following must be true:

- [ ] Claims can be uploaded (PDF)
- [ ] AI audits against real policies
- [ ] Risk score + evidence shown in UI
- [ ] Human edits re-trigger audit
- [ ] Claim can be finalized
- [ ] Landing page + app feel consistent (Lumina design)
- [ ] Deployed to staging environment
- [ ] Demo-ready for pilot hospital

---

## Progress Tracker

| Section | Status | Notes |
|---------|--------|-------|
| 0. Repo Setup | 🔲 Not Started | |
| 1. Backend Setup | 🔲 Not Started | |
| 2. OCR Pipeline | 🔲 Not Started | |
| 3. Policy Management | 🔲 Not Started | |
| 4. RAG Engine | 🔲 Not Started | |
| 5. Human-in-Loop | 🔲 Not Started | |
| 6. API Endpoints | 🔲 Not Started | |
| 7. Frontend Setup | 🔲 Not Started | |
| 8. Core UI Pages | 🔲 Not Started | |
| 9. Security | 🔲 Not Started | |
| 10. Testing | 🔲 Not Started | |
| 11. DevOps | 🔲 Not Started | |
| 12. Code Quality | 🔲 Not Started | |
| 13. Alpha Ready | 🔲 Not Started | |

**Legend:** 🔲 Not Started | 🔶 In Progress | ✅ Complete

---

**END OF TODO**