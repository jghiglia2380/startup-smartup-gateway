#!/bin/bash
# export-activities.sh — pull live PE activities and write src/activitiesData.json
#
# Source of truth: the Supabase table, reached ONLY through
#   ~/Desktop/pe-for-nexplore/bin/pe-pull.sh
# This script never talks to Supabase itself and never sees the key.
#
# The database shape and the app shape differ. This is a TRANSFORM, not a copy.
# The field map is documented in transform() below.
#
# Safety:
#   - Raw pull goes to exactly ~/Desktop/pe-for-nexplore/t2-export-tmp.json.
#   - Output is written to a temp file beside the target, checked, then renamed
#     into place with mv. The target is never a partial file.
#   - Refuses to move into place unless the output has exactly 48 records.
#   - Backup name carries date and time, and an existing backup is never overwritten.

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PULL="$HOME/Desktop/pe-for-nexplore/bin/pe-pull.sh"
RAW="$HOME/Desktop/pe-for-nexplore/t2-export-tmp.json"
TARGET="$REPO/src/activitiesData.json"
EPISODES="$REPO/src/episodesData.json"
BACKUP="$REPO/src/activitiesData.backup-$(date +%Y-%m-%d-%H%M%S).json"
EXPECTED=48

[ -x "$PULL" ] || { echo "FAIL: $PULL not found or not executable" >&2; exit 1; }
[ -f "$TARGET" ] || { echo "FAIL: $TARGET missing" >&2; exit 1; }
[ -f "$EPISODES" ] || { echo "FAIL: $EPISODES missing" >&2; exit 1; }
[ ! -e "$BACKUP" ] || { echo "FAIL: $BACKUP already exists. Nothing written." >&2; exit 1; }

# Same directory as TARGET, so mv is a same-filesystem rename (atomic).
TMP="$(mktemp "$REPO/src/.activitiesData.json.XXXXXX")"
trap 'rm -f "$TMP"' EXIT

count_records() {
  python3 -c 'import json,sys; print(len(json.load(open(sys.argv[1]))["activities"]))' "$1"
}

echo "== pulling =="
"$PULL" "$RAW"

echo "== transforming =="
python3 - "$RAW" "$TARGET" "$EPISODES" "$TMP" "$EXPECTED" <<'PYEOF'
import json, re, sys

raw_path, target_path, episodes_path, tmp_path, expected = sys.argv[1:6]
expected = int(expected)

rows = json.load(open(raw_path))
old = json.load(open(target_path))["activities"]
chapter_titles = json.load(open(episodes_path))["chapterTitles"]

# Guard: exactly 48. Not "at least".
if len(rows) != expected:
    print(f"FAIL: pull returned {len(rows)} records, expected exactly {expected}. Nothing written.",
          file=sys.stderr)
    sys.exit(1)

VARIANTS = (("20", "variant_20min"), ("30", "variant_30min"), ("45", "variant_45min"))
BREAKDOWN_TAIL = re.compile(r"\s*=\s*\d+\s*minutes?\s*$")


def en(value):
    """DB stores some leaves as {en, es}. The app wants the plain English string."""
    return value.get("en") if isinstance(value, dict) else value


def time_version(variant):
    tv = {
        "label": variant.get("label"),
        "bestFor": variant.get("bestFor"),
        # DB: "10 min story + 10 min activity = 20 minutes" -> app drops the total
        "breakdown": BREAKDOWN_TAIL.sub("", variant.get("breakdown", "")),
        "activityName": variant.get("activityName"),
        # each variant carries its own materials; materials_standard et al. are budgetTiers
        "materials": variant.get("materials", []),
        "steps": variant.get("steps", []),
        "discussionQuestions": [en(q) for q in variant.get("discussionQuestions", [])],
        "extensionIdeas": variant.get("extensionIdeas", []),
    }
    # 45-minute versions only, and only where the database has them
    for key in ("beforeClass", "runningLongOrShort"):
        if key in variant:
            tv[key] = variant[key]
    return tv


def budget_tier(block):
    return {
        "label": block.get("label"),
        "costPerStudent": block.get("costPerStudent"),
        "description": block.get("description"),
        "items": block.get("items", []),
    }


activities = []
for i, row in enumerate(rows):
    # season/chapter/chapterId come from POSITION in the ordered pull.
    # The row's own chapter_id runs 2..49 and is not the app's chapterId.
    season = i // 12 + 1
    chapter = i % 12 + 1
    prev = old[i] if i < len(old) else {}

    title = row.get("activity_title", "")
    description = row.get("activity_description", "")

    activities.append({
        "chapterId": i + 1,
        "season": season,
        "chapter": chapter,
        "activityId": f"{season}-CH{chapter}-ACT",
        "title": {"en": title, "es": title},
        "chapterTitle": {
            "en": chapter_titles.get(str(season), {}).get(str(chapter), ""),
            # not in the database — carried over from the previous file by position
            "es": prev.get("chapterTitle", {}).get("es", ""),
        },
        # not in the database — carried over by position
        "topic": prev.get("topic", {"en": "", "es": ""}),
        "description": {"en": description, "es": description},
        "timeVersions": {key: time_version(row[vk]) for key, vk in VARIANTS if vk in row},
        "budgetTiers": {
            "standard": budget_tier(row.get("materials_standard", {})),
            "lowCost": budget_tier(row.get("materials_low_cost", {})),
            "premium": budget_tier(row.get("materials_premium", {})),
        },
        "tierDifferentiation": row.get("tier_differentiation", {}),
        # not in the database — carried over by position
        "accommodations": prev.get("accommodations", {}),
    })

with open(tmp_path, "w", encoding="utf-8") as fh:
    json.dump({"activities": activities}, fh, indent=2, ensure_ascii=False)
    fh.write("\n")

print(f"records in  : {len(rows)}")
print(f"records out : {len(activities)}")
PYEOF

echo "== checking temp file =="
TMP_COUNT="$(count_records "$TMP")"
echo "records in temp file: $TMP_COUNT"
[ "$TMP_COUNT" = "$EXPECTED" ] || {
  echo "FAIL: temp file has $TMP_COUNT records, expected $EXPECTED. Not moved into place." >&2
  exit 1
}

echo "== backing up =="
# noclobber: the redirect fails if the backup already exists.
( set -o noclobber; cat "$TARGET" > "$BACKUP" )
cmp -s "$TARGET" "$BACKUP" || { echo "FAIL: backup does not match $TARGET" >&2; exit 1; }
echo "backup      : $BACKUP"

echo "== moving into place =="
chmod 644 "$TMP"
echo "+ mv -f -v $TMP $TARGET"
mv -f -v "$TMP" "$TARGET"
trap - EXIT

WRITTEN="$(count_records "$TARGET")"
echo "records written to $TARGET: $WRITTEN"
[ "$WRITTEN" = "$EXPECTED" ] || { echo "FAIL: $TARGET has $WRITTEN records, expected $EXPECTED" >&2; exit 1; }

echo "== done =="
