import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { Effect } from 'effect';

const getDatabaseConfig = Effect.sync(() => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required.');
  }

  return { url, authToken };
});

export const createDb = () =>
  Effect.map(getDatabaseConfig, ({ url, authToken }) => {
    const client = createClient({ url, authToken });
    return drizzle(client);
  });
