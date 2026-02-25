#!/bin/bash
# Configuration
SOURCE_DIR=".claude/agents"
SKILLS_DIR=".antigravity/skills"

echo "🔗 Setting up Antigravity Skills..."

# 1. Clear existing mappings to prevent broken/stale links
rm -rf "$SKILLS_DIR"
mkdir -p "$SKILLS_DIR"

# 2. Get the absolute path of the source root to calculate relative links easily
# (Using 'pwd' ensures we know where we are starting from)
PROJECT_ROOT=$(pwd)

# 3. Find all .md files and map them
find "$SOURCE_DIR" -name "*.md" | while read -r agent_file; do
    # Skip top-level README
    if [[ "$agent_file" == "$SOURCE_DIR/README.md" ]]; then continue; fi
    
    # Calculate paths
    rel_path=${agent_file#$SOURCE_DIR/}      # e.g., engineering/frontend.md
    skill_rel_dir="${rel_path%.md}"          # e.g., engineering/frontend
    target_skill_dir="$SKILLS_DIR/$skill_rel_dir"
    
    # Create the nested folder
    mkdir -p "$target_skill_dir"
    
    # --- THE RELIABLE LINKING LOGIC ---
    # We move INTO the target folder so the relative path is simple to calculate
    cd "$target_skill_dir"
    
    # Calculate how many levels up to get to PROJECT_ROOT from THIS folder
    # engineering/frontend is 2 levels deep, so we need 2 (depth) + 2 (.antigravity/skills) = 4 levels
    depth=$(echo "$skill_rel_dir" | tr -cd '/' | wc -c)
    backtrack="../../.." # Base: one for skill-folder, two for .antigravity/skills
    for ((i=0; i<depth; i++)); do backtrack="../$backtrack"; done
    
    # Link SKILL.md to the source file
    ln -sf "$backtrack/$agent_file" "SKILL.md"
    
    # Go back to project root for the next iteration
    cd "$PROJECT_ROOT"
done

echo "🚀 Antigravity setup complete. Skills mapped and folders preserved."