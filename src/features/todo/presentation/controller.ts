import { Elysia } from 'elysia';
import { InvalidTodoInputError, TodoNotFoundError } from '../domain/error';
import type { TodoUseCase } from '../application/usecase';
import { createTodoBody, idParam, todoResponse, updateTodoBody } from './dto';

const serializeTodo = (todo: Awaited<ReturnType<TodoUseCase['getTodo']>>) => ({
  ...todo,
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString()
});

export const todoController = (useCase: TodoUseCase) =>
  new Elysia({ prefix: '/todos' })
    .get('/', async () => {
      const todos = await useCase.listTodos();
      return todos.map(serializeTodo);
    })
    .get('/:id', async ({ params }) => serializeTodo(await useCase.getTodo(params.id)), {
      params: idParam,
      response: { 200: todoResponse }
    })
    .post('/', async ({ body, set }) => {
      const todo = await useCase.createTodo(body);
      set.status = 201;
      return serializeTodo(todo);
    }, { body: createTodoBody, response: { 201: todoResponse } })
    .patch('/:id', async ({ params, body }) => serializeTodo(await useCase.updateTodo(params.id, body)), {
      params: idParam,
      body: updateTodoBody,
      response: { 200: todoResponse }
    })
    .delete('/:id', async ({ params, set }) => {
      await useCase.deleteTodo(params.id);
      set.status = 204;
      return;
    }, { params: idParam })
    .onError(({ error, set }) => {
      if (error instanceof TodoNotFoundError) {
        set.status = 404;
        return { message: error.message };
      }
      if (error instanceof InvalidTodoInputError) {
        set.status = 400;
        return { message: error.message };
      }
    });
