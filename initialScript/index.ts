import envConfig from 'src/shared/config';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { RoleName } from 'src/shared/constants/role.constant';

const prisma = new PrismaService();
const hashingService = new HashingService();


const main = async () => {
  const roleCount = await prisma.role.count();
  if (roleCount > 0) {
    throw new Error('Roles already exist');
  }

  const roles = await prisma.role.createMany({
    data: [
      {
        name: RoleName.Admin,
        description: 'Administrator role with all permissions',
      },
      {
        name: RoleName.Seller,
        description: 'Seller role with limited permissions',
      },
      {
        name: RoleName.Client,
        description: 'Client role with basic permissions',
      },
    ],
  });

  const adminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin,
    },
  });

    const hashedPassword = await hashingService.hash(envConfig.ADMIN_PASSWORD);

  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      password: hashedPassword,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
      roleId: adminRole.id,
    },
  });
  
  return {
    createRouteCount: roles.count,
    adminUser,
  }
};

main().then(({ adminUser, createRouteCount }) => {
  console.log(`Created ${createRouteCount} roles`);
  console.log(`Admin user created: ${adminUser.email}`);
}).catch(console.error)