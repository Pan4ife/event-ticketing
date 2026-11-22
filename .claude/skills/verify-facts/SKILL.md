---
name: verify-facts
description: How to check a fact before stating it — project files first (path:line), then official documentation with a link, otherwise say "not verified". Use before any claim about versions, library APIs, Spring Boot / Java / PostgreSQL / React behavior, or "this will work".
---

# Verify facts before you state them

A guess that sounds confident is the most expensive mistake in this project: Slava learns from your answers
and will repeat them in interviews. Every claim needs a source he can open.

## Order of sources

1. **The project itself.** Open the real file and cite `path:line`.
   - Versions: `backend/pom.xml` (Spring Boot = `spring-boot-starter-parent` version, Java = `java.version`),
     `frontend/package.json`. Never state a version from memory.
   - Behavior of our code: the code and tests, not what "usually" happens.
   - Rules: `AGENTS.md`, `docs/PRD.md`, the feature hub and stage file in `docs/features/`, `docs/reference/technical-spec.md`.
2. **Official documentation**, for the version from step 1, with a link in the answer.
   - Context7 (if its tools `mcp__context7__*` are available in this session): `resolve-library-id`, then
     `query-docs`. Prefer libraries indexed from the official source (`/spring-projects/...`,
     `/websites/spring_io_...`). Check that the version matches `pom.xml`; if Context7 has only an older
     version, say so and confirm on the official site. Give the official URL, not a Context7 URL.
   - Otherwise web search + fetch, reading only official sites:
     - Spring Boot / Framework / Data JPA / Security: `docs.spring.io`; release notes and migration guides:
       `github.com/spring-projects/<project>/wiki`
     - Java 25: `docs.oracle.com/en/java`, `openjdk.org`
     - PostgreSQL 18: `postgresql.org/docs`
     - Flyway: `documentation.red-gate.com/flyway`
     - Testcontainers: `java.testcontainers.org`; JUnit 5: `junit.org`; ArchUnit: `archunit.org`
     - React: `react.dev`; Vite: `vite.dev`; TypeScript: `typescriptlang.org`; oxlint: `oxc.rs`
   - Blogs, Baeldung, Stack Overflow, AI answers: only to find *where* to look. The fact must be confirmed
     on an official page before you state it.
   - If the page you found is for another version, say which version it describes.
3. **Not found or not sure** — say it plainly («не знаю, проверю» / «не проверено: …» to Slava,
   "not verified: …" in English files). This is better than a guess. Never fill a gap with a
   plausible-looking API, property name or annotation. If you have no web or Context7 tools, every outside
   fact you state is "not verified" — say so.

## "It will work"

"This compiles", "this test passes", "this fixes the error" are claims too. Confirm them with a command
(`cd backend && ./mvnw verify`, `cd frontend && npm run lint && npm run build`). If you cannot run commands,
say what to run and that the claim is unconfirmed until Slava runs it.

## How to write the answer

- Fact → source right after it: `backend/pom.xml:8` or a full URL.
- Mark what is your own reasoning: «моё мнение: …».
- Short. One source per fact is enough; do not paste whole pages.
