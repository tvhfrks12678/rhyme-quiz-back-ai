import { t } from 'elysia';

export const todoResponse = t.Object({
  id: t.String(),
  title: t.String(),
  completed: t.Boolean(),
  createdAt: t.String(),
  updatedAt: t.String()
});

export const createTodoBody = t.Object({
  title: t.String({ minLength: 1 })
});

export const updateTodoBody = t.Object({
  title: t.Optional(t.String({ minLength: 1 })),
  completed: t.Optional(t.Boolean())
});

export const idParam = t.Object({
  id: t.String()
});
