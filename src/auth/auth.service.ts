import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, pass: string) {
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) throw new ConflictException('Email já registado');

    const hashedPassword = await bcrypt.hash(pass, 10);

    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return {
      access_token: this.jwtService.sign({ userId: user.id, email: user.email }),
    };
  }

  // 👇 NOVA FUNÇÃO DE LOGIN ADICIONADA AQUI 👇
  async login(email: string, pass: string) {
    // 1. Procurar o utilizador na base de dados
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    // 2. Comparar a password enviada com a password encriptada guardada
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciais inválidas');

    // 3. Se estiver tudo certo, gerar e devolver um token de acesso
    return {
      access_token: this.jwtService.sign({ userId: user.id, email: user.email }),
    };
  }
}