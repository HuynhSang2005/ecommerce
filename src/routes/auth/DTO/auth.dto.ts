import { UserStatus } from '@prisma/client'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  avatar: z.string(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED]),
  roleId: z.number(),
  createById: z.string().nullable(),
  updatedById: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
})

const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
  phoneNumber: z.string().min(10).max(15),
}).strict().superRefine(({password, confirmPassword}, ctx) => {
  if(password !== confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords and confirm password do not match',
      path: ['confirmPassword'],
  })}

})

export class RegisterBodyDto extends createZodDto(RegisterSchema) {}

export class RegisterResponseDto extends createZodDto(userSchema) {}