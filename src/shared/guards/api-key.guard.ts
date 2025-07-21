
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../services/token.service';


@Injectable()
export class APIKeyGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const xAPIKey = request.headers['x-api-key']; 
    
    if (xAPIKey !== process.env.SECRET_API_KEY) {
      throw new UnauthorizedException('API key is missing or invalid');
    }
    try {
    
      // Nếu true thì xem như là đã bypass guard
      return true;
    } catch {
      throw new UnauthorizedException('API key is invalid');
    }
  }
}
