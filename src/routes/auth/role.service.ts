import { Injectable } from '@nestjs/common';
import { RoleName } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class RoleService {
  private clientRolesId: number | null = null;

  constructor(private readonly prismaService: PrismaService) {}

  async getClientRoles() {
    if(this.clientRolesId) {
      return this.clientRolesId;
    }

    const role = await this.prismaService.role.findUniqueOrThrow({
      where: {
        name: RoleName.Client,
      },
    })

    this.clientRolesId = role.id;
    return role.id;
  }


}
