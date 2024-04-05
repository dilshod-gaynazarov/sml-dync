import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { logger } from '../logger';
import * as J from 'fp-ts/Json';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from '../../../common/interface/HttpExceptionResponse';
import { ErrorStackParserFunction } from 'src/common/error/ErrorStackParser';
import { ErrorPrompt } from '../prompts/types';
import { SequelizeScopeError } from 'sequelize';
import { getPromptByCode } from '../prompts/errorPrompt';

export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorType: string;
    let errorMessage: string | string[];
    let responseMessage: string | string[];

    let stack: string[] = [];
    // :TODO ? remove console.log()
    const lang = req.headers['lang'];

    console.log('+--', exception, '---+');
    if (String(exception).includes('Cannot GET')) {
      return res.status(404).send((exception as HttpException).message);
    }

    stack = ErrorStackParserFunction(exception);

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const errorResponse: string | string[] | object = exception.getResponse();

      switch (status) {
        case HttpStatus.BAD_REQUEST:
          errorType = 'Bad Request';
          break;
        case HttpStatus.NOT_FOUND:
          errorType = 'Not Found!';
          break;
        case HttpStatus.UNAUTHORIZED:
          errorType = 'UnAuthorized!';
          break;
        case HttpStatus.CONFLICT:
          errorType = 'Conflict';
          break;
        case HttpStatus.UNPROCESSABLE_ENTITY:
          errorType = 'Not Valididate';
          // TODO extract method
          return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            statusCode: (errorResponse as any).statusCode,
            error: errorType,
            path: req.path,
            method: req.method,
            timeStamp: new Date(),
            correlationId: req.headers['x-correlation-id'] as unknown as string,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            message: errorResponse,
          });
        default:
          errorType = (errorResponse as HttpExceptionResponse).error;
      }

      errorMessage = errorResponse as string;
      responseMessage = errorMessage;
    } else if (exception instanceof SequelizeScopeError) {
      const foundErrorPrompt = getPromptByCode(
        'postgres',
        (exception as any).driverError?.code as string,
      );
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorType = 'Server Error';
      errorMessage = String(exception);
      responseMessage =
        foundErrorPrompt === null
          ? 'Internal Server Error'
          : JSON.stringify(foundErrorPrompt.value);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorType = 'Server Error';
      errorMessage = String(exception);
      responseMessage = 'Internal Server Error';
    }

    const parsedErrorPrompt = this.parseErrorPrompt(responseMessage);

    logger.error({
      error: errorType,
      message: errorMessage,
      ErrorPrompt: E.isLeft(parsedErrorPrompt) ? {} : parsedErrorPrompt.right,
      stack: stack,
    });

    // custom exception data
    const message = this.customiseErrorMsgByLang(
      E.isLeft(parsedErrorPrompt)
        ? ({} as ErrorPrompt)
        : parsedErrorPrompt.right,
      errorMessage,
      lang as string,
    );
    const errorResponse = this.getErrorResponse(
      status,
      errorType,
      message,
      req,
    );

    res.status(status).json(errorResponse);
  }

  getErrorResponse(
    status: HttpStatus,
    errorType: string,
    message: string,
    req: Request,
  ): CustomHttpExceptionResponse {
    return {
      statusCode: status,
      error: errorType,
      path: req.path,
      method: req.method,
      message, // TODO send message depends on language
      timeStamp: new Date(),
      correlationId: req.headers['x-correlation-id'] as unknown as string,
    };
  }

  parseErrorPrompt(
    message: string | string[],
  ): E.Left<string[]> | E.Right<ErrorPrompt> {
    if (Array.isArray(message)) {
      return E.left(message);
    }

    return pipe(
      message,
      J.parse,
      E.mapLeft((e: any) => e),
    ) as E.Right<ErrorPrompt>;
  }
  customiseErrorMsgByLang(
    ErrorPrompt: ErrorPrompt,
    errorMsg: string,
    lang: string = 'en',
  ) {
    let message = '';
    if (ErrorPrompt && ErrorPrompt.labels && ErrorPrompt.labels.length >= 3) {
      switch (lang) {
        case 'en':
          message = ErrorPrompt.labels[0];
          break;
        case 'ru':
          message = ErrorPrompt.labels[1];
          break;
        case 'uz':
          message = ErrorPrompt.labels[2];
          break;
        default:
          message = 'Internal Server error';
      }
    } else {
      switch (lang) {
        case 'en':
          message = errorMsg[0];
          break;
        case 'ru':
          message = errorMsg[1];
          break;
        case 'uz':
          message = errorMsg[2];
          break;
        default:
          message = 'Internal Server error';
      }
    }
    return message;
  }
}
