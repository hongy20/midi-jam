#!/bin/bash
# Configuration
REPO_URL="https://github.com/contains-studio/agents/archive/refs/heads/main.tar.gz"
TARGET_DIR=".claude/agents"

echo "📥 Syncing source agents to $TARGET_DIR..."

# 1. Clean and Prepare
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

# 2. Download and extract
# We exclude the git-related files that might mess up your local repo
curl -L "$REPO_URL" | tar -xz -C "$TARGET_DIR" --strip-components=1 \
    --exclude=".gitignore" \
    --exclude=".gitattributes" \
    --exclude="LICENSE" \
    --exclude="package.json"

echo "✅ Sync complete. Source files are in $TARGET_DIR"