import { and, eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { CreateTodoInput, Todo, UpdateTodoInput } from '../domain/model';
import type { TodoRepository } from '../application/repository.port';
import { todos } from '../../../shared/db/schema';

const toDomain = (row: typeof todos.$inferSelect): Todo => ({
  id: row.id,
  title: row.title,
  completed: row.completed,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt
});

export class DrizzleTodoRepository implements TodoRepository {
  constructor(private readonly db: LibSQLDatabase) {}

  async list(): Promise<Todo[]> {
    const rows = await this.db.select().from(todos);
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Todo | null> {
    const [row] = await this.db.select().from(todos).where(eq(todos.id, id)).limit(1);
    return row ? toDomain(row) : null;
  }

  async create(input: CreateTodoInput): Promise<Todo> {
    const now = new Date();
    const id = crypto.randomUUID();
    await this.db.insert(todos).values({
      id,
      title: input.title,
      completed: false,
      createdAt: now,
      updatedAt: now
    });

    const created = await this.findById(id);
    if (!created) throw new Error('Failed to create todo');
    return created;
  }

  async update(id: string, input: UpdateTodoInput): Promise<Todo | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    await this.db
      .update(todos)
      .set({
        ...(typeof input.title === 'string' ? { title: input.title } : {}),
        ...(typeof input.completed === 'boolean' ? { completed: input.completed } : {}),
        updatedAt: new Date()
      })
      .where(and(eq(todos.id, id)));

    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.db.delete(todos).where(eq(todos.id, id)).returning({ id: todos.id });
    return result.length > 0;
  }
}
