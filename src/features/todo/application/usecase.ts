import { InvalidTodoInputError, TodoNotFoundError } from '../domain/error';
import type { CreateTodoInput, Todo, UpdateTodoInput } from '../domain/model';
import type { TodoRepository } from './repository.port';

export class TodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  listTodos(): Promise<Todo[]> {
    return this.repository.list();
  }

  async getTodo(id: string): Promise<Todo> {
    const todo = await this.repository.findById(id);
    if (!todo) throw new TodoNotFoundError(id);
    return todo;
  }

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    if (!input.title?.trim()) {
      throw new InvalidTodoInputError('title is required');
    }
    return this.repository.create({ title: input.title.trim() });
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
    if (typeof input.title === 'string' && !input.title.trim()) {
      throw new InvalidTodoInputError('title cannot be empty');
    }

    const updated = await this.repository.update(id, {
      ...input,
      title: input.title?.trim()
    });

    if (!updated) throw new TodoNotFoundError(id);
    return updated;
  }

  async deleteTodo(id: string): Promise<void> {
    const removed = await this.repository.remove(id);
    if (!removed) throw new TodoNotFoundError(id);
  }
}
