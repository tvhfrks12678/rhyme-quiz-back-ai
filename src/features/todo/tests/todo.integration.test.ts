import { describe, expect, it } from 'vitest';
import type { CreateTodoInput, Todo, UpdateTodoInput } from '../domain/model';
import type { TodoRepository } from '../application/repository.port';
import { TodoUseCase } from '../application/usecase';
import { TodoNotFoundError } from '../domain/error';

class InMemoryTodoRepository implements TodoRepository {
  private store = new Map<string, Todo>();

  async list(): Promise<Todo[]> {
    return [...this.store.values()];
  }

  async findById(id: string): Promise<Todo | null> {
    return this.store.get(id) ?? null;
  }

  async create(input: CreateTodoInput): Promise<Todo> {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: input.title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.store.set(todo.id, todo);
    return todo;
  }

  async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const existing = this.store.get(id);
    if (!existing) return null;

    const updated: Todo = {
      ...existing,
      ...input,
      updatedAt: new Date()
    };
    this.store.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}

describe('TodoUseCase', () => {
  it('can create/list/update/delete todo', async () => {
    const useCase = new TodoUseCase(new InMemoryTodoRepository());

    const created = await useCase.createTodo({ title: 'Buy milk' });
    expect(created.title).toBe('Buy milk');
    expect(created.completed).toBe(false);

    const listed = await useCase.listTodos();
    expect(listed).toHaveLength(1);

    const updated = await useCase.updateTodo(created.id, { completed: true });
    expect(updated.completed).toBe(true);

    await useCase.deleteTodo(created.id);
    await expect(useCase.getTodo(created.id)).rejects.toBeInstanceOf(TodoNotFoundError);
  });
});
