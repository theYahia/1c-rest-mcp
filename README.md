# aprovodka

> **MCP server for 1C:Enterprise** — an AI agent reads and writes live 1C database data
> through the platform's own OData 3.0 interface. No configuration extension, no BSL.

[![npm](https://img.shields.io/npm/v/@theyahia/aprovodka)](https://www.npmjs.com/package/@theyahia/aprovodka)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**34 tools · 11 modules · Node.js 18+ · stdio + Streamable HTTP**

📄 **[Сайт продукта и услуги](https://theyahia.github.io/aprovodka/)** · 📖 **[Руководство пользователя (рус., 75 стр.)](https://github.com/theYahia/WWmcp/blob/main/servers/aprovodka/docs/MANUAL.ru.md)** · 💬 **[Заказать сверку цифр](#order)**

```bash
npx -y @theyahia/aprovodka
```

---

<a id="order"></a>

## Схема вашей базы + сверка цифр — 12 000 ₽

Сервер бесплатный и открытый. Платная — работа по вашей базе, где всё держится на одном:
**самоделка на OData не падает, она молча отдаёт неверное число.** Проверить это можно только
на конкретной конфигурации.

Что входит, за одну информационную базу:

- **файл схемы** под вашу конфигурацию — какие сущности есть, как они называются, что с чем связано;
- **список ловушек именно вашей базы** — где запрос вернёт правдоподобное, но неверное;
- **отчёт сверки по 10 согласованным вопросам** — ответ агента стоит рядом с цифрой из вашего же
  штатного отчёта 1С, строка в строку.

**Срок** — 5 рабочих дней. **Приёмка** — по совпадению цифр, критерий согласуем до начала.
Предоплата 100%, чек НПД. Условия целиком — [договор-оферта](https://theyahia.github.io/aprovodka/oferta.html).

📧 **[leadmanager81@yandex.ru](mailto:leadmanager81@yandex.ru?subject=Сверка%20базы%20aprovodka)** ·
💬 **[@metarebalancer](https://t.me/metarebalancer)** — ответим в рабочие дни, 10:00–19:00 МСК.
Напишите, какая у вас конфигурация и опубликован ли OData.

---

## What it does

Business data in a 1C database is closed to outside programs until someone writes a report,
an external data processor, or an exchange for it. aprovodka removes that cycle: the OData 3.0
interface is published by the platform itself, and that is enough.

Coverage: catalogs, documents, all four register kinds, the accounting register including its
virtual tables (balances, turnovers, ext-dimensions), constants, batch operations, change
tracking, and metadata discovery.

**What makes it different from the rest of the niche:**

- **No BSL, nothing installed into the configuration.** Six of the eight comparable servers
  require an extension in the database; the two that don't, don't touch live data.
- **Writes, not just reads.** Create and update documents, post and unpost, deletion marks.
- **A write-safety gate.** Three modes — `off`, `preview`, `approval` — intercepted at a single
  point in the client, so no tool can bypass it. Reversible operations return a rollback token;
  irreversible ones are labelled with the reason.
- **Curated configuration presets** for БП 3.0, УТ 11, ЗУП 3.1 and ERP 2 — key entities with
  Russian descriptions, ready query examples, and the traps people hit.

## Configuration

```json
{
  "mcpServers": {
    "aprovodka": {
      "command": "npx",
      "args": ["-y", "@theyahia/aprovodka"],
      "env": {
        "ONEC_BASE_URL": "https://server/base/odata/standard.odata",
        "ONEC_LOGIN": "user",
        "ONEC_PASSWORD": "pass"
      }
    }
  }
}
```

Set `ONEC_WRITE_MODE` to `preview` or `approval` to enable the write gate (`off` by default,
byte-for-byte the previous behaviour). Full environment reference, per-tool documentation and
the module filter are in the [monorepo README](https://github.com/theYahia/WWmcp/tree/main/servers/aprovodka).

## Where the code lives

Source, tests and releases live in the [**theYahia/WWmcp**](https://github.com/theYahia/WWmcp/tree/main/servers/aprovodka)
monorepo, alongside the shared `@theyahia/mcp-core`. This repository is the product's front page.

## Migrating from `@theyahia/1c-rest-mcp`

The package was renamed in v4.0.0 — «1С» may not be used in a product's name
(Infostart rules, § 2.2.11). The old package is frozen at v3.2.0.

- **Install:** `npx -y @theyahia/aprovodka`
- **Binary renamed:** `1c-rest-mcp` → `aprovodka`
- **Server name in the MCP handshake** is now `aprovodka` — update the key if you pinned it

Everything else is unchanged: tool names, arguments, return formats, prompts, and the `ONEC_*`
environment variables (the `1C_*` aliases still work). No config changes beyond the command.

## Trademarks

aprovodka is an independent product. It is not a product of 1C Company and is not affiliated
with it. «1С» and «1С:Предприятие» are trademarks of 1C Company; this product's name contains
neither. Interaction with the database happens only through the open OData interface the
platform itself provides.

## License

MIT

---

Telegram: [@vhodvai](https://t.me/vhodvai)
