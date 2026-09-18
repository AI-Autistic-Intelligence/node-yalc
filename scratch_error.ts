import { HttpException } from './http.exception.js';
import { HttpStatus } from './http-status.enum.js';
import { ErrorsEnum } from './error.enum.js';
import { DefaultErrorBase, IDefaultErrorBaseOptions } from './default.error.js';
import { HttpStatusCode } from 'axios';

export interface HttpExceptionOptions {
  cause?: Error;
  description?: string;
}

export function createHttpException(status: number) {
  return class extends HttpException {
    constructor(objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions) {
      super(
        HttpException.createBody(objectOrError, typeof descriptionOrOptions === 'string' ? descriptionOrOptions : descriptionOrOptions?.description, status),
        status,
        typeof descriptionOrOptions !== 'string' ? descriptionOrOptions : undefined
      );
    }
  };
}

export class BadRequestException extends createHttpException(HttpStatus.B_AD_RE_QU_ES_T) {}
export class UnauthorizedException extends createHttpException(HttpStatus.U_NA_UT_HO_RI_ZE_D) {}
export class ForbiddenException extends createHttpException(HttpStatus.F_OR_BI_DD_EN) {}
export class NotFoundException extends createHttpException(HttpStatus.N_OT_FO_UN_D) {}
export class ConflictException extends createHttpException(HttpStatus.C_ON_FL_IC_T) {}
export class InternalServerErrorException extends createHttpException(HttpStatus.I_NT_ER_NA_LS_ER_VE_RE_RR_OR) {}
export class MethodNotAllowedException extends createHttpException(HttpStatus.M_ET_HO_DN_OT_AL_LO_WE_D) {}
export class NotAcceptableException extends createHttpException(HttpStatus.N_OT_AC_CE_PT_AB_LE) {}
export class GoneException extends createHttpException(HttpStatus.G_ON_E) {}
export class UnsupportedMediaTypeException extends createHttpException(HttpStatus.U_NS_UP_PO_RT_ED_ME_DI_AT_YP_E) {}
export class UnprocessableEntityException extends createHttpException(HttpStatus.U_NP_RO_CE_SS_AB_LE_EN_TI_TY) {}
export class NotImplementedException extends createHttpException(HttpStatus.N_OT_IM_PL_EM_EN_TE_D) {}
export class BadGatewayException extends createHttpException(HttpStatus.B_AD_GA_TE_WA_Y) {}
export class ServiceUnavailableException extends createHttpException(HttpStatus.S_ER_VI_CE_UN_AV_AI_LA_BL_E) {}
export class GatewayTimeoutException extends createHttpException(HttpStatus.G_AT_EW_AY_TI_ME_OU_T) {}
export class MisdirectedException extends createHttpException(HttpStatus.M_IS_DI_RE_CT_ED) {}
export class PayloadTooLargeException extends createHttpException(HttpStatus.P_AY_LO_AD_TO_OL_AR_GE) {}
export class PreconditionFailedException extends createHttpException(HttpStatus.P_RE_CO_ND_IT_IO_NF_AI_LE_D) {}
export class RequestTimeoutException extends createHttpException(HttpStatus.R_EQ_UE_ST_TI_ME_OU_T) {}

