import { Body, Controller, Post, UseGuards, Request, Get, UnauthorizedException } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { AuthGuard } from '../auth/auth.guard'; // Importa o guard que criámos antes

@Controller('decision')
export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  @UseGuards(AuthGuard)
  @Get('history') // A rota será: GET /decision/history
  async getHistory(@Request() req) {
    const userId = req.user.userId;
    return this.decisionService.getHistory(userId);
  }
  @Post()
  async makeDecision(@Body() body: { problem: string }, @Request() req) {
    // Adiciona este log para vermos o que chega ao servidor nos logs do Render
    console.log('User no Request:', req.user); 

    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('Utilizador não identificado no Token');
    }

    return this.decisionService.getDecision(body.problem, req.user.userId);
  }
}