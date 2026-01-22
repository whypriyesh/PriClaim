# Product Requirement Document (PRD): PriClaim AI
**Version:** 1.0.0
**Date:** January 21, 2026
**Project Lead:** Pri (Full-Stack AI Engineer)
**Target:** Indian Healthcare Market (Hospitals & Nursing Homes)

---

## 1. Executive Summary
PriClaim AI is a "Pre-Submission Gatekeeper" SaaS designed to solve the ₹25,000 Crore problem of insurance claim rejections in India. By utilizing a Retrieval-Augmented Generation (RAG) pipeline, the platform audits medical documents against insurance policy clauses in real-time. The goal is to reduce hospital claim rejection rates from 20% to <5% and accelerate the revenue cycle by 80%.

---

## 2. The Problem Landscape (2026 Context)
Despite digitalization, Indian hospitals face massive revenue leakage.
- **Administrative Friction:** 65% of rejections are due to typos, missing signatures, or mismatched ICD-10/CPT codes.
- **Complexity:** A single hospital manages 40+ insurance providers, each with 200+ different policy variants.
- **Manual Overhead:** Human auditors spend 45 minutes per claim; PriClaim AI does it in <10 seconds.

---

## 3. User Personas

### 3.1 Rajesh: The Hospital Billing Officer
- **Goal:** Clear the "Discharge Queue" of 50+ patients daily.
- **Pain Point:** Getting claims returned by TPAs for "Minor Discrepancies."
- **Need:** An instant "Pass/Fail" indicator for every bill.

### 3.2 Dr. Kavita: The Medical Auditor
- **Goal:** Verify clinical documentation for high-value claims (>₹5 Lakhs).
- **Pain Point:** Navigating the 80-page "Terms & Conditions" of corporate insurance policies.
- **Need:** High-accuracy semantic search to find "Exclusion Clauses" instantly.

---

## 4. Functional Specifications

### [Module A] Document Ingestion Pipeline (FastAPI & OCR)
- **Multi-Source Upload:** Support for drag-and-drop PDFs, multi-page JPEGs, and PNG scans.
- **OCR Engine:** Integration with high-accuracy medical OCR (e.g., LayoutLM or AWS Textract) to extract:
  - Patient Demographics
  - Diagnosis (ICD-10 codes)
  - Treatment/Surgical procedures
  - Pharmacy line items
- **Asynchronous Processing:** FastAPI `BackgroundTasks` must handle the OCR and Embedding generation so the user isn't blocked.

### [Module B] The RAG Audit Engine (Postgres + pgvector + Groq)
- **Policy Vectorization:** All insurance policy PDFs are chunked (500 tokens with 50-token overlap) and stored as embeddings in `pgvector`.
- **Semantic Search:** When a claim is uploaded, the system retrieves the top 5 relevant policy clauses based on the diagnosis and treatment provided.
- **The Reasoning:** The retrieved context is sent to **Groq (Llama 3 70B)** with a prompt to find mismatches (e.g., "Patient is claiming for Robotic Surgery, but Policy Clause 4.2 excludes non-laparoscopic procedures").

