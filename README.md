# @theyahia/1c-rest-mcp

MCP-сервер для REST API 1С:Предприятие -- справочники и документы.

## Инструменты

| Инструмент | Описание |
|---|---|
| `get_catalogs` | Получение данных из справочников |
| `get_documents` | Получение документов по типу и периоду |
| `create_document` | Создание нового документа |

## Настройка

```json
{
  "mcpServers": {
    "1c": {
      "command": "npx",
      "args": ["-y", "@theyahia/1c-rest-mcp"],
      "env": {
        "1C_BASE_URL": "http://server:8080",
        "1C_LOGIN": "логин",
        "1C_PASSWORD": "пароль"
      }
    }
  }
}
```

## Переменные окружения

| Переменная | Обязательна | Описание |
|---|---|---|
| `1C_BASE_URL` | Да | Базовый URL сервера 1С (например http://localhost:8080) |
| `1C_LOGIN` | Да | Логин для Basic Auth |
| `1C_PASSWORD` | Да | Пароль для Basic Auth |

## Лицензия

MIT
