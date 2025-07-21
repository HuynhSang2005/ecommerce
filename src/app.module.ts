import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './routes/auth/auth.module';
import CustomZodValidationPipe from './shared/pipes/custom-zod-validation.pipes';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

@Module({
  imports: [SharedModule, AuthModule],
  providers: [
    {
      provide: 'APP_PIPE',
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
