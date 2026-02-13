import { Effect } from 'effect';
import { createApp } from './main';

const app = Effect.runSync(createApp());

app.listen(process.env.PORT ?? 3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
