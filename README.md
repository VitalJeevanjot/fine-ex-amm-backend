# Fine Exchange AOM: database service

Part of **Fine Exchange AOM**, an automated order manager for market makers that I built in 2022 as part of Fine Exchange, my crypto exchange project. The [client repository](https://github.com/VitalJeevanjot/Fine-Exchange-AMM) explains the whole system, with a diagram and the path a task takes through the services.

> **Status: ended.** The Fine Exchange project ended in 2022 and the fine.exchange domain has expired, so it's no longer mine. Read the code, but don't run it with real API keys.

The service that owns the task records. The load balancer, queue service and worker call it over HTTP; nothing else touches the database.

- Stores each task in PostgreSQL through Sequelize, with the exchange API key and secret encrypted with cryptr before they're written.
- Records the id of the order a task currently has open, so the worker can edit it on the next run.
- Cancels the open order on the exchange through CCXT when a task is deleted, then marks the task deleted.
- Logs every request with winston to PostgreSQL (`winston-postgres-transport`), with the logged payloads encrypted.

## Endpoints

| Route | Does |
| --- | --- |
| `POST /get_services` | The tasks that belong to a user |
| `POST /save_created_new` | Save a new task |
| `POST /get_task_by_id` | One task |
| `POST /update_order_id` | Record a task's latest order id |
| `POST /delete_service` | Cancel the task's open order and mark it deleted |
| `GET /hello` | Health check |

`npm run setup_db` creates the tables (`controller/cli/databaseModal.ts`).

## Environment

```
APIKEY=
APISECRET=
APIURL=
USER_NAME=        # PostgreSQL user
USER_PASSWORD=    # PostgreSQL password
DB_URL=           # PostgreSQL host
DB_PORT=
DB_NAME=
DB_NAME_TASKS=
DB_TABLE_NAME=
ENCRYPT_KEY=      # cryptr key shared by the services
```

Commits authored as "Ubuntu" came from the EC2 machine I developed on; they're mine too.

## The system

| Service | Repository |
| --- | --- |
| Client | [Fine-Exchange-AMM](https://github.com/VitalJeevanjot/Fine-Exchange-AMM) |
| Load balancer (the API the client calls) | [fine-ex-amm-backend-load-balancer](https://github.com/VitalJeevanjot/fine-ex-amm-backend-load-balancer) |
| Queue service | [fine-ex-amm-backend-queue-jobs-1](https://github.com/VitalJeevanjot/fine-ex-amm-backend-queue-jobs-1) |
| Worker | [fine-ex-amm-backend-worker-jobs-1](https://github.com/VitalJeevanjot/fine-ex-amm-backend-worker-jobs-1) |
| Database service | [fine-ex-amm-backend](https://github.com/VitalJeevanjot/fine-ex-amm-backend) |

## Running it

```bash
npm install
npm run dev      # nodemon on app.ts
npm run build    # compile to dist/
npm start        # node dist/app.js
```

Each service listens on port 8080. `okteto.yml` and `dockerfile` are the Okteto development environment it ran in.

Built by [Jeevanjot Singh Vital](https://jeevanjotsinghvital.com).
