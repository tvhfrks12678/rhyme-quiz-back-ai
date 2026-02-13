import type { CreateTodoInput, Todo, UpdateTodoInput } from '../domain/model';

export interface TodoRepository {
  list(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(input: CreateTodoInput): Promise<Todo>;
  update(id: string, input: UpdateTodoInput): Promise<Todo | null>;
  remove(id: string): Promise<boolean>;
}
