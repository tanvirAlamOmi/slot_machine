import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  export interface Response<T> {
    statusCode: number;
    message: string;
    data: T;
  }
  
  @Injectable()
  export class ResponseInterceptor<T>
    implements NestInterceptor<T, Response<T>>
  {
    intercept(
      context: ExecutionContext,
      next: CallHandler
    ): Observable<Response<T>> {
      return next.handle().pipe(
        map(({message, ...rest}) => ({
          statusCode: context.switchToHttp().getResponse().statusCode,
          reqId: context.switchToHttp().getRequest().reqId,
          message: message || 'Operation successful',
          data: {...rest},
        }))
      );
    }
  }