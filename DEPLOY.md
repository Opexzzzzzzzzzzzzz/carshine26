# Деплой CarShine на VPS (Ubuntu 26.04, 2 ГБ RAM)

Сервер: SpaceWeb VPS · IP `168.222.203.84` · домен `carshine26.ru` (DNS на Timeweb).
Сборка выполняется на сервере (2 ГБ RAM это позволяет; своп — страховка).

---

## 0. Подключение
С Windows (PowerShell/Git Bash):
```bash
ssh root@168.222.203.84
```
Введи root-пароль из панели SpaceWeb.

## 1. Своп 2 ГБ (страховка памяти на сборку)
```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
free -h
```

## 2. Базовый софт: Node 22, nginx, git, certbot
```bash
apt update && apt -y upgrade
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs nginx git
node -v && npm -v
```

## 3. Код проекта на сервер
### Вариант A (рекомендую) — приватный GitHub + deploy-ключ

**3.1. На компьютере (Git Bash в папке проекта):** создай пустой приватный репозиторий на github.com (например `carshine`), затем:
```bash
git remote add origin git@github.com:ТВОЙ_ЛОГИН/carshine.git
git push -u origin main
```

**3.2. На сервере — read-only ключ для приватного репо:**
```bash
ssh-keygen -t ed25519 -C "carshine-vps" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```
Скопируй вывод и добавь его в GitHub: репозиторий → **Settings → Deploy keys → Add deploy key** (галку «Allow write» НЕ ставь). Потом:
```bash
mkdir -p /opt && cd /opt
git clone git@github.com:ТВОЙ_ЛОГИН/carshine.git carshine
cd /opt/carshine
```

Обновление потом: `cd /opt/carshine && git pull` (без паролей, ключ уже привязан).
Вариант B — загрузить напрямую с компьютера (без GitHub), выполнить ЛОКАЛЬНО в папке проекта:
```bash
# из C:\Users\Andrew\Desktop\Спиздили(SNATCH)\carshine
tar --exclude=node_modules --exclude=.next --exclude=data/images -czf /tmp/carshine.tgz .
scp /tmp/carshine.tgz root@168.222.203.84:/opt/
# затем на сервере:
mkdir -p /opt/carshine && tar -xzf /opt/carshine.tgz -C /opt/carshine && cd /opt/carshine
```

## 4. Переменные окружения (.env)
```bash
cd /opt/carshine
cat > .env <<'EOF'
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="ПРИДУМАЙ-СВОЙ-ПАРОЛЬ"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""
EOF
```
`TELEGRAM_*` заполнишь, когда будет бот. `ADMIN_PASSWORD` — обязательно смени.

## 5. Установка, БД, сборка
```bash
cd /opt/carshine
npm ci                 # поставит зависимости + сгенерит Prisma Client
npx prisma db push     # создаст БД по схеме
npm run db:seed        # зальёт 1747 товаров и категории из data/catalog.json
npm run build          # прод-сборка (тут пригодится своп)
```

## 6. Автозапуск через systemd
```bash
cat > /etc/systemd/system/carshine.service <<'EOF'
[Unit]
Description=CarShine Next.js
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/carshine
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
systemctl status carshine --no-pager
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000    # ждём 200
```
(Next сам читает `.env` из рабочей папки — отдельный EnvironmentFile не нужен.)

## 7. Nginx (проксирование на порт 3000)
```bash
cat > /etc/nginx/sites-available/carshine <<'EOF'
server {
    listen 80;
    server_name carshine26.ru www.carshine26.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
ln -sf /etc/nginx/sites-available/carshine /etc/nginx/sites-enabled/carshine
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```
Проверка по IP: открой `http://168.222.203.84` — сайт должен открыться.

## 8. Домен → сервер (в панели Timeweb)
Домены и SSL → `carshine26.ru` → настройки DNS:
- `A` запись `@` → `168.222.203.84`
- `A` запись `www` → `168.222.203.84`
Подожди 10 мин – пару часов, проверь `http://carshine26.ru`.

## 9. SSL (после того как домен ведёт на сервер)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d carshine26.ru -d www.carshine26.ru
```
Certbot сам пропишет HTTPS и автопродление.

---

## Обновление сайта потом
```bash
cd /opt/carshine
git pull            # (или заново залить архив)
npm ci
npx prisma db push  # если менялась схема
npm run build
systemctl restart carshine
```
БД (`prisma/dev.db`) при обновлении НЕ трогается — товары и заказы сохраняются.

## Заметки
- Фото сейчас грузятся с tildacdn (работает). Чтобы уйти на своё: залить `data/images/` на сервер, добавить хост в `next.config.ts` и переключить пути на `localImage`.
- Бэкап БД: `cp /opt/carshine/prisma/dev.db ~/carshine-$(date +%F).db` (или включённые бэкапы SpaceWeb на весь диск).
- Логи приложения: `journalctl -u carshine -f`.
