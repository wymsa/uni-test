# Что было выполнено
## Основные требования
* the app runs with single command - **запуск всего приложения через docker compose `docker compose up / docker compose up --build`**
* gateway - **принимает через веб-хук запросы от сервиса `events` и отправляет их в соответствующий сервис `collectors`. Переменная окружения `EVENT_ENDPOINT` указывается в docker compose файле**
* collectors  - **обрабатывают сообщения с `subjects` и сохраняют их в БД**
* reporter - **реализовано 2 из 3 роутов (`/reports/events` и `/reports/revenue`)**

## Дополнительные требования
* on application or docker-compose restart, data from the previous run remains intact - **данные не теряются, используются `volumes` для БД и NATS-сервера**
* gateway and collectors use custom nestjs wrappers on top of nats - **вместо использования `@nestjs/microservices` создан NATS Module, который выполняет подключение к NATS-серверу и работу с NATS Jetstream и Request/Reply для `reporter` сервиса**
* implement structured logging with correlation IDs to trace events across services - **только консольное логгирование и передача correlation ID в `headers` сообщения**
* each service should expose liveness and readiness endpoints for monitoring - **только `/health` эндпоинты**
* automatically run Prisma migrations on startup to keep the DB schema up-to-date - **при старте сервиса вызывается `prisma migrate deploy`, `prisma generate` при билде**
* design the architecture so that gateway and collectors can be horizontally scaled if needed - **горизонтальное масштабирование для сервисов `collectors` работает через указание `durableName` для консюмера, разделяет обработку сообщений при запуске более 1 экземпляра сервиса. Масшабирование `gateway` по-идее реализуется на уровне веб-сервера (не проверял для него)**
* docker-compose should start only if all services are healthy - ? **`health checks` есть но нет понимания как должны работать**

## Итоговый docker-compose
| Сервис  | Краткое описание |
| ------------- |:-------------:|
| events      | сервис, который отправляет ивенты через веб-хук в сервис gateway     |
| nats-server      | сервис NATS-сервера     |
| nats-box     | сервис, который даёт CLI для работы с NATS-сервером (создание стрима `events` через него)    |
| postgres-server     | сервис БД     |
| gateway    | сервис, который принимает ивенты через веб-хук    |
| reporter    | сервис, который выполняет создание отчётов    |
| ttk-collector    | сервис, который обрабатывает сообщения с `source` tiktok     |
| fb-collector    | сервис, который обрабатывает сообщения с `source` facebook     |

## Reporter эндпоинты

* `/reports/events` - **возвращает количество ивентов по `eventType`. Примеры `Query` параметров запроса: from: "2025-06-15", to: "2025-06-16", source: "facebook" | "tiktok", funnelStage: "top" | "bottom", eventType: "ad.click"**
* `/reports/revenue` - **возвращает суммированное значение по `eventType` (для facebook - checkout.complete, для tiktok - purchase). Примеры `Query` параметров запроса: from: "2025-06-15", to: "2025-06-16", source: "facebook" | "tiktok", campaignId?** 

