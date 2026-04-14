import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
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
  async makeDecision(@Request() req, @Body() body: { problem: string }) {
    // O AuthGuard coloca os dados do utilizador dentro de req.user
    const userId = req.user.userId; 
    return this.decisionService.getDecision(userId, body.problem);
  }
}