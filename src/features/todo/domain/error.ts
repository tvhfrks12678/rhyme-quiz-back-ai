export class TodoNotFoundError extends Error {
  constructor(id: string) {
    super(`Todo not found: ${id}`);
    this.name = 'TodoNotFoundError';
  }
}

export class InvalidTodoInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTodoInputError';
  }
}
