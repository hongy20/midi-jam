---
trigger: always_on
---

# Environment Configuration

## Node.js & NVM Management

The agent must operate within the user's active NVM (Node Version Manager) environment.

### Critical Execution Rules:

1. **Source NVM**: Before executing any terminal command involving `node`, `npm`, or `npx`, the agent MUST source the NVM script to ensure the environment variables are loaded.
2. **Command Prefix**: Prepend all Node-related commands with:
   `source ~/.nvm/nvm.sh && nvm use default && ...`
3. **Absolute Paths**: If the above sourcing fails, use the absolute path for Node binaries.
   - **Node Path**: /usr/local/bin/node
   - **NPM/NPX Path**: /usr/local/bin/npx

## Global CLI Tools (GitHub CLI / gh)

The agent must be able to access system-level binaries installed via Homebrew.

### Path Injection:

1. **PATH Update**: For every shell session or command involving `gh`, ensure the PATH includes:
   `/opt/homebrew/bin:/usr/local/bin`
2. **Execution Rule**: If `gh` is not found, prefix the command to include the path:
   `PATH=$PATH:/opt/homebrew/bin:/usr/local/bin gh pr create ...`

### Verification:

- Always run `node -v` and `gh --version` to verify the environment is active before proceeding with complex scripts.
- If a "command not found" error persists, fallback to using the absolute binary path for every invocation.
