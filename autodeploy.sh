#!/usr/bin/env bash
# Автообновление: проверяет GitHub, и если появились новые коммиты —
# подтягивает, пересобирает и перезапускает сайт. Запускается по cron.
set -e
cd /opt/carshine

git fetch origin main --quiet
LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse origin/main)"

if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0   # изменений нет — тихо выходим
fi

echo "===== $(date '+%F %T') : новая версия $REMOTE, деплой ====="
git pull --quiet
npm install --include=dev --no-audit --no-fund
npx prisma db push
NODE_OPTIONS="--max-old-space-size=1536" npm run build
systemctl restart carshine
echo "===== $(date '+%F %T') : готово ====="
