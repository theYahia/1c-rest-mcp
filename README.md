# @theyahia/1c-rest-mcp

MCP-сервер для REST API 1С:Предприятие через OData 3.0 -- справочники, документы, регистры, отчёты.

## Инструменты (7)

| Инструмент | Описание |
|---|---|
| `get_catalogs` | Чтение справочников через OData ($filter, $select, $orderby, $top, $skip) |
| `get_documents` | Чтение документов через OData с фильтрацией |
| `create_document` | Создание документа (POST) |
| `update_document` | Обновление документа (PATCH по Ref_Key) |
| `get_register` | Чтение регистров сведений и накопления |
| `get_report` | Получение отчёта по произвольному URL HTTP-сервиса |
| `odata_query` | Произвольный OData-запрос с $expand, $inlinecount |

## Skills

| Skill | Описание |
|---|---|
| `skill-catalog` | Быстрый поиск по справочнику (обёртка над get_catalogs) |
| `skill-documents` | Запрос документов по типу и датам (обёртка над get_documents) |

## Настройка (stdio)

```json
{
  "mcpServers": {
    "1c": {
      "command": "npx",
      "args": ["-y", "@theyahia/1c-rest-mcp"],
      "env": {
        "ONEC_BASE_URL": "http://server:8080/base",
        "ONEC_LOGIN": "логин",
        "ONEC_PASSWORD": "пароль"
      }
    }
  }
}
```

## Streamable HTTP

```bash
ONEC_BASE_URL=http://server:8080/base \
ONEC_LOGIN=admin \
ONEC_PASSWORD=secret \
npx @theyahia/1c-rest-mcp-http
# или: node dist/http.js
# Слушает POST /mcp, GET /health на порту 3000 (PORT=3000)
```

## Переменные окружения

| Переменная | Обязательна | Описание |
|---|---|---|
| `ONEC_BASE_URL` | Да | Базовый URL сервера 1С (например http://localhost:8080/base) |
| `ONEC_LOGIN` | Да | Логин для HTTP Basic Auth |
| `ONEC_PASSWORD` | Да | Пароль для HTTP Basic Auth |

> Обратная совместимость: старые имена `1C_BASE_URL`, `1C_LOGIN`, `1C_PASSWORD` тоже поддерживаются.

## Smithery

Файл `smithery.yaml` включён для деплоя на [Smithery](https://smithery.ai).

## Лицензия

MIT
