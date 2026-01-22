# PriClaim Schema Definitions

**Project:** PriClaim  
**Version:** 1.0  
**Status:** Locked for MVP  
**Last Updated:** 2026-01-22  
**Purpose:** Single source of truth for frontend–backend–AI data exchange

---

## 1. Why This Document Exists

This document defines all structured data shapes used in PriClaim.

### Rules

- Frontend **must not** assume fields not defined here
- Backend **must not** return undocumented fields
- AI prompts **must** consume and emit data conforming to these schemas
- Any schema change requires explicit review

### This Prevents

- UI/backend mismatch
- Prompt hallucinations
- Silent breaking changes

---

## 2. Core Domain Objects

```
Claim
 ├─ Raw Document
 ├─ OCR Output
 ├─ Normalized Claim Data
 ├─ Audit Result
 └─ Audit Report
```

> **Note:** Policies are read-only reference data for the RAG system.

---

## 3. Document Ingestion Schema

### 3.1 Upload Request

```json
{
  "file_name": "claim_123.pdf",
  "file_type": "application/pdf",
  "uploaded_by": "user_uuid",
  "hospital_id": "hospital_uuid"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file_name` | `string` | ✓ | Original filename |
| `file_type` | `string` | ✓ | MIME type (`application/pdf`) |
| `uploaded_by` | `UUID` | ✓ | User who uploaded |
| `hospital_id` | `UUID` | ✓ | Associated hospital |

### 3.2 Upload Response

```json
{
  "job_id": "job_uuid",
  "status": "queued"
}
```

### Status Enum

| Value | Description |
|-------|-------------|
| `queued` | Job received, waiting to process |
| `ocr_processing` | OCR extraction in progress |
| `auditing` | AI audit in progress |
| `completed` | Successfully finished |
| `failed` | Error occurred |

---

## 4. OCR Output Schema (Raw)

> **Purpose:** Direct output from Textract (not exposed to UI directly)

