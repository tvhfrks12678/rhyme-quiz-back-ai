# Elysia + Turso + Effect + Drizzle + Vitest (Hexagonal Architecture)

`features/todo` を中心に、ヘキサゴナルアーキテクチャで Todo CRUD を実装しています。

## セットアップ

```bash
bun install
cp .env.example .env
```

`.env` に Turso Cloud 情報を設定してください（ローカルDBは使いません）。

```env
TURSO_DATABASE_URL=libsql://xxxx.turso.io
TURSO_AUTH_TOKEN=...
PORT=3000
```

## 開発

```bash
bun run dev
```

## テスト (Vite/Vitest)

```bash
bun run test
```

## Drizzle

```bash
bun run db:generate
bun run db:push
```

## Vercel

- エントリーポイント: `api/index.ts`
- ルーティング: `vercel.json`

## ディレクトリ構成

```text
.
├── drizzle.config.ts
├── vercel.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src
│   ├── shared
│   │   └── db
│   │       ├── client.ts
│   │       └── schema.ts
│   ├── features
│   │   └── todo
│   │       ├── domain
│   │       │   ├── model.ts
│   │       │   └── error.ts
│   │       ├── application
│   │       │   ├── repository.port.ts
│   │       │   └── usecase.ts
│   │       ├── infrastructure
│   │       │   └── repository.impl.ts
│   │       ├── presentation
│   │       │   ├── controller.ts
│   │       │   └── dto.ts
│   │       └── tests
│   │           └── todo.integration.test.ts
│   ├── main.ts
│   └── index.ts
└── api
    └── index.ts
```
