---
name: write-tests-first
description: Write backend tests from a task before the production code exists (TDD) — black-box through the API contract, real PostgreSQL via Testcontainers, red for the right reason. Use when a backend task in docs/tasks/ is approved and Slava has not written the code yet.
---

# Tests first

Slava makes these tests green with his own code. So the tests are his specification: they must say exactly
what the task asks — no more, no less — and fail now for the right reason.

## Inputs

- The task `docs/tasks/NNN-*.md`: criteria `[auto]` name the tests you write; the API contract
  (endpoints, JSON, status codes) is in the task.
- `docs/PRD.md` sections linked in the task; "Error Handling" for the error JSON format.
- Existing tests in `backend/src/test/java/io/github/pan4ife/eventticketing/` — copy their setup:
  `HealthEndpointTest` (`@SpringBootTest`, `@AutoConfigureMockMvc`, `MockMvcTester`, AssertJ) and
  `TestcontainersConfiguration` (real PostgreSQL 18).
- Test libraries: only those already in `backend/pom.xml`. A new one → stop and ask.

## How to write them

1. **Test through the contract, not through classes.** Prefer HTTP-level tests (`MockMvcTester` against the
   endpoint from the task). They compile before Slava writes any class, and they do not dictate his design.
   A unit test that needs a class or method name is allowed only if the task names that class/method.
   Otherwise stop and ask — do not invent names Slava has to follow.
2. **One behavior per test**, name says it: `bookingLastTicketTwiceSellsOnlyOne()`.
3. **Real database** — `@Import(TestcontainersConfiguration.class)`; no H2, no mocking the repository in
   integration tests. Test data through the API or SQL in the test, cleaned between tests.
4. **Capacity / money rules** from the PRD ("No overselling") get a concurrency test: N parallel requests for
   the last tickets (e.g. `ExecutorService` + `CountDownLatch`), then assert sold ≤ capacity and the rest got
   `409`. Run it enough times in one test to make a race likely.
5. **Errors too:** validation `400` with `validationErrors`, missing `404`, conflict `409` — as the task says.
6. Package mirrors the future production package (`.../booking/BookingApiTest.java`).

## Red for the right reason

First check Docker: `docker info`. Not running → stop and report it (Testcontainers needs it); do not retry
in a loop.

Run only your tests: `cd backend && ./mvnw test -Dtest=<YourTest>`.
- Good red: assertion fails — `404` instead of `201`, field missing.
- Bad red: your test does not compile, the context does not start because of your test setup. Fix those.
- Green right away: the behavior already exists. Say so in the report — the test stays as a guard, but the
  task may be smaller than it looks.
- Formatting: `./mvnw spotless:check`. If it fails on your test files, fix them by hand or run
  `./mvnw spotless:apply` and then confirm `git diff --stat -- backend/src/main` is empty.
- Finally the full `cd backend && ./mvnw verify`: only your new tests may be red.

## Never

- Edit `backend/src/main/` (the hook blocks it anyway) or write the production code "to check".
- Delete, weaken or `@Disabled` an existing test. A test seems wrong → stop and ask.
- A test that passes no matter what (no assertion, asserts only status 2xx when the task asks for a body).

## Report back

List: test class → each test → which criterion it proves; the red output (one line per test: expected vs
actual); anything in the task you could not turn into a test and why.
