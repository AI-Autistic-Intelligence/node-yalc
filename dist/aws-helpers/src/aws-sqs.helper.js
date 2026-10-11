import * as AWS from 'aws-sdk';
/**
 * Pushes a payload message to an AWS Simple Queue Service (SQS) queue.
 * Resolves silently on success or rejects with an `AWSError` if the delivery fails.
 *
 * @param {SqsConfig} config The configuration object indicating the target SQS queue.
 * @param {any} message The body of the message to enqueue (must be serializable by AWS SDK).
 * @returns {Promise<void>} A promise indicating completion of the enqueue operation.
 * @throws {AWSError} If the network fails, IAM permissions are denied, or the queue doesn't exist.
 */
export const pushToAwsSQS = async (config, message) => {
    return new Promise((resolve, reject) => {
        const sqs = new AWS.SQS({ region: config.region });
        sqs.sendMessage({
            QueueUrl: config.endpoint + config.queueName,
            MessageBody: message,
        }, (error) => {
            if (error) {
                reject(error);
            }
            resolve();
        });
    });
};
//# sourceMappingURL=aws-sqs.helper.js.map