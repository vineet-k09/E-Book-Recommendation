#!/usr/bin/env python3
#backend/scripts/hadoop/mapper.py
import sys
import json

for line in sys.stdin:
    try:
        data = json.loads(line.strip())
        user_id = data.get("userId")
        genres = data.get("genre", [])
        action = data.get("action")

        # Count only 'read' or 'like' as preference indicators
        if user_id and action in ("read", "like") and genres:
            for genre in genres:
                print(f"{user_id}\t{genre.strip()}")
    except Exception as e:
        continue  # skip bad lines
