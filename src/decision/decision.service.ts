import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class DecisionService {
  private genAI: GoogleGenerativeAI;

  constructor(private prisma: PrismaService) {
    // Inicializamos a IA com a chave que colocaste no .env
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async getDecision(userId: string, problem: string) {
    try {
      // 1. Configurar a personalidade da IA (O Segredo do teu Produto)
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: `You are 'Ruthless', an uncompromising AI decision maker. 
        The user will give you Option A and Option B. They are overthinking. 
        YOUR RULES:
        1. If one option is productive and the other is lazy, order them to do the productive one and brutally smash the lazy excuse.
        2. If both options are productive/good, choose one arbitrarily but logically. Tell them to stop wasting time overthinking and just execute.
        3. Give ONE direct command. Do NOT list pros and cons.
        4. Maximum 2 sentences.
        5. Reply in Portuguese (PT-PT).`,
      });

      // 2. Pedir a decisão à IA
      const result = await model.generateContent(problem);
      const aiResponse = result.response.text().trim();

      // 3. Guardar no PostgreSQL (para o utilizador ter o histórico)
      const savedDecision = await this.prisma.decision.create({
        data: {
          userId: userId,
          problemText: problem,
          aiResponse: aiResponse,
        },
      });

      // 4. Devolver ao Frontend
      return savedDecision;

    } catch (error) {
      console.error('Erro na IA:', error);
      throw new InternalServerErrorException('A IA falhou em tomar uma decisão.');
    }
    
  }
  // Adiciona isto por baixo do método getDecision
  async getHistory(userId: string) {
    return this.prisma.decision.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }, // As mais recentes aparecem primeiro
    });
  }
}