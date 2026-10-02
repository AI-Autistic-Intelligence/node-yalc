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
export async function runLambdaCliOperation(
  method: (...args: any) => Promise<void>,
  message: string,
) {
  try {
    await method();
  } catch (error) {
    // apparently the only way to let lambda exit
    // after an error is by catching it here
    // and set a promise rejection. We should investigate why it's happening
    // since it should exit automatically after a thrown error
    return Promise.reject(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };
}
