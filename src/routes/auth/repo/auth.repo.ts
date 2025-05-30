import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/services/prisma.service';
import {
  RegisterBodyType,
  UserType,
  RegisterResponseType,
  UserStatus,
} from '../auth.model';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async createUser(
    userData: Omit<RegisterBodyType, 'confirmPassword'> &
      Pick<UserType, 'roleId'>,
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

    // Transform dates to strings và cast status type
    return {
      ...user,
      status: user.status as UserStatus,
      roleId: user.roleId!, 
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
      deletedAt: user.deletedAt?.toISOString() ?? null,
    }
  }
}
