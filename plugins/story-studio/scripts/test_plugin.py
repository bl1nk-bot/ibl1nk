import os
import json
import sys

def test_plugin_structure(plugin_dir):
    print(f"\n🔍 Testing Story Studio Plugin at: {plugin_dir}\n")
    passed = 0
    failed = 0

    # 1. Required directories
    required_dirs = [".claude-plugin", "skills", "agents", "hooks", "commands", "references", "scripts"]
    for d in required_dirs:
        path = os.path.join(plugin_dir, d)
        if os.path.isdir(path):
            print(f"  ✅ Directory: {d}")
            passed += 1
        else:
            print(f"  ❌ Missing:   {d}")
            failed += 1

    print()

    # 2. plugin.json
    manifest_path = os.path.join(plugin_dir, ".claude-plugin", "plugin.json")
    if os.path.isfile(manifest_path):
        with open(manifest_path, 'r') as f:
            try:
                manifest = json.load(f)
                print(f"  ✅ plugin.json valid — name: {manifest.get('name')}, version: {manifest.get('version')}")
                passed += 1
            except json.JSONDecodeError:
                print(f"  ❌ plugin.json is NOT valid JSON")
                failed += 1
    else:
        print(f"  ❌ plugin.json missing")
        failed += 1

    print()

    # 3. Skills check
    expected_skills = [
        "article-editor", "context-manager", "first-person-storyteller",
        "screenplay-adapter", "short-film-marketing",
        "word-counter", "notion-sync", "miro-board"
    ]
    skills_dir = os.path.join(plugin_dir, "skills")
    found_skills = os.listdir(skills_dir) if os.path.isdir(skills_dir) else []
    for skill in expected_skills:
        skill_md = os.path.join(skills_dir, skill, "SKILL.md")
        if os.path.isfile(skill_md):
            print(f"  ✅ Skill: {skill}")
            passed += 1
        else:
            print(f"  ❌ Skill missing: {skill}")
            failed += 1

    print()

    # 4. Commands check
    expected_commands = [
        "start-project", "write-episodes", "edit-content",
        "marketing-assets", "update-context", "sync-notion", "create-board"
    ]
    commands_dir = os.path.join(plugin_dir, "commands")
    for cmd in expected_commands:
        cmd_path = os.path.join(commands_dir, f"{cmd}.md")
        if os.path.isfile(cmd_path):
            print(f"  ✅ Command: /{cmd}")
            passed += 1
        else:
            print(f"  ❌ Command missing: /{cmd}")
            failed += 1

    print()

    # 5. References check
    expected_refs = ["context-template.json", "notion-schema.json", "miro-board-template.json"]
    refs_dir = os.path.join(plugin_dir, "references")
    for ref in expected_refs:
        ref_path = os.path.join(refs_dir, ref)
        if os.path.isfile(ref_path):
            print(f"  ✅ Reference: {ref}")
            passed += 1
        else:
            print(f"  ❌ Reference missing: {ref}")
            failed += 1

    # 6. References JSON validity
    for ref in expected_refs:
        ref_path = os.path.join(refs_dir, ref)
        if os.path.isfile(ref_path):
            with open(ref_path) as f:
                try:
                    json.load(f)
                    print(f"  ✅ {ref} is valid JSON")
                    passed += 1
                except json.JSONDecodeError as e:
                    print(f"  ❌ {ref} JSON error: {e}")
                    failed += 1

    print()
    print(f"{'='*50}")
    print(f"  Results: {passed} passed / {failed} failed")
    if failed == 0:
        print(f"  🎉 Plugin is complete and ready to use!")
    else:
        print(f"  ⚠️  Fix {failed} issue(s) above before using the plugin.")
    print(f"{'='*50}\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        plugin_dir = sys.argv[1]
    else:
        plugin_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    test_plugin_structure(plugin_dir)
