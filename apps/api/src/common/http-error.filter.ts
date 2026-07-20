import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';

export type ErrorEnvelope = {
  code: string;
  message: string;
  fieldErrors: Record<string, string[]>;
  traceId: string;
  status: number;
};

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : undefined;
    const message = messageFromException(exceptionResponse, exception);
    response.status(status).json({
      code: codeFromStatus(status, message),
      message,
      fieldErrors: fieldErrorsFromException(exceptionResponse),
      traceId: traceIdFromRequest(request),
      status
    } satisfies ErrorEnvelope);
  }
}

function messageFromException(exceptionResponse: unknown, exception: unknown): string {
  if (exceptionResponse && typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
    const message = (exceptionResponse as { message?: unknown }).message;
    if (Array.isArray(message)) return message.join('; ');
    if (typeof message === 'string' && message.trim()) return message;
  }
  if (typeof exceptionResponse === 'string' && exceptionResponse.trim()) return exceptionResponse;
  if (exception instanceof Error && exception.message) return exception.message;
  return 'Internal server error.';
}

function fieldErrorsFromException(exceptionResponse: unknown): Record<string, string[]> {
  if (exceptionResponse && typeof exceptionResponse === 'object' && 'fieldErrors' in exceptionResponse) {
    const fieldErrors = (exceptionResponse as { fieldErrors?: unknown }).fieldErrors;
    if (fieldErrors && typeof fieldErrors === 'object' && !Array.isArray(fieldErrors)) return fieldErrors as Record<string, string[]>;
  }
  return {};
}

function traceIdFromRequest(request: Request): string {
  const requestId = request.headers['x-request-id'];
  if (Array.isArray(requestId)) return requestId[0] ?? randomUUID();
  return typeof requestId === 'string' && requestId.trim() ? requestId : randomUUID();
}

function codeFromStatus(status: number, message: string): string {
  if (status === HttpStatus.UNAUTHORIZED) return 'AUTHENTICATION_FAILED';
  if (status === HttpStatus.FORBIDDEN) return message === 'Authentication is required.' ? 'AUTHENTICATION_REQUIRED' : 'PERMISSION_DENIED';
  if (status === HttpStatus.CONFLICT) return 'RESOURCE_CONFLICT';
  if (status === HttpStatus.BAD_REQUEST) return 'VALIDATION_FAILED';
  if (status === HttpStatus.NOT_FOUND) return 'NOT_FOUND';
  return status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_FAILED';
}
