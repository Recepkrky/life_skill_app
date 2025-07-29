import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAICRfabtgEwdZnl0jR_SqMGu_R7UWANNA';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AIResponse {
  message: string;
  suggestions?: string[];
  feedback?: {
    score: number;
    improvement: string;
  };
}

export interface ScenarioContext {
  scenarioId: string;
  character: string;
  setting: string;
  userRole: string;
  objectives: string[];
}

export class AIService {
  private static instance: AIService;
  private model: any;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  private getSystemPrompt(context: ScenarioContext): string {
    return `Sen ${context.character} rolünde bir eğitim asistanısın. Özel bireylerin günlük yaşam becerilerini öğrenmesine yardımcı oluyorsun.

KARAKTER: ${context.character}
ORTAM: ${context.setting}
KULLANICI ROLÜ: ${context.userRole}
HEDEFLER: ${context.objectives.join(', ')}

KURALLAR:
1. Her zaman nazik, sabırlı ve destekleyici ol
2. Basit, anlaşılır dil kullan
3. Cümleler kısa ve net olsun
4. Kullanıcıyı cesaretlendir ve övgüde bulun
5. Hata yaptığında nazikçe düzelt
6. Gerçek hayattaki gibi doğal konuş
7. Kullanıcının seviyesine uygun yanıt ver
8. Pozitif geri bildirim ver
9. Gerektiğinde yönlendirici sorular sor
10. Senaryonun amacına odaklan

YANIT FORMATI:
- Doğal, günlük konuşma dili kullan
- Emoji kullanma
- Kısa ve öz cevaplar ver (maksimum 2-3 cümle)
- Kullanıcıyı bir sonraki adıma yönlendir

Şimdi ${context.character} olarak rol yap ve kullanıcıyla etkileşime geç.`;
  }

  async generateResponse(
    userMessage: string,
    context: ScenarioContext,
    conversationHistory: string[] = []
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.getSystemPrompt(context);
      const historyText = conversationHistory.length > 0 
        ? `\n\nÖnceki konuşma:\n${conversationHistory.join('\n')}`
        : '';
      
      const prompt = `${systemPrompt}${historyText}\n\nKullanıcı: ${userMessage}\n\n${context.character}:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const message = response.text();

      // Önerilen cevapları oluştur
      const suggestions = await this.generateSuggestions(context, message);

      return {
        message: message.trim(),
        suggestions,
      };
    } catch (error) {
      console.error('AI Response Error:', error);
      return {
        message: "Özür dilerim, şu anda size yardımcı olamıyorum. Lütfen tekrar deneyin.",
        suggestions: ["Tamam", "Tekrar dene", "Yardım"]
      };
    }
  }

  async generateSuggestions(context: ScenarioContext, aiMessage: string): Promise<string[]> {
    try {
      const prompt = `${context.character} şu mesajı verdi: "${aiMessage}"

Bu durumda kullanıcının verebileceği 3 uygun cevap önerisi sun. Cevaplar:
- Basit ve anlaşılır olmalı
- Senaryonun amacına uygun olmalı
- Farklı nezaket seviyelerinde olmalı

Sadece cevapları ver, açıklama yapma:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 3);
    } catch (error) {
      console.error('Suggestions Error:', error);
      return ["Teşekkür ederim", "Anlıyorum", "Tamam"];
    }
  }

  async evaluateUserResponse(
    userMessage: string,
    context: ScenarioContext,
    expectedBehavior: string
  ): Promise<{ score: number; feedback: string; suggestions: string[] }> {
    try {
      const prompt = `Kullanıcı "${userMessage}" dedi.
Senaryo: ${context.setting}
Beklenen davranış: ${expectedBehavior}

Bu cevabı 1-10 arasında değerlendir ve kısa geri bildirim ver:
- Nezaket seviyesi
- Uygunluk
- İletişim becerisi

Format:
Puan: X
Geri bildirim: [kısa pozitif geri bildirim]`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const scoreMatch = text.match(/Puan:\s*(\d+)/);
      const feedbackMatch = text.match(/Geri bildirim:\s*(.+)/);
      
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;
      const feedback = feedbackMatch ? feedbackMatch[1] : "İyi bir cevap!";

      return {
        score,
        feedback,
        suggestions: ["Devam et", "Başka soru sor", "Teşekkür et"]
      };
    } catch (error) {
      console.error('Evaluation Error:', error);
      return {
        score: 7,
        feedback: "İyi bir cevap! Devam et.",
        suggestions: ["Devam et", "Başka soru sor", "Teşekkür et"]
      };
    }
  }

  async getGeneralHelp(question: string): Promise<string> {
    try {
      const prompt = `Sen özel bireylere günlük yaşam becerileri öğreten yardımcı bir asistansın.

Soru: ${question}

Kısa, anlaşılır ve yardımcı bir cevap ver. Basit dil kullan ve pozitif ol.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('General Help Error:', error);
      return "Size yardımcı olmaya çalışıyorum. Sorunuzu daha basit şekilde sorabilir misiniz?";
    }
  }
}

export const aiService = AIService.getInstance();