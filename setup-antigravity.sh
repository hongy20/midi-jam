#!/bin/bash
# Configuration
CLAUDE_AGENTS_DIR=".claude/agents"
EXTERNAL_SKILLS_DIR=".agents/skills" # Source from skills.sh
AG_SKILLS_DIR=".antigravity/skills"  # Personas
AG_RULES_DIR=".antigravity/rules"    # Playbooks/Rules

PROJECT_ROOT=$(pwd)

echo "🔗 Starting Antigravity Configuration..."

# --- PART 1: Map Personas (The "Who") ---
echo "👤 Mapping Personas from Claude Agents..."
rm -rf "$AG_SKILLS_DIR"
mkdir -p "$AG_SKILLS_DIR"

find "$CLAUDE_AGENTS_DIR" -name "*.md" | while read -r agent_file; do
    if [[ "$agent_file" == "$CLAUDE_AGENTS_DIR/README.md" ]]; then continue; fi
    
    rel_path=${agent_file#$CLAUDE_AGENTS_DIR/}
    skill_rel_dir="${rel_path%.md}"
    target_dir="$AG_SKILLS_DIR/$skill_rel_dir"
    
    mkdir -p "$target_dir"
    cd "$target_dir"
    
    # Calculate depth for symlink
    depth=$(echo "$skill_rel_dir" | tr -cd '/' | wc -c)
    backtrack="../../.." 
    for ((i=0; i<depth; i++)); do backtrack="../$backtrack"; done
    
    ln -sf "$backtrack/$agent_file" "SKILL.md"
    cd "$PROJECT_ROOT"
done

# --- PART 2: Map External Skills as Rules (The "How") ---
echo "📜 Mapping External Skills to Antigravity Rules..."
rm -rf "$AG_RULES_DIR"
mkdir -p "$AG_RULES_DIR"

if [ -d "$EXTERNAL_SKILLS_DIR" ]; then
    find "$EXTERNAL_SKILLS_DIR" -name "*.md" | while read -r skill_file; do
        rel_path=${skill_file#$EXTERNAL_SKILLS_DIR/}
        base_name=$(basename "$skill_file" .md)
        dir_name=$(dirname "$rel_path")

        # 1. Determine the Target Folder
        # If it's a 'standard' entry file, we collapse it into the parent folder
        if [[ "$base_name" == "SKILL" || "$base_name" == "index" || "$base_name" == "AGENTS" ]]; then
            [[ "$dir_name" == "." ]] && target_rule_dir="$AG_RULES_DIR" || target_rule_dir="$AG_RULES_DIR/$dir_name"
            skill_rel_dir="$dir_name"
        else
            target_rule_dir="$AG_RULES_DIR/${rel_path%.md}"
            skill_rel_dir="${rel_path%.md}"
        fi

        mkdir -p "$target_rule_dir"
        
        # 2. Determine the Target Filename
        # Antigravity's "Main" rule file should be RULE.md. 
        # We prioritize SKILL.md for this name, then index.md.
        # AGENTS.md stays as AGENTS.md to provide extra context.
        target_filename="RULE.md"
        [[ "$base_name" == "AGENTS" ]] && target_filename="AGENTS.md"
        # If it's a specific sub-rule file, name it RULE.md so it's selectable
        [[ "$base_name" != "SKILL" && "$base_name" != "index" && "$base_name" != "AGENTS" ]] && target_filename="RULE.md"

        # 3. Create the link
        depth=$(echo "$skill_rel_dir" | tr -cd '/' | wc -c)
        backtrack="../../.." 
        [[ "$skill_rel_dir" == "." || -z "$skill_rel_dir" ]] && depth=-1 # Adjust for root
        for ((i=0; i<=depth; i++)); do backtrack="../$backtrack"; done
        
        cd "$target_rule_dir"
        ln -sf "$backtrack/$skill_file" "$target_filename"
        cd "$PROJECT_ROOT"
        
        echo "   ✅ Linked: $rel_path -> $target_rule_dir/$target_filename"
    done
else
    echo "   ℹ️ No external skills found."
fi

echo "🚀 Setup complete! Personas are in /skills, Playbooks are in /rules."