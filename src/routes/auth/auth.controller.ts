import { Body, ClassSerializerInterceptor, ConflictException, Controller, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Post, SerializeOptions, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterBodyDto, RegisterResponseDto } from './DTO/auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResponseDto)
  async register(@Body() body: RegisterBodyDto) {
    return await this.authService.register(body);
  }

  // @Post('login')
  // async login(@Body() body: any) {
  //   return await this.authService.login(body);
  // }

  // @Post('logout')
  // async logout(@Body() body: any) {
  //   return await this.authService.logout(body);
  // }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: any) {
    return await this.authService.refreshToken(body);
  }

  
}
