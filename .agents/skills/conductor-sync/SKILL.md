---
name: Conductor Sync
description: Automatically updates plan.md and spec.md files based on development progress. Use this whenever working on a project initialized by Gemini Conductor.
---
# Conductor Sync Protocol
When this skill is active, you must:
1. Read `plan.md` and `spec.md` at the start of every task.
2. After completing a sub-task, immediately update `plan.md` by changing `[ ]` to `[x]` for that item.
3. If a task requires a change to the original architecture, update `spec.md` first before writing code.
4. Provide a summary of the remaining items in `plan.md` after every successful implementation.
