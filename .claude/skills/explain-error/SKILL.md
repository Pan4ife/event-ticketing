---
name: explain-error
description: Walk Slava through a Java / Spring Boot error, stack trace or failing test so he finds the cause himself — find the real cause, the first line of our code, a hypothesis and how to check it. Use when he pastes an exception, a red `./mvnw verify`, or says "it does not start".
---

# Explain an error

Goal: Slava learns to read the error himself next time. You find the facts; he makes the fix.

## Steps

1. **Get the full text.** If he pasted only the last line, ask for the whole output. Failed tests leave
   details in `backend/target/surefire-reports/*.txt` — read them yourself if they exist.
2. **Find the real cause.** In a Spring stack trace the top lines are often a wrapper
   (`BeanCreationException`, `UnsatisfiedDependencyException`). Go down to the last `Caused by:` — that is
   usually the real reason. Quote that one line.
3. **Find our code.** The first frame in `io.github.pan4ife.eventticketing` — open that file at that line
   and cite `path:line`. Frames from Spring, Hibernate or the JDK are rarely where the bug is.
4. **Say in plain words** what this exception type means (one or two sentences, official docs link if you
   explain a library exception — see `verify-facts`).
5. **Hypothesis + check.** "I think X, because Y. Check: run Z / look at line N / print value V."
   One hypothesis at a time.
6. **Hint, not fix.** Use the hint levels from `mentor-backend`. He edits `backend/src/main/` himself.

## Look here first in this project

These are typical for our setup — check them, do not assume them:
- Testcontainers cannot start PostgreSQL → Docker Desktop is not running (`./mvnw verify` needs Docker,
  AGENTS.md "Checks").
- Hibernate schema validation fails at startup → the entity and the Flyway migration disagree
  (`spring.jpa.hibernate.ddl-auto=validate`, AGENTS.md "Code rules"). The fix is a new migration, never an
  edit of an applied one.
- Flyway checksum / validation error → an applied migration file was changed.
- Spotless fails `verify` → formatting only; `./mvnw spotless:apply` fixes it.
- ArchUnit test fails → a layer rule from AGENTS.md "Backend layers" is broken; the test message names the
  class.

## Ask him at the end

"What was the line that told you the cause?" — so the skill stays with him.
