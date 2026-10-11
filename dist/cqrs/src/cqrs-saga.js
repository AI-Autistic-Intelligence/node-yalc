/**
 * Central Engine for the Command Query Responsibility Segregation (CQRS) architecture.
 * Manages the registration and routing of Commands and Queries to their respective handlers.
 */
export class CqrsEngine {
    constructor() {
        this.commandHandlers = new Map();
        this.queryHandlers = new Map();
    }
    /**
     * Registers a handler for a specific Command type.
     * @param commandType The unique string identifier for the command.
     * @param handler The asynchronous function that will process the command.
     */
    registerCommandHandler(commandType, handler) {
        this.commandHandlers.set(commandType, handler);
    }
    /**
     * Registers a handler for a specific Query type.
     * @param queryType The unique string identifier for the query.
     * @param handler The asynchronous function that will resolve the query.
     */
    registerQueryHandler(queryType, handler) {
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
    async executeCommand(command) {
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
    async executeQuery(query) {
        const handler = this.queryHandlers.get(query.type);
        if (!handler) {
            throw new Error(`No QueryHandler registered for query type: ${query.type}`);
        }
        return await handler(query);
    }
}
/**
 * Saga Orchestrator for managing distributed transactions and long-running processes.
 *
 * Executes steps sequentially. If any step fails, it triggers the compensation
 * mechanisms (rollbacks) of all previously succeeded steps in reverse order.
 */
export class SagaOrchestrator {
    constructor() {
        this.steps = [];
    }
    /**
     * Appends a new step to the end of the Saga execution pipeline.
     * @param step The step containing the action and its corresponding compensation logic.
     * @returns {this} The current Orchestrator instance for method chaining.
     */
    addStep(step) {
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
    async execute() {
        const executedSteps = [];
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            try {
                await step.action();
                executedSteps.push(step.name);
            }
            catch (err) {
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
    async rollback(fromIndex) {
        for (let i = fromIndex; i >= 0; i--) {
            const step = this.steps[i];
            try {
                await step.compensation();
            }
            catch (compErr) {
                console.error(`Compensation for step [${step.name}] failed:`, compErr.message);
            }
        }
    }
}
//# sourceMappingURL=cqrs-saga.js.map