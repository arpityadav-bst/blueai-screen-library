#!/bin/bash
# Higgsfield queue runner — respects the 4-concurrent-job plan limit.
# Reads prompts from prompts.tsv (name<TAB>prompt), tracks state in jobs.tsv
# (name<TAB>id<TAB>status), downloads finished results into ../raw/<name>.png.
set -u
cd "$(dirname "$0")/../higgsfield"
RAW="../raw"

declare -A PROMPT ID STATE
while IFS=$'\t' read -r k p; do [ -n "$k" ] && PROMPT[$k]="$p"; done < prompts.tsv
while IFS=$'\t' read -r k id st; do
  [ -n "$k" ] || continue
  ID[$k]="${id:-}"; STATE[$k]="${st:-pending}"
  [ -z "${id:-}" ] && STATE[$k]="pending"
done < jobs.tsv

save(){ : > jobs.tsv; for k in "${!PROMPT[@]}"; do echo -e "$k\t${ID[$k]:-}\t${STATE[$k]:-pending}" >> jobs.tsv; done; }

for i in $(seq 1 240); do
  inflight=0; pendings=(); done_all=1
  for k in "${!PROMPT[@]}"; do
    st="${STATE[$k]:-pending}"
    case "$st" in
      pending) pendings+=("$k"); done_all=0 ;;
      submitted|in_progress|queued)
        done_all=0
        out=$(higgsfield generate get "${ID[$k]}" --json 2>/dev/null)
        st2=$(echo "$out" | python -c "import sys,json;d=json.load(sys.stdin);print(d.get('status',''))" 2>/dev/null)
        url=$(echo "$out" | python -c "import sys,json;d=json.load(sys.stdin);print(d.get('result_url') or '')" 2>/dev/null)
        if [ "$st2" = "completed" ] && [ -n "$url" ]; then
          curl -sL -o "$RAW/$k.png" "$url" && STATE[$k]="done" && echo "DONE $k"
        elif [ "$st2" = "failed" ] || [ "$st2" = "nsfw" ]; then
          STATE[$k]="failed"; echo "FAILED $k ($st2)"
        else
          STATE[$k]="in_progress"; inflight=$((inflight+1))
        fi ;;
    esac
  done
  # fill free slots
  for k in "${pendings[@]:-}"; do
    [ -n "$k" ] || continue
    [ $inflight -ge 4 ] && break
    out=$(higgsfield generate create gpt_image_2 --prompt "${PROMPT[$k]}" --aspect_ratio 1:1 --resolution 2k --quality high --json 2>&1)
    id=$(echo "$out" | python -c "import sys,json;print(json.load(sys.stdin)[0])" 2>/dev/null)
    if [ -n "$id" ]; then ID[$k]="$id"; STATE[$k]="submitted"; inflight=$((inflight+1)); echo "SUBMITTED $k -> $id"
    else echo "RATE-WAIT $k"; fi
  done
  save
  [ $done_all -eq 1 ] && { echo "ALL_COMPLETE"; exit 0; }
  sleep 10
done
echo "TIMEOUT"; exit 1
