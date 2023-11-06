import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
	success: true;
	statusCode: number;
	data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
		const statusCode = context.switchToHttp().getResponse().statusCode;
		return next.handle().pipe(
			map((data) => ({
				success: true,
				statusCode,
				data: data,
			})),
		);
	}
}
