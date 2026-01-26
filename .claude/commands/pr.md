# Create or Update Pull Request

Create a new PR or update an existing one with title and description.

## Usage

`/pr` - Create/update PR with auto-generated content
`/pr "Custom title"` - Create/update PR with custom title

## Instructions

### Step 1: Check if PR already exists

```bash
gh pr view --json number,title,body,url 2>/dev/null
```

- If PR exists: Note the current title and description
- If no PR: Will create a new one

### Step 2: Analyze changes

```bash
# See all commits on this branch
git log main..HEAD --oneline

# See files changed
git diff main...HEAD --stat

# Get detailed diff for context
git diff main...HEAD
```

Review ALL commits to understand full scope of changes.

### Step 3: If PR EXISTS - Update it

1. Show current PR details to user
2. Ask: "Update title/description based on current changes?"
3. If yes, update with `gh pr edit`

```bash
gh pr edit --title "feat: new title" --body "$(cat <<'EOF'
## What?
Summary of changes

## Why?
Context and value delivered
EOF
)"
```

### Step 4: If NO PR - Create new one

```bash
# Ensure branch is pushed
git push -u origin HEAD

# Create PR
gh pr create --title "feat: description" --body "$(cat <<'EOF'
## What?
- Summary of changes
- Key files modified

## Why?
- Context for the changes
- Value delivered
EOF
)"
```

### Step 5: Return the PR URL

Always provide the PR URL at the end.

## PR Title Format

Use conventional commits:

- `feat: add new feature`
- `fix: fix bug description`
- `refactor: improve code structure`
- `docs: update documentation`
- `chore: maintenance task`
