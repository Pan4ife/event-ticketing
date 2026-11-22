# event-ticketing

콘서트, 컨퍼런스, 워크숍, 밋업 같은 이벤트를 찾고 티켓을 예매하는 풀스택 웹 서비스입니다.
주니어 Java/Spring 백엔드 개발자 포트폴리오 프로젝트이며, AI 에이전트와 함께 개발합니다.
**백엔드 코드는 제가 직접 작성하고**, 프론트엔드는 AI 에이전트가 작성하며 제가 리뷰합니다.

[English below](#english)

## 기술 스택

| 영역 | 기술 |
|---|---|
| 백엔드 | Java 25, Spring Boot 4.2 (Web MVC, Data JPA, Validation, Actuator), Flyway, Maven Wrapper |
| 데이터베이스 | PostgreSQL 18 |
| 백엔드 검사 | JUnit 5, Testcontainers (실제 PostgreSQL), ArchUnit (계층 규칙), Spotless + Palantir Java Format |
| 프론트엔드 | React 19, TypeScript, Vite, oxlint |
| CI | GitHub Actions — 로컬과 같은 검사를 모든 push와 PR에서 실행 |

버전 기준: [`backend/pom.xml`](backend/pom.xml), [`frontend/package.json`](frontend/package.json).

## 현재 상태

코드 작성 전에 문서와 개발 체계를 먼저 갖추는 단계입니다.

- 백엔드: 프로젝트 골격과 헬스 체크 엔드포인트(`GET /actuator/health`), 테스트, CI.
- 프론트엔드: Vite 기본 화면.
- 다음: 첫 기능 "회원가입과 로그인" — [`docs/features/auth/`](docs/features/auth/README.md).
- 전체 계획과 진행 상황: [`docs/roadmap.md`](docs/roadmap.md).

## 실행 방법 (현재 있는 것)

필요한 것: JDK 25, Docker (Testcontainers), Node.js 26.

```bash
# 백엔드: 빌드 + 모든 테스트 + 계층 규칙 + 코드 스타일 (Docker 필요)
cd backend && ./mvnw verify

# 백엔드 실행: Docker로 PostgreSQL을 자동으로 띄움
cd backend && ./mvnw spring-boot:test-run
# 확인: http://localhost:8080/actuator/health

# 프론트엔드
cd frontend && npm ci && npm run dev
# 확인: http://localhost:5173
```

로컬 PostgreSQL을 쓸 때는 `./mvnw spring-boot:run` — 접속 정보는 환경 변수 `DB_URL`, `DB_USERNAME`,
`DB_PASSWORD`로 바꿀 수 있습니다 ([`application.properties`](backend/src/main/resources/application.properties)).

## 프로젝트를 만드는 방법

| 누가 | 무엇을 |
|---|---|
| 저 (사람) | 백엔드 운영 코드 `backend/src/main/` 전부, 모든 PR 리뷰와 머지 |
| AI 에이전트 | 테스트를 먼저 작성 (TDD), 작업 문서, 코드 리뷰, 프론트엔드 |

- 백엔드 단계: 작업 문서 → 테스트 에이전트가 실패하는 테스트 작성 → 제가 코드 작성 (멘토 에이전트는 힌트만,
  코드 작성 금지) → `./mvnw verify` → 리뷰 에이전트가 기준별로 `파일:줄` 근거 확인 → PR → 제가 머지.
- 에이전트가 `backend/src/main/`을 수정하려 하면 훅(hook)이 차단합니다. Claude Code와 Cursor에서 확인했고,
  Codex에서는 아직 차단되지 않아 수정 예정입니다 ([`docs/retro.md`](docs/retro.md)).
- 규칙: [`AGENTS.md`](AGENTS.md) · 문서 지도: [`docs/README.md`](docs/README.md) ·
  제품 요구사항: [`docs/PRD.md`](docs/PRD.md) · 로드맵: [`docs/roadmap.md`](docs/roadmap.md) ·
  AI 에이전트 설정과 검증 (Claude Code, Codex, Cursor): [`docs/agents-setup.md`](docs/agents-setup.md) ·
  회고: [`docs/retro.md`](docs/retro.md)

---

## English

A full-stack web app to discover events (concerts, conferences, workshops, meetups) and book tickets.
A junior Java/Spring backend portfolio project built with AI agents: **I write the backend code myself**;
AI agents write the frontend, tests first, task files and reviews.

- **Stack:** Java 25, Spring Boot 4.2, PostgreSQL 18, Flyway; React 19 + TypeScript + Vite; GitHub Actions.
- **Status:** documentation and process are set up before code. The backend has a skeleton with
  `GET /actuator/health`; the first feature is sign-up and sign-in ([`docs/features/auth/`](docs/features/auth/README.md)).
  Plan: [`docs/roadmap.md`](docs/roadmap.md).
- **Run:** `cd backend && ./mvnw verify` (needs Docker) · `./mvnw spring-boot:test-run` (starts PostgreSQL in Docker) ·
  `cd frontend && npm ci && npm run dev`.
- **How it is built:** rules in [`AGENTS.md`](AGENTS.md); a hook blocks agents from editing `backend/src/main/`
  (proven in Claude Code and Cursor; the Codex fix is pending — see [`docs/retro.md`](docs/retro.md));
  every stage goes task → tests first → code → checks → reviewer with `file:line` evidence → PR that I merge.
  Docs map: [`docs/README.md`](docs/README.md) · PRD: [`docs/PRD.md`](docs/PRD.md) ·
  agents setup: [`docs/agents-setup.md`](docs/agents-setup.md).
