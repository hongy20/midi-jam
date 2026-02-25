#!/bin/bash

# Configuration
REPO_URL="https://github.com/contains-studio/agents/archive/refs/heads/main.tar.gz"
TARGET_DIR=".claude/agents"
SKILLS_DIR=".antigravity/skills"

# 1. Clean and Prepare (Start fresh to avoid broken links)
rm -rf "$TARGET_DIR"
rm -rf "$SKILLS_DIR"
mkdir -p "$TARGET_DIR"
mkdir -p "$SKILLS_DIR"

# 2. Download and extract
echo "📥 Downloading agents..."
curl -L "$REPO_URL" | tar -xz -C "$TARGET_DIR" --strip-components=1 \
    --exclude=".gitignore" --exclude=".gitattributes" --exclude="LICENSE"

# 3. Create Mappings
echo "🔗 Creating symlinks..."
# We use a subshell to keep the 'cd' local to the loop
find "$TARGET_DIR" -name "*.md" | while read -r agent_file; do
    if [[ "$agent_file" == "$TARGET_DIR/README.md" ]]; then continue; fi
    
    # Get the real absolute path of the source file
    abs_source_path=$(pwd)/"$agent_file"
    
    # Define the skill directory
    rel_path=${agent_file#$TARGET_DIR/}
    skill_name_dir="${rel_path%.md}"
    full_skill_dir="$SKILLS_DIR/$skill_name_dir"
    
    mkdir -p "$full_skill_dir"
    
    # THE FIX: Use absolute paths for the link creation to ensure they always resolve, 
    # OR use the 'ln -r' (relative) flag if your system supports it.
    # We'll use absolute paths here for maximum compatibility across OSes.
    ln -sf "$abs_source_path" "$full_skill_dir/SKILL.md"
done

echo "✅ Sync complete. Testing link..."
