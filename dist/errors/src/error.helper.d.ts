import { ClassType } from '@node-yalc/types';
/**
 * Function to convert all HttpException based errors classes to their corresponding status code
 * using a predefined list of status codes
 */
export declare function getStatusCodeFromError(error: ClassType<any> | any): any;
