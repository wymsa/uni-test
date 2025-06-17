#!/bin/sh

# until npx prisma db execute --script="SELECT 1" --non-interactive > /dev/null 2>&1; do
#   >&2 echo "db not ready"
#   sleep 2
# done

echo "Applying migrations"
npx prisma migrate deploy

exec npm run start:prod
