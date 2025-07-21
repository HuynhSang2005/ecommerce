import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleName } from '../../shared/constants/role.constant'; 
import { PrismaService } from '../../shared/services/prisma.service'; 

@Injectable()
export class RoleService {
  private clientRolesId: number | null = null;

  constructor(private readonly prismaService: PrismaService) {}

  async getClientRoles(): Promise<number> {
    if (this.clientRolesId) {
      return this.clientRolesId;
    }

    try {
      const role = await this.prismaService.role.findFirst({
        where: {
          name: RoleName.Client,
        },
      });

      if (!role) {
        throw new NotFoundException(`Role ${RoleName.Client} not found. Please run init script first.`);
      }

      this.clientRolesId = role.id;
      return role.id;
      
    } catch (error) {
      console.error('❌ Error finding CLIENT role:', error);
      throw new NotFoundException(`Role ${RoleName.Client} not found. Please run init script first.`);
    }
  }
}