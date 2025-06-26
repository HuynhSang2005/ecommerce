import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/services/prisma.service';
import {
  RegisterBodyType,
  RegisterResponseType,
  VerificationCodeType,
} from '../auth.model';
import { UserStatus, UserType } from 'src/shared/models/shared-user.model';
import { TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    userData: Omit<RegisterBodyType, 'confirmPassword'> & Pick<UserType, 'roleId'>,
  ): Promise<RegisterResponseType> {
    const user = await this.prismaService.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        avatar: true,
        status: true,
        roleId: true,
        createdById: true,
        updatedById: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        // Exclude sensitive fields
        password: false,
        totpSecret: false,
      },
    });

    // Transform dates to strings 
    const result = {
      ...user,
      status: user.status as UserStatus,
      roleId: user.roleId!,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
      deletedAt: user.deletedAt?.toISOString() ?? null,
    };

    // validate result trước khi return để catch lỗi sớm
    if (!result.id || !result.email || !result.roleId) {
      throw new Error('Invalid user data created');
    }

    return result;
  }

  async createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email: payload.email,
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      }
    });
  }

  async findUniqueVerificationCode(uniqueVale: {email: string} | {id: number} | {
    email: string; 
    code: string;
    type: TypeOfVerificationCodeType;
  }): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: uniqueVale,
    })
  }

}