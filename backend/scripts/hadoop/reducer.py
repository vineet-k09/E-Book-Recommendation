#!/usr/bin/env python3
#backend/scripts/hadoop/reducer.py
import sys
from collections import defaultdict

current_user = None
genre_count = defaultdict(int)

for line in sys.stdin:
    user_id, genre = line.strip().split("\t")

    if current_user and user_id != current_user:
        for g, c in genre_count.items():
            print(f"{current_user}\t{g}\t{c}")
        genre_count.clear()

    current_user = user_id
    genre_count[genre] += 1

# Final flush
if current_user:
    for g, c in genre_count.items():
        print(f"{current_user}\t{g}\t{c}")
