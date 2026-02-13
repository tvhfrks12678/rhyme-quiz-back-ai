import { Elysia } from 'elysia';
import { Effect } from 'effect';
import { createDb } from './shared/db/client';
import { DrizzleTodoRepository } from './features/todo/infrastructure/repository.impl';
import { TodoUseCase } from './features/todo/application/usecase';
import { todoController } from './features/todo/presentation/controller';

export const createApp = () =>
  Effect.map(createDb(), (db) => {
    const repository = new DrizzleTodoRepository(db);
    const useCase = new TodoUseCase(repository);

    return new Elysia()
      .get('/health', () => ({ ok: true }))
      .use(todoController(useCase));
  });
