import { createZodDto } from 'nestjs-zod'
import { RegisterBodySchema, RegisterResponseSchema } from 'src/routes/auth/auth.model'

export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) {}
export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}
