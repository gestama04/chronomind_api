import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class DecisionService {
  private genAI: GoogleGenerativeAI;

  constructor(private prisma: PrismaService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async getDecision(userId: string, problem: string) {
    let aiResponseText = ""; // Criamos a variável fora para sobreviver a falhas

    try {
      // 1. Configurar a personalidade
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

      // 2. Pedir a decisão à IA (Com defesa contra a Google)
      try {
        const result = await model.generateContent(problem);
        aiResponseText = result.response.text().trim();
      } catch (iaError: any) {
        if (iaError.status === 503) {
          aiResponseText = "ATÉ A INTELIGÊNCIA ARTIFICIAL ESTÁ FARTA DE TI. VAI TRABALHAR.";
        } else {
          throw iaError; // Se for outro erro, passa para o catch de baixo
        }
      }

      // 3. Guardar no PostgreSQL
      const savedDecision = await this.prisma.decision.create({
        data: {
          userId: userId,
          problemText: problem,
          aiResponse: aiResponseText,
        },
      });

      return savedDecision;

    } catch (error: any) {
      console.error('Erro na IA ou Base de Dados:', error);
      
      // 4. Defesa contra o Token Fantasma (P2003)
      if (error.code === 'P2003') {
        // Finge que gravou e devolve a resposta para o telemóvel não encravar!
        return {
          id: 'temp-id',
          userId: userId,
          problemText: problem,
          aiResponse: aiResponseText || "Vai tratar da tua vida. Não tenhas desculpas.",
        };
      }

      throw new InternalServerErrorException('A IA falhou em tomar uma decisão.');
    }
  }

  async getHistory(userId: string) {
    return this.prisma.decision.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}