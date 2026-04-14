import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importação do módulo
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule, // 👈 O AuthModule agora tem acesso ao PrismaService!
    JwtModule.register({
      global: true,
      secret: 'minha_chave_super_secreta_ruthless',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}