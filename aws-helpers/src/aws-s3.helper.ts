import * as aws from 'aws-sdk';

const URL_EXPIRATION_TIME = 60;

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
export const getFileFromS3 = async (
  filePath: string,
  bucket: string,
): Promise<string> => {
  const s3 = new aws.S3({
    region: process.env.S3_REGION,
  });
  return new Promise((resolve, reject): void => {
    s3.getSignedUrl(
      'getObject',
      {
        Key: filePath,
        Bucket: bucket,
        Expires: URL_EXPIRATION_TIME,
      },
      (err: Error, url: string): void => {
        if (err) {
          reject(err);
        }
        resolve(url);
      },
    );
  });
};
