import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('ERRO GUARD: Token não encontrado no header');
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'minha_chave_super_secreta_ruthless',
      });
      
      // LOG DE EMERGÊNCIA: Vamos ver se o payload tem mesmo o userId
      console.log('GUARD PAYLOAD:', payload);

      // Usamos a atribuição direta no objeto request
      request.user = payload; 
      
    } catch (e: any) {
      console.log('ERRO GUARD: Falha ao verificar token:', e.message);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}