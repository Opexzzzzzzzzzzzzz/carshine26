#!/usr/bin/env bash
# Автоматический деплой CarShine на чистый Ubuntu-сервер.
# Запуск (под root):  curl -fsSL https://raw.githubusercontent.com/Opexzzzzzzzzzzzzz/carshine26/main/deploy.sh | bash
set -euo pipefail

REPO="https://github.com/Opexzzzzzzzzzzzzz/carshine26.git"
APP_DIR="/opt/carshine"
DOMAIN="carshine26.ru"

echo "==> [1/8] Своп 2 ГБ"
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> [2/8] Пакеты: Node 22, nginx, git"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
fi
apt-get install -y nodejs nginx git

echo "==> [3/8] Код проекта"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull
else
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"

echo "==> [4/8] .env"
if [ ! -f .env ]; then
  set +e +o pipefail
  ADMIN_PW="$(head -c 24 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | cut -c1-16)"
  set -e -o pipefail
  [ -n "$ADMIN_PW" ] || ADMIN_PW="carshine$(date +%s | cut -c6-)"
  cat > .env <<EOF
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="$ADMIN_PW"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""
EOF
  echo "    Сгенерирован пароль админки (сохрани!): $ADMIN_PW"
else
  echo "    .env уже есть — не трогаю"
fi

echo "==> [5/8] Зависимости + БД"
npm install --include=dev --no-audit --no-fund
NEED_SEED=0
[ -f prisma/dev.db ] || NEED_SEED=1
npx prisma db push
if [ "$NEED_SEED" = "1" ]; then
  echo "    Заливаю каталог в БД (seed)…"
  npm run db:seed
else
  echo "    БД уже есть — seed пропущен (данные сохранены)"
fi

echo "==> [6/8] Сборка"
npm run build

echo "==> [7/8] systemd-сервис"
cat > /etc/systemd/system/carshine.service <<EOF
[Unit]
Description=CarShine Next.js
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm run start
Environment=NODE_ENV=production
Environment=PORT=3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now carshine
systemctl restart carshine

echo "==> [8/8] nginx"
cat > /etc/nginx/sites-available/carshine <<EOF
server {
    listen 80 default_server;
    server_name $DOMAIN www.$DOMAIN _;

    # Загруженные через админку фото — отдаём напрямую с диска (next start их не отдаёт).
    location /uploads/ {
        alias $APP_DIR/public/uploads/;
        expires 30d;
        access_log off;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
ln -sf /etc/nginx/sites-available/carshine /etc/nginx/sites-enabled/carshine
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

sleep 2
CODE="$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 || echo err)"
IP="$(curl -s ifconfig.me || echo '168.222.203.84')"
echo ""
echo "======================================================"
echo " Готово. Локальная проверка сайта: HTTP $CODE"
echo " Откройте в браузере:  http://$IP"
echo " Админка:  http://$IP/admin"
echo " Пароль админки — см. строку [4/8] выше (или файл $APP_DIR/.env)"
echo "======================================================"
