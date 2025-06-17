FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache dos2unix curl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

COPY entrypoint.sh ./entrypoint.sh

RUN dos2unix ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3003

ENTRYPOINT ["./entrypoint.sh"]
