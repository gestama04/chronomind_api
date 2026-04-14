import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 👈 ESTA É A LINHA MÁGICA! Permite que outros módulos o usem.
})
export class PrismaModule {}