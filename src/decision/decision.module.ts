import { Module } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { DecisionController } from './decision.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 👈 Dá acesso à base de dados!
  controllers: [DecisionController],
  providers: [DecisionService],
})
export class DecisionModule {}