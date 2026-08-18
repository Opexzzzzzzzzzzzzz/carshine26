#!/usr/bin/env bash
# Одноразовая настройка: применяет текущую версию и включает автодеплой.
# После этого обновления идут сами при git push (ничего вводить не нужно).
set -e
cd /opt/carshine

echo ">>> Обновляю код и пересобираю сайт…"
git pull
bash deploy.sh

echo ">>> Включаю автодеплой (cron каждые 2 минуты)…"
apt-get install -y cron >/dev/null 2>&1 || true
systemctl enable --now cron >/dev/null 2>&1 || true
chmod +x autodeploy.sh
( crontab -l 2>/dev/null | grep -v autodeploy; \
  echo "*/2 * * * * flock -n /tmp/cs.lock /opt/carshine/autodeploy.sh >> /var/log/carshine-deploy.log 2>&1" ) | crontab -

echo "======================================================"
echo " ГОТОВО. Автодеплой включён."
echo " Теперь любые изменения появляются на сайте сами за ~2 мин."
echo " Тебе больше ничего вводить не нужно."
echo "======================================================"
