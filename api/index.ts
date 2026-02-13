import { Effect } from 'effect';
import { createApp } from '../src/main';

const app = Effect.runSync(createApp());

export default {
  fetch: app.fetch
};
