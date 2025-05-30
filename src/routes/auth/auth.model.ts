import { z } from 'zod'
import { UserStatus as PrismaUserStatus, UserStatus } from '@prisma/client' 

export { UserStatus } from '@prisma/client' // sử enum từ prisma để đảm bảo consistency

// Base User Schema
const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
  phoneNumber: z.string().min(9).max(15).nullable().optional(), 
  avatar: z.string().nullable().optional(),
  totpSecret: z.string().nullable().optional(),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE), 
  roleId: z.number().positive(),
  createdById: z.number().nullable().optional(), 
  updatedById: z.number().nullable().optional(), 
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type UserType = z.infer<typeof UserSchema>

// Register Request Schema
export const RegisterBodySchema = UserSchema
  .pick({
    email: true,
    name: true,
    password: true,
    phoneNumber: true,
  })
  .extend({
    phoneNumber: z.string().min(9).max(15).optional(),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

// Register Response Schema - với proper types
export const RegisterResponseSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  // Transform dates thành strings
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
})

export type RegisterResponseType = z.infer<typeof RegisterResponseSchema>

// User Public Schema - cho các API khác cần trả về user info
export const UserPublicSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export type UserPublicType = z.infer<typeof UserPublicSchema>

// User Update Schema - cho update profile
export const UserUpdateSchema = UserSchema
  .pick({
    name: true,
    phoneNumber: true,
    avatar: true,
  })
  .partial() 

export type UserUpdateType = z.infer<typeof UserUpdateSchema>

// Login Request Schema
export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
})

export type LoginBodyType = z.infer<typeof LoginBodySchema>

// Login Response Schema
export const LoginResponseSchema = z.object({
  user: UserPublicSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type LoginResponseType = z.infer<typeof LoginResponseSchema>