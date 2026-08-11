#!/usr/bin/env python3
"""PostToolUse hook: Check context.json after Write/Edit operations."""
import json
import os
import sys

def main():
    ctx_path = os.path.join(os.path.dirname(__file__), '..', 'context.json')

    if os.path.exists(ctx_path):
        with open(ctx_path) as f:
            ctx = json.load(f)
        ep = ctx.get('story_info', {}).get('current_episode', 0)
        title = ctx.get('story_info', {}).get('title', 'Untitled')
        print(f'[Story Studio] Context OK — {title} | ตอนปัจจุบัน: {ep}')
    else:
        print('[Story Studio] context.json ยังไม่มี — รัน /start-project ก่อน')
        sys.exit(1)

if __name__ == '__main__':
    main()
