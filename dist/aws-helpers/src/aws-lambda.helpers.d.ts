/**
 * Safely executes a CLI command or background operation within an AWS Lambda environment.
 * Ensures that if the method throws an exception, the Lambda function accurately catches it
 * and fails the invocation, rather than timing out or silently exiting.
 *
 * @param method The asynchronous function to execute. Ensure all necessary parameters are bound or scoped correctly.
 * @param message The success message to return if the operation completes without errors.
 * @returns An APIGateway-compatible response object containing a 200 status code and the success message.
 * @throws The original error if the `method` fails, forcing a Promise rejection which triggers Lambda failure handling.
 */
export declare function runLambdaCliOperation(method: (...args: any) => Promise<void>, message: string): Promise<{
    statusCode: number;
    body: string;
}>;
