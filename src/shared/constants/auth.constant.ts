import { VerificationCodeType } from "@prisma/client"

export const REQUEST_USER_KEY = 'user' 

export const AuthType = {
  Bear: 'Bearer',
  None: 'None',
  APIKey: 'ApiKey',
} as const 

export type AuthType = (typeof AuthType)[keyof typeof AuthType]

export const ConditionGuard = {
  And: 'and',
  Or: 'or',
} as const

export type ConditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard]

export type TypeOfVerificationCodeType = (typeof VerificationCodeType)[keyof typeof VerificationCodeType] 