#!/bin/sh

echo "Applying migrations"
npx prisma migrate deploy

exec npm run start:prod
