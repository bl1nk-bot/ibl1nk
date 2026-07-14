# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of ibl1nk seriously. If you believe you have found a security vulnerability, please report it to us by opening a private issue or contacting the maintainers directly.

## Security Standards

This project adheres to the following security principles:

### 1. IDOR Protection (Insecure Direct Object Reference)
Every database query and API endpoint MUST verify data ownership. 
- **Rule:** All queries must include a `userId` check.
- **Implementation:** Use `and(eq(table.id, id), eq(table.userId, userId))` in Drizzle queries.

### 2. Input Validation
All client inputs must be validated using **Zod** schemas before being processed by the server.

### 3. Error Handling
We use standardized error codes and bilingual messages to prevent leaking sensitive system information while remaining user-friendly.
- **Standard:** Use `TRPCError` with specific codes (e.g., `NOT_FOUND`, `FORBIDDEN`).

### 4. Authentication
Secure authentication is handled via Manus OAuth (OpenID Connect). Sessions are managed using secure, httpOnly cookies.

### 5. Dependency Management
We regularly audit our dependencies for known vulnerabilities using `npm audit`.
