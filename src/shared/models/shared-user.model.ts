import { z } from "zod"
import { UserStatus as PrismaUserStatus } from '@prisma/client' 
export { UserStatus } from '@prisma/client'

// Base User Schema
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
  phoneNumber: z.string().min(9).max(15).nullable().optional(), 
  avatar: z.string().nullable().optional(),
  totpSecret: z.string().nullable().optional(),
  status: z.nativeEnum(PrismaUserStatus).default(PrismaUserStatus.ACTIVE), 
  roleId: z.number().positive(),
  createdById: z.number().nullable().optional(), 
  updatedById: z.number().nullable().optional(), 
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type UserType = z.infer<typeof UserSchema>