```json
{
  "pages": [
    {
      "page_number": 1,
      "text_blocks": [
        {
          "text": "Patient Name: John Doe",
          "confidence": 0.98,
          "bounding_box": [0.12, 0.32, 0.45, 0.38]
        }
      ]
    }
  ],
  "metadata": {
    "ocr_engine": "aws_textract",
    "processed_at": "2026-01-22T10:30:00Z"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `pages[].page_number` | `number` | 1-indexed page number |
| `pages[].text_blocks[].text` | `string` | Extracted text |
| `pages[].text_blocks[].confidence` | `number` | 0.0–1.0 confidence score |
| `pages[].text_blocks[].bounding_box` | `number[]` | `[x1, y1, x2, y2]` coordinates |
| `metadata.ocr_engine` | `string` | Engine used (always `aws_textract` for MVP) |
| `metadata.processed_at` | `ISO8601` | Timestamp |

> This data is normalized before UI exposure.

---

## 5. Normalized Claim Schema (Editable)

> **This is the primary contract between backend and frontend.**

```json
{
  "claim_id": "claim_uuid",
  "patient": {
    "name": "John Doe",
    "age": 45,
    "gender": "M",
    "policy_number": "POL123456",
    "confidence": {
      "name": 0.98,
      "age": 0.92
    }
  },
  "hospital": {
    "name": "City Care Hospital",
    "department": "Orthopedics"
  },
  "diagnosis": [
    {
      "code": "M16.11",
      "description": "Unilateral primary osteoarthritis, right hip",
      "confidence": 0.96
    }
  ],
  "procedures": [
    {
      "code": "0SR90JZ",
      "description": "Hip replacement surgery",
      "confidence": 0.94
    }
  ],
  "billing": {
    "total_amount": 425000,
    "currency": "INR",
    "line_items": [
      {
        "description": "Surgery Charges",
        "amount": 250000
      },
      {
        "description": "Implant",
        "amount": 175000
      }
    ]
  },
  "dates": {
    "admission_date": "2026-01-10",
    "discharge_date": "2026-01-18"
  }
}
```

### TypeScript Definition

```typescript
interface NormalizedClaim {
  claim_id: UUID;
  patient: {
    name: string;
    age: number;
    gender: "M" | "F" | "O";
    policy_number: string;
    confidence: Record<string, number>;
  };
  hospital: {
    name: string;
    department: string;
  };
  diagnosis: Array<{
    code: string;        // ICD-10 code
    description: string;
    confidence: number;
  }>;
  procedures: Array<{
    code: string;        // ICD-10-PCS code
    description: string;
    confidence: number;
  }>;
  billing: {
    total_amount: number;
    currency: "INR";     // Fixed for MVP
    line_items: Array<{
      description: string;
      amount: number;
    }>;
  };
  dates: {
    admission_date: ISO8601Date;
    discharge_date: ISO8601Date;
  };
}
```

### Confidence Rules

| Threshold | UI Behavior |
|-----------|-------------|
| `confidence < 0.90` | Field highlighted for manual review |
| User edits a field | Confidence flag cleared, user value takes precedence |

---

## 6. Policy Schema (Vectorized Reference)

```json
{
  "policy_id": "policy_uuid",
  "provider": "Star Health",
  "policy_type": "Corporate Floater",
  "raw_text": "Full policy document text...",
  "embedding_id": "vector_uuid"
}
```

### Chunking Rules

| Parameter | Value |
|-----------|-------|
| Chunk size | 500 tokens |
| Overlap | 50 tokens |
| Storage | Each chunk stored independently with `embedding_id` |

---

## 7. RAG Retrieval Schema

### 7.1 Retrieval Request

```json
{
  "diagnosis_codes": ["M16.11"],
  "procedure_codes": ["0SR90JZ"],
  "policy_id": "policy_uuid"
}
```

### 7.2 Retrieved Policy Clauses

```json
{
  "clauses": [
    {
      "clause_id": "clause_uuid",
      "text": "Robotic-assisted surgeries are excluded...",
      "page_number": 12,
      "similarity_score": 0.87
    }
  ]
}
```

> [!IMPORTANT]
> Only these retrieved clauses may be used by the LLM. No external knowledge allowed.

---

## 8. Audit Result Schema (AI Output)

> **Strict contract — AI must follow this shape exactly.**

```json
{
  "risk_score": 82,
  "risk_level": "HIGH",
  "summary": "Potential mismatch found in procedure coverage.",
  "findings": [
    {
      "type": "POLICY_MISMATCH",
      "description": "Robotic surgery claimed but policy excludes it.",
      "severity": "HIGH",
      "related_fields": ["procedures[0]"],
      "evidence": {
        "clause_id": "clause_uuid",
        "excerpt": "Robotic-assisted surgeries are excluded...",
        "page_number": 12
      }
    }
  ],
  "confidence": 0.91
}
```

### Risk Level Thresholds

> **Note:** `risk_score` represents *likelihood of denial* (higher = more risky)

| Risk Level | Score Range | UI Color | Meaning |
|------------|-------------|----------|---------|
| `LOW` | 0–30 | 🟢 Green | Low denial risk, proceed |
| `MEDIUM` | 31–70 | 🟡 Yellow | Review recommended |
| `HIGH` | 71–100 | 🔴 Red | High denial risk, action required |

### Finding Types Enum

| Type | Description |
|------|-------------|
| `POLICY_MISMATCH` | Procedure/diagnosis not covered by policy |
| `CODING_ERROR` | Incorrect ICD-10 or PCS codes |
| `DOCUMENTATION_GAP` | Missing required documentation |
| `AMOUNT_DISCREPANCY` | Billing amount exceeds policy limits |
| `DATE_INCONSISTENCY` | Date conflicts in claim data |

### Severity Enum

| Value | Description |
|-------|-------------|
| `LOW` | Minor issue, unlikely to cause denial |
| `MEDIUM` | Moderate issue, may cause partial denial |
| `HIGH` | Critical issue, likely to cause full denial |

---

## 9. Audit Report Schema (Persisted)

```json
{
  "claim_id": "claim_uuid",
  "status": "AUDITED",
  "audit_result": { ... },
  "suggested_corrections": [
    {
      "field": "procedures[0].description",
      "suggestion": "Verify if surgery was laparoscopic instead of robotic."
    }
  ],
  "generated_at": "2026-01-22T10:35:00Z",
  "generated_by": "groq_llama3_70b"
}
```

### Status Enum

| Value | Description |
|-------|-------------|
| `PENDING` | Awaiting audit |
| `AUDITED` | Audit complete |
| `REVIEWED` | Human reviewed the audit |
| `SUBMITTED` | Claim submitted to TPA |

---

## 10. UI Status Schema

> Used for polling and progress indicators.

```json
{
  "job_id": "job_uuid",
  "current_stage": "auditing",
  "progress_message": "Analyzing policy clauses",
  "error": null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `job_id` | `UUID` | Job identifier |
| `current_stage` | `string` | Current processing stage |
| `progress_message` | `string` | Human-readable status |
| `error` | `string \| null` | Error message if failed |

---

## 11. Finalization Schema

```json
{
  "claim_id": "claim_uuid",
  "final_status": "READY_FOR_SUBMISSION",
  "verified_by": "user_uuid",
  "verified_at": "2026-01-22T11:00:00Z"
}
```

### Final Status Enum

| Value | Description |
|-------|-------------|
| `READY_FOR_SUBMISSION` | All checks passed, ready to submit |
| `REQUIRES_CORRECTION` | Issues found, needs editing |
| `REJECTED` | Claim cannot be submitted |

---

## 12. Validation Rules

> [!CAUTION]
> These rules are **non-negotiable** for MVP.

| Rule | Enforcement |
|------|-------------|
| Backend validates all schemas before persistence | Server-side |
| Frontend validates user edits before re-audit | Client-side |
| AI output rejected if schema mismatch | Pipeline |
| Missing policy evidence → forced MEDIUM or HIGH risk | AI guardrail |

---

## 13. Deferred Schemas (Phase 2)

The following are explicitly **out of scope** for MVP:

- Batch upload schema
- TPA outcome feedback
- Multi-hospital tenancy
- Policy version history
- Webhook notification schema

---

## Type Definitions Reference

```typescript
type UUID = string;           // Format: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
type ISO8601 = string;        // Format: "2026-01-22T10:30:00Z"
type ISO8601Date = string;    // Format: "2026-01-22"
```

---

**END OF SCHEMAS DOCUMENT**
