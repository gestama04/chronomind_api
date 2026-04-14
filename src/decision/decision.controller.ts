import { Body, Controller, Post, UseGuards, Request, Get, UnauthorizedException } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { AuthGuard } from '../auth/auth.guard'; // Importa o guard que criámos antes

@Controller('decision')
export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  @UseGuards(AuthGuard) // 👈 Já tens aqui para o history, ótimo!
  @Get('history')
  async getHistory(@Request() req) {
    const userId = req.user.userId;
    return this.decisionService.getHistory(userId);
  }

  @UseGuards(AuthGuard) // 👈 ADICIONA ESTA LINHA AQUI! (Faltava no teu POST)
  @Post()
  async makeDecision(@Body() body: { problem: string }, @Request() req) {
    console.log('User no Request:', req.user); 

    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('Utilizador não identificado no Token');
    }

    return this.decisionService.getDecision(body.problem, req.user.userId);
  }
}