### [Module C] Traffic Light Scoring System (UI/UX)
- **🟢 Green (90%+):** High success probability. Export button enabled.
- **🟡 Yellow (60-89%):** Warning. Displays "Potential Mismatches" (e.g., date of birth on bill doesn't match the policy).
- **🔴 Red (<60%):** Critical Failure. AI highlights the exact "Exclusion Clause" found.

### [Module D] Collaborative Editor (React & Tailwind)
- **Split-Pane Viewer:** Left side shows the original medical PDF; Right side shows a pre-filled JSON form of extracted data.
- **Manual Override:** If OCR misses a digit, the user corrects it. The "Audit" button re-triggers the RAG loop instantly (leveraging Groq's sub-second latency).

---

## 5. Technical Requirements

### 5.1 Database Schema (PostgreSQL)
- **`hospitals`**: `id`, `name`, `license_key`, `created_at`.
- **`insurance_policies`**: `id`, `provider_name`, `policy_type`, `raw_text`, `embedding` (VECTOR-1536).
- **`claims`**: `id`, `patient_name`, `policy_id`, `status` (Draft/Audited/Rejected), `risk_score`.
- **`audit_reports`**: `claim_id`, `ai_remarks`, `suggested_corrections`, `timestamp`.

### 5.2 API Specifications (FastAPI)
- `POST /api/v1/ingest`: Ingests document -> Returns `job_id`.
- `GET /api/v1/status/{job_id}`: Returns processing status (OCR/Auditing/Complete).
- `GET /api/v1/report/{claim_id}`: Fetches the AI-generated audit report + Citations.
- `POST /api/v1/finalize`: Marks the claim as verified and ready for TPA submission.

---

## 6. Non-Functional Requirements (NFR)

- **Performance:** End-to-end audit (Upload -> Score) must take **< 10 seconds**.
- **Privacy (DPDP Act 2023):** - **PII Masking:** Names and Phone numbers are hashed/masked before being sent to the Groq API.
  - **Encryption:** All medical records encrypted using AES-256.
- **Compliance:** Built to align with NABH (India) and HIPAA (Global) data standards.

---

## 7. User Stories

1. **Upload & Scan:** "As a Billing Officer, I want to upload 10 different bills at once so I can process them in a batch while I handle other tasks."
2. **Contextual Proof:** "As an Auditor, I want to click on a 'Red Flag' and be taken to the exact page/paragraph in the policy PDF that justifies the rejection."
3. **Drafting:** "As a user, I want to save an incomplete audit as a 'Draft' so I can come back once I receive the missing lab reports from the doctor."

---

## 8. Risk Assessment & Mitigations
- **OCR Inaccuracy:** Handwritten prescriptions are hard to read. *Mitigation:* The UI will flag low-confidence OCR fields in **Yellow** for manual check.
- **AI Hallucination:** AI might "invent" a policy rule. *Mitigation:* "Strict Context" prompt engineering—AI is forbidden from answering if the clause isn't in the retrieved text.

---

## 9. Roadmap (Phase 1)
- **Week 1-2:** FastAPI backend + Postgres `pgvector` setup + OCR Pipeline.
- **Week 3-4:** RAG logic integration with Groq + Prompt Tuning.
- **Week 5-6:** React/Tailwind Dashboard + Real-time Audit UI.
- **Week 7-8:** Alpha testing with "Dummy Claim" datasets.

---
## 10. Authentication & Access

### 10.1 MVP Design
- **Supabase Auth** for email + password login
- **2 roles only:**
  - **Admin**: Full access, manages users
  - **User**: Upload claims, view own reports
- Single hospital per deployment initially

### 10.2 Database Addition
```sql
ALTER TABLE hospitals ADD COLUMN admin_email VARCHAR(255);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id),
  email VARCHAR(255) UNIQUE,
  role VARCHAR(20) DEFAULT 'user', -- 'admin' or 'user'
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Scale Path:** Add granular roles (Auditor, Viewer) and multi-tenant shared DB in Phase 2.

---

## 11. Policy Management

### 11.1 MVP Design
- Hospital admin uploads their own policy PDFs
- One policy = one file (no complex versioning yet)
- Manual re-upload to "update" a policy (creates new record)

**Scale Path:** Build a "Policy Library" with common insurers after 10+ hospitals onboarded.

---

## 12. Pricing

### 12.1 MVP Pricing Model

| Tier | Price | Includes |
|------|-------|----------|
| **Pilot** | Free (3 months) | First hospital, feedback required |
| **Standard** | ₹25,000/month | Unlimited claims, 1 hospital |

**Why flat fee:** Easy sales conversation, predictable for hospitals, learn usage patterns before per-claim pricing.

---

## 13. Success Metrics (MVP)

| Metric | How to Measure | Target |
|--------|----------------|--------|
| **Audit Speed** | Log timestamps: upload → score | <15 sec average |
| **User Adoption** | Weekly active users / total users | >70% of billing staff |
| **Claim Accuracy** | Feedback flag: "Was this helpful? Y/N" | >90% helpful |

**Scale Path:** Add rejection rate tracking in Phase 2 once TPA outcome data is available.

---

## 14. MVP Scope (Final)

### ✅ In Scope (Phase 1)
- Single PDF upload per claim
- AWS Textract OCR
- RAG audit with Groq (Llama 3 70B)
- Red/Yellow/Green score + explanation
- Basic claim list dashboard
- Email/password auth with 2 roles

### ❌ Out of Scope (Phase 2+)
- Batch upload (10+ files)
- TPA portal integration
- WhatsApp/Email ingestion
- Offline mode
- Mobile app
- Multi-language support

---

## 15. Tech Stack (Final)

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Tailwind CSS + Vite |
| **Backend** | FastAPI + Python 3.11 |
| **BaaS** | Supabase (Auth + PostgreSQL + Storage) |
| **Vector DB** | pgvector (Supabase extension) |
| **OCR** | AWS Textract |
| **Embeddings** | OpenAI text-embedding-3-small |
| **LLM** | Groq (Llama 3 70B) |
| **Hosting** | Vercel (Frontend) + Railway (Backend) |

### Supabase Free Tier Usage
| Feature | Free Limit | Our Usage |
|---------|------------|----------|
| Auth | Unlimited users | ✅ Sufficient |
| Database | 500 MB | ✅ MVP claims + policies |
| Storage | 1 GB | ✅ PDF uploads |
| Edge Functions | 500K invocations | ✅ Optional use |

---

## 16. Immediate Next Steps

1. Set up project structure (FastAPI backend + React frontend)
2. Build Document Ingestion (PDF upload + Textract OCR)
3. Build RAG Pipeline (pgvector + Groq integration)
4. Build UI (Dashboard + Audit viewer)
5. Alpha test with dummy claims → Find pilot hospital

---
**End of Document**