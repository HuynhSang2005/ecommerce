import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from '../../shared/services/hashing.service';
import { PrismaService } from '../../shared/services/prisma.service';
// import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { TokenService } from '../../shared/services/token.service';
import { AuthTokens } from '../../shared/types/jwt.type';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '../../shared/types/helper';
import { RoleService } from './role.service';
import { RegisterBodyType } from './auth.model';
import { AuthRepository } from './repo/auth.repo';


@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly roleService: RoleService, 
  ) {}

  // async generateToken(payload: { userId: number }): Promise<AuthTokens> {
  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.tokenService.signAccessToken(payload),
  //     this.tokenService.signRefreshToken(payload),
  //   ]);

  //   await this.prismaService.refreshToken.create({
  //     data: {
  //       token: refreshToken,
  //       userId: payload.userId,

  //     },
  //   });
    
  //   return { accessToken, refreshToken };
  // }
  
  // async refreshToken(refreshToken: string) {
  //   try {
  //     const {userId} = await this.tokenService.verifyRefreshToken(refreshToken);
  //     await this.prismaService.refreshToken.findUniqueOrThrow({
  //       where: {
  //         token: refreshToken,
  //       }
  //     })

  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       }
  //     });

  //     return await this.generateToken({ userId });
  //   } catch (error) {
  //     if(isNotFoundPrismaError(error)) {
  //       throw new UnauthorizedException('Refresh token không tồn tại hoặc đã hết hạn.');
  //     }
  //     throw new UnauthorizedException()
  //   }
  // }

async register(body: RegisterBodyType) {
  const hashedPassword = await this.hashingService.hash(body.password);

  try {
    const clientRoleId = await this.roleService.getClientRoles();
    
    // Remove confirmPassword before creating user
    const { confirmPassword, ...userData } = body;
    
    return await this.authRepository.createUser({
      ...userData,
      password: hashedPassword,
      roleId: clientRoleId,
    });
    
  } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes('email')) {
          throw new ConflictException(`Email '${body.email}' đã tồn tại.`);
        }
        throw new ConflictException('Thông tin đăng ký bị trùng lặp.');
      }
      
      console.error("Lỗi Prisma khi đăng ký:", error);
      throw error; 
    }
}

  // async login(body: LoginUserDto): Promise<AuthTokens> {
  //   const { email, password } = body;
  //   const user = await this.prismaService.user.findUnique({
  //     where: { email },
  //   });

  //   if (!user) {
  //     throw new NotFoundException('Tài khoản không tồn tại.');
  //   }

  //   if (!user.password) {
  //     throw new InternalServerErrorException('Tài khoản không hợp lệ.');
  //   }

  //   const isPasswordMatching = await this.hashingService.compare(password, user.password);

  //   if (!isPasswordMatching) {
  //     throw new UnauthorizedException('Mật khẩu không chính xác.');
  //   }

  //   return this.generateToken({ userId: user.id });
  // }

  // async logout(refreshToken: string) {
  //   try {
  //     // Xác thực refreshToken, nếu không hợp lệ sẽ throw
  //     await this.tokenService.verifyRefreshToken(refreshToken);
  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       }
  //     })
  //     return { message: 'Đăng xuất thành công.' };
  //   } catch (error) {
  //     if(isNotFoundPrismaError(error)) {
  //       throw new UnauthorizedException('Refresh token không tồn tại hoặc đã hết hạn.');
  //     }
  //     console.error('Lỗi khi logout:', error);
  //     throw new UnauthorizedException('Đăng xuất không thành công.');
  //   }
  // }


}