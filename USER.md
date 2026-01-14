# USER Cheat Sheet for AI Agent

Quick reference for giving instructions to the AI agent.

---

## 1. Task IDs

- Every item in `TODO.md` has a unique ID
- Prefix indicates state:
  - S → Suggestion
  - B → Backlog
  - R → Ready
  - T → In Progress
  - D → Done
  - TD → Technical Debt
  - S-NORM → Norm suggestion
- Numeric part stays the same; prefix updates on promotion

---

## 2. Command Style

| Command | Purpose |
|---------|---------|
| `promote <ID> to <State>` | Move a task between states (human approval only) |
| `draft acceptance criteria for <ID>` | Draft criteria for suggestions or backlog items |
| `split <ID> into <N> tasks` | Break a large task into sub-tasks |
| `freeze <ID>` | Pause a task |
| `list <State>` | Show all items in a given state |
| `explain <ID>` | Summarize purpose, state, and related info |
| `start <ID>` | Begin a Ready task (moves to In Progress) |

**Rules:**
- Commands operate on tasks and documentation only
- Agent cannot implement code unless explicitly instructed
- Always reference task IDs

---

## 3. Workflow Reminder

**Task lifecycle:**

`Suggestion → Backlog → Ready → In Progress → Review → Done`

- Suggestions → ideas only
- Backlog → acknowledged ideas
- Ready → human-approved actionable tasks
- In Progress → active work
- Review → awaiting confirmation
- Done → completed

---

## 4. Norm Updates

- AI MAY propose updates to `NORM.md`
- All proposals appear in `TODO.md` as **💡 Suggestions (Norm Updates)** with IDs `S-NORM-###`
- Human review required before applying changes
- Examples of norm updates:
  - Allow new architecture patterns
  - Add new CSS or testing rules
- Commands for norm updates:
  - `promote S-NORM-001 to Ready` → approve update
  - `explain S-NORM-001` → review rationale

---

## 5. Examples

```text
draft acceptance criteria for S-003
promote S-003 to Backlog
promote B-003 to Ready
start R-003
list Ready
explain R-003
freeze B-007
split B-006 into 3 tasks
explain S-NORM-001
promote S-NORM-001 to Ready
