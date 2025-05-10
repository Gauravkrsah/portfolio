# System Data Flow and Interaction Diagrams

This document standardizes the use of Data Flow Diagrams (DFDs) and UML Sequence Diagrams to represent data traversal and component interactions within our web application architecture.

---

## Data Flow Diagram (DFD) — Context Diagram (Level 0)

```
  □ User
       ↓
  ● Frontend
       ↓
  ● API Gateway / BFF
       ↓
  ● Auth Service / Business Logic
       ↓
  ══ Database / Cache
```

Symbols Legend:

- □ External Entity (User)
- ● Process (Frontend, API Gateway, Services)
- ══ Data Store (Database, Cache)
- ↓ Data Flow

---

## Data Flow Diagram (DFD) — Level 1 (Decomposed)

```
  □ User
       ↓
  ● Web Client (Frontend)
       ↓
  ● API Gateway / Backend for Frontend (Request routing, auth)
      ↙               ↘
  ● Business Services   ● Middleware (Logging, Error)
       ↓
  ══ Database & Cache
```

---

## UML Sequence Diagram — Typical User Login Flow

```
User -> Frontend: Click login
Frontend -> API Gateway: POST /login
API Gateway -> Auth Service: validateToken()
Auth Service -> User DB: query user
User DB -> Auth Service: user data
Auth Service -> API Gateway: auth result & token
API Gateway -> Frontend: 200 OK + JWT
Frontend -> User: render authenticated UI
```

---

## Notation Reference

| Symbol           | Meaning                                      |
|------------------|----------------------------------------------|
| ● Process        | Data transformation or business logic        |
| → Arrow          | Message or data flow                          |
| ══ Data Store    | Persistent storage (database, cache)          |
| □ External Entity | Actor or system outside model boundary        |

---

Using these standardized diagrams and notation in all architecture documentation ensures consistency, clarity, and ease of understanding for developers, architects, and stakeholders.

This file should reside in `docs/architecture-data-flow.md` and be updated as the system evolves.