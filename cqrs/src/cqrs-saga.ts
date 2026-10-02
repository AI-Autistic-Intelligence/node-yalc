/**
 * Represents a Command in the CQRS pattern.
 * Commands represent an intention to change the application state.
 */
export interface ICommand {
  /** A unique string identifier for the command type. */
  type: string;
  /** The data payload required to execute the command. */
  payload: any;
}

/**
 * Represents a Query in the CQRS pattern.
 * Queries are strictly for retrieving data without causing side-effects.
 */
export interface IQuery {
  /** A unique string identifier for the query type. */
  type: string;
  /** The parameters used to filter or specify the query results. */
  params: any;
}

/**
 * Type alias for a function that handles an incoming Command.
 * @template T The expected return type after the command has executed.
 */
export type CommandHandler<T = any> = (command: ICommand) => Promise<T>;

/**
 * Type alias for a function that handles an incoming Query.
 * @template T The expected return type of the queried data.
 */
export type QueryHandler<T = any> = (query: IQuery) => Promise<T>;

/**
 * Central Engine for the Command Query Responsibility Segregation (CQRS) architecture.
 * Manages the registration and routing of Commands and Queries to their respective handlers.
 */
export class CqrsEngine {
  private commandHandlers: Map<string, CommandHandler> = new Map();
  private queryHandlers: Map<string, QueryHandler> = new Map();

  /**
   * Registers a handler for a specific Command type.
   * @param commandType The unique string identifier for the command.
   * @param handler The asynchronous function that will process the command.
   */
  public registerCommandHandler(commandType: string, handler: CommandHandler): void {
    this.commandHandlers.set(commandType, handler);
  }

  /**
   * Registers a handler for a specific Query type.
   * @param queryType The unique string identifier for the query.
   * @param handler The asynchronous function that will resolve the query.
   */
  public registerQueryHandler(queryType: string, handler: QueryHandler): void {
    this.queryHandlers.set(queryType, handler);
  }

  /**
   * Dispatches a Command to its registered CommandHandler.
   * 
   * @template T
   * @param {ICommand} command The command object to execute.
   * @returns {Promise<T>} The result of the command execution.
   * @throws {Error} If no handler is registered for the command's type.
   */
  public async executeCommand<T = any>(command: ICommand): Promise<T> {
    const handler = this.commandHandlers.get(command.type);
    if (!handler) {
      throw new Error(`No CommandHandler registered for command type: ${command.type}`);
    }
    return await handler(command);
  }

  /**
   * Dispatches a Query to its registered QueryHandler.
   * 
   * @template T
   * @param {IQuery} query The query object to execute.
   * @returns {Promise<T>} The data requested by the query.
   * @throws {Error} If no handler is registered for the query's type.
   */
  public async executeQuery<T = any>(query: IQuery): Promise<T> {
    const handler = this.queryHandlers.get(query.type);
    if (!handler) {
      throw new Error(`No QueryHandler registered for query type: ${query.type}`);
    }
    return await handler(query);
  }
}

/**
 * Represents a single transaction step in a Distributed Saga.
 * Includes both the forward action and the backward compensation (rollback) logic.
 */
export interface SagaStep {
  /** A descriptive name for this step in the Saga. */
  name: string;
  /** The main action to execute. */
  action: () => Promise<any>;
  /** The compensating action to run if a subsequent step fails, used to rollback the state. */
  compensation: () => Promise<void>;
}

/**
 * Saga Orchestrator for managing distributed transactions and long-running processes.
 * 
 * Executes steps sequentially. If any step fails, it triggers the compensation
 * mechanisms (rollbacks) of all previously succeeded steps in reverse order.
 */
export class SagaOrchestrator {
  private steps: SagaStep[] = [];

  /**
   * Appends a new step to the end of the Saga execution pipeline.
   * @param step The step containing the action and its corresponding compensation logic.
   * @returns {this} The current Orchestrator instance for method chaining.
   */
  public addStep(step: SagaStep): this {
    this.steps.push(step);
    return this;
  }

  /**
   * Executes the Saga sequence.
   * 
   * @returns {Promise<{ success: boolean; executedSteps: string[]; error?: string }>}
   * An object indicating whether the saga completed successfully, a list of successfully 
   * executed steps, and the error message if a failure triggered a rollback.
   */
  public async execute(): Promise<{ success: boolean; executedSteps: string[]; error?: string }> {
    const executedSteps: string[] = [];

    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      try {
        await step.action();
        executedSteps.push(step.name);
      } catch (err: any) {
        console.error(`Saga step [${step.name}] failed. Triggering compensation rollback...`, err.message);
        await this.rollback(i - 1);
        return {
          success: false,
          executedSteps,
          error: `Saga step [${step.name}] failed: ${err.message}`,
        };
      }
    }

    return { success: true, executedSteps };
  }

  /**
   * Internal method that orchestrates the compensating transactions (rollbacks)
   * in reverse order from the point of failure.
   * 
   * @param fromIndex The index of the last successful step to begin rolling back from.
   */
  private async rollback(fromIndex: number): Promise<void> {
    for (let i = fromIndex; i >= 0; i--) {
      const step = this.steps[i];
      try {
        await step.compensation();
      } catch (compErr: any) {
        console.error(`Compensation for step [${step.name}] failed:`, compErr.message);
      }
    }
  }
}

