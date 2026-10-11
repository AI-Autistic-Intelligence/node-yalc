/**
 * Generates a presigned URL for an object stored in AWS S3.
 * Presigned URLs allow temporary, secure access to private S3 objects without exposing credentials.
 * The URL automatically expires after 60 seconds (URL_EXPIRATION_TIME) to minimize security risks.
 *
 * @param {string} filePath The specific key/path of the object within the S3 bucket.
 * @param {string} bucket The target S3 bucket name.
 * @returns {Promise<string>} A promise that resolves to the temporary presigned URL string.
 * @throws {Error} If AWS SDK fails to generate the URL (e.g. invalid credentials or region).
 */
export declare const getFileFromS3: (filePath: string, bucket: string) => Promise<string>;
