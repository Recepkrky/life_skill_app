import { GoogleGenerativeAI } from '@google/generative-ai';
import { progressService } from './supabase';

// Gemini API konfigürasyonu - Environment variable kullan
// YENİ API KEY BURAYA: https://makersuite.google.com/app/apikey adresinden alın
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'AIzaSyDyI7NQuwG9bbzJaQ0vG5v4bherYir3TWc';
const genAI = new GoogleGenerativeAI(API_KEY);

// API key test fonksiyonu
const testAPIKey = async () => {
  try {
    // API Key test ediliyor
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Merhaba");
    const response = await result.response;
    // API Key çalışıyor
    return true;
  } catch (error) {
    console.error('API Key hatası:', error);
    return false;
  }
};

// AI analiz fonksiyonları
export const aiService = {
  // API key test fonksiyonu
  async testAPI() {
    return await testAPIKey();
  },

  // Kullanıcının ilerlemesini analiz et
  async analyzeUserProgress(userId: string) {
    try {
      const stats = await progressService.getUserStats(userId);
      const progress = await progressService.getUserProgress(userId);
      
      if (!stats || !progress) {
        return {
          analysis: 'Henüz yeterli veri yok. Daha fazla senaryo tamamladıktan sonra detaylı analiz yapabilirim.',
          recommendations: ['İlk senaryonu tamamlamaya başla', 'Günlük pratik yap', 'Farklı kategorileri dene'],
          strengths: [],
          weaknesses: [],
          nextSteps: ['Kolay seviyeden başla', 'Günde en az 1 senaryo tamamla']
        };
      }

      // Başarı oranı hesapla
      const successRate = stats.total_scenarios_completed > 0 
        ? Math.round((stats.total_score / (stats.total_scenarios_completed * 100)) * 100) 
        : 0;

      // Kategori analizi
      const categoryAnalysis = this.analyzeCategories(progress);
      
      // Zorluk seviyesi analizi
      const difficultyAnalysis = this.analyzeDifficultyLevels(progress);
      
      // Zaman analizi
      const timeAnalysis = this.analyzeTimeSpent(progress);

      // Güçlü yanlar
      const strengths = this.identifyStrengths(stats, successRate, categoryAnalysis);
      
      // Gelişim alanları
      const weaknesses = this.identifyWeaknesses(stats, successRate, categoryAnalysis);
      
      // Öneriler
      const recommendations = this.generateRecommendations(stats, weaknesses, categoryAnalysis);
      
      // Sonraki adımlar
      const nextSteps = this.generateNextSteps(stats, weaknesses, categoryAnalysis);

      return {
        analysis: this.generateAnalysisText(stats, successRate, categoryAnalysis, difficultyAnalysis, timeAnalysis),
        recommendations,
        strengths,
        weaknesses,
        nextSteps
      };
    } catch (error) {
      console.error('AI analiz hatası:', error);
      return {
        analysis: 'Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        recommendations: ['Uygulamayı yeniden başlat', 'İnternet bağlantını kontrol et'],
        strengths: [],
        weaknesses: [],
        nextSteps: []
      };
    }
  },

  // Kategori analizi
  analyzeCategories(progress: any[]) {
    const categories: { [key: string]: { completed: number; totalScore: number; avgScore: number } } = {};
    progress.forEach(p => {
      if (!categories[p.scenario_id]) {
        categories[p.scenario_id] = {
          completed: 0,
          totalScore: 0,
          avgScore: 0
        };
      }
      categories[p.scenario_id].completed++;
      categories[p.scenario_id].totalScore += p.score;
    });

    // Ortalama skorları hesapla
    Object.keys(categories).forEach(category => {
      categories[category].avgScore = Math.round(
        categories[category].totalScore / categories[category].completed
      );
    });

    return categories;
  },

  // Zorluk seviyesi analizi
  analyzeDifficultyLevels(progress: any[]) {
    const difficulties: { [key: string]: number } = { kolay: 0, orta: 0, zor: 0 };
    const scores: { [key: string]: number[] } = { kolay: [], orta: [], zor: [] };

    progress.forEach(p => {
      // Senaryo zorluğunu belirle (bu kısım senaryo verilerine göre geliştirilebilir)
      const difficulty = this.getScenarioDifficulty(p.scenario_id);
      difficulties[difficulty]++;
      scores[difficulty].push(p.score);
    });

    return { difficulties, scores };
  },

  // Zaman analizi
  analyzeTimeSpent(progress: any[]) {
    const totalTime = progress.reduce((sum, p) => sum + p.time_spent, 0);
    const avgTime = progress.length > 0 ? totalTime / progress.length : 0;
    
    return {
      totalTime,
      avgTime,
      totalSessions: progress.length
    };
  },

  // Güçlü yanları belirle
  identifyStrengths(stats: any, successRate: number, categoryAnalysis: any) {
    const strengths = [];
    
    if (successRate >= 80) {
      strengths.push('Yüksek başarı oranı');
    }
    
    if (stats.current_streak >= 3) {
      strengths.push('Tutarlı çalışma alışkanlığı');
    }
    
    if (stats.total_scenarios_completed >= 10) {
      strengths.push('Deneyimli kullanıcı');
    }

    // En iyi kategori
    const bestCategory = this.findBestCategory(categoryAnalysis);
    if (bestCategory) {
      strengths.push(`${bestCategory} kategorisinde güçlü`);
    }

    return strengths;
  },

  // Gelişim alanlarını belirle
  identifyWeaknesses(stats: any, successRate: number, categoryAnalysis: any) {
    const weaknesses = [];
    
    if (successRate < 60) {
      weaknesses.push('Başarı oranını artırma ihtiyacı');
    }
    
    if (stats.current_streak < 2) {
      weaknesses.push('Düzenli çalışma alışkanlığı geliştirme');
    }
    
    if (stats.total_scenarios_completed < 5) {
      weaknesses.push('Daha fazla deneyim kazanma');
    }

    // En zayıf kategori
    const worstCategory = this.findWorstCategory(categoryAnalysis);
    if (worstCategory) {
      weaknesses.push(`${worstCategory} kategorisinde gelişim alanı`);
    }

    return weaknesses;
  },

  // Öneriler oluştur
  generateRecommendations(stats: any, weaknesses: string[], categoryAnalysis: any) {
    const recommendations = [];
    
    if (weaknesses.includes('Başarı oranını artırma ihtiyacı')) {
      recommendations.push('Daha fazla dikkatle senaryoları tamamla');
      recommendations.push('Yanlış yaptığın soruları tekrar gözden geçir');
    }
    
    if (weaknesses.includes('Düzenli çalışma alışkanlığı geliştirme')) {
      recommendations.push('Günde en az 1 senaryo tamamlamaya çalış');
      recommendations.push('Hatırlatıcılar kur');
    }
    
    if (weaknesses.includes('Daha fazla deneyim kazanma')) {
      recommendations.push('Farklı kategorilerdeki senaryoları dene');
      recommendations.push('Zorluk seviyesini kademeli olarak artır');
    }

    return recommendations;
  },

  // Sonraki adımlar oluştur
  generateNextSteps(stats: any, weaknesses: string[], categoryAnalysis: any) {
    const nextSteps = [];
    
    if (stats.total_scenarios_completed < 5) {
      nextSteps.push('Kolay seviyeden başla');
      nextSteps.push('Günde 1 senaryo tamamla');
    } else if (stats.total_scenarios_completed < 10) {
      nextSteps.push('Orta seviyeye geç');
      nextSteps.push('Farklı kategorileri dene');
    } else {
      nextSteps.push('Zor seviyeleri dene');
      nextSteps.push('Eksik kategorileri tamamla');
    }

    return nextSteps;
  },

  // Analiz metni oluştur
  generateAnalysisText(stats: any, successRate: number, categoryAnalysis: any, difficultyAnalysis: any, timeAnalysis: any) {
    let analysis = `📊 İlerleme Analizin:\n\n`;
    
    analysis += `✅ Tamamlanan Senaryo: ${stats.total_scenarios_completed}\n`;
    analysis += `🎯 Başarı Oranı: %${successRate}\n`;
    analysis += `⏱️ Toplam Süre: ${Math.floor(timeAnalysis.totalTime / 60)} dk\n`;
    analysis += `🏆 Toplam Puan: ${stats.total_score}\n`;
    analysis += `🔥 Mevcut Seri: ${stats.current_streak} gün\n\n`;

    if (successRate >= 80) {
      analysis += `🌟 Mükemmel! Çok yüksek bir başarı oranın var. Sen gerçekten harika gidiyorsun!\n\n`;
    } else if (successRate >= 60) {
      analysis += `👍 İyi gidiyorsun! Başarı oranını biraz daha artırabilirsin.\n\n`;
    } else {
      analysis += `💪 Başarı oranını artırmak için daha fazla pratik yapmalısın.\n\n`;
    }

    if (stats.current_streak >= 3) {
      analysis += `🔥 Harika! ${stats.current_streak} günlük serin var. Bu tutarlılığı koru!\n\n`;
    } else {
      analysis += `📅 Düzenli çalışma alışkanlığı geliştirmeye odaklan.\n\n`;
    }

    return analysis;
  },

  // En iyi kategoriyi bul
  findBestCategory(categoryAnalysis: any) {
    let bestCategory = null;
    let bestScore = 0;

    Object.keys(categoryAnalysis).forEach(category => {
      if (categoryAnalysis[category].avgScore > bestScore) {
        bestScore = categoryAnalysis[category].avgScore;
        bestCategory = category;
      }
    });

    return bestCategory;
  },

  // En zayıf kategoriyi bul
  findWorstCategory(categoryAnalysis: any) {
    let worstCategory = null;
    let worstScore = 100;

    Object.keys(categoryAnalysis).forEach(category => {
      if (categoryAnalysis[category].avgScore < worstScore) {
        worstScore = categoryAnalysis[category].avgScore;
        worstCategory = category;
      }
    });

    return worstCategory;
  },

  // Senaryo zorluğunu belirle
  getScenarioDifficulty(scenarioId: string) {
    // Bu kısım senaryo verilerine göre geliştirilebilir
    const easyScenarios = ['market-simple', 'bus-simple'];
    const mediumScenarios = ['doctor-visit', 'online-shopping'];
    const hardScenarios = ['emergency-call', 'job-interview'];

    if (easyScenarios.includes(scenarioId)) return 'kolay';
    if (mediumScenarios.includes(scenarioId)) return 'orta';
    if (hardScenarios.includes(scenarioId)) return 'zor';
    
    return 'orta'; // varsayılan
  },

  // Gemini AI ile gerçek AI yanıtı al
  async generateResponse(userMessage: string, userId: string) {
    // AI generateResponse çağrıldı
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Kullanıcı verilerini al
      let userContext = '';
      try {
        const stats = await progressService.getUserStats(userId);
        if (stats) {
          userContext = `
Kullanıcı Bilgileri:
- Tamamlanan Senaryo: ${stats.total_scenarios_completed}
- Toplam Puan: ${stats.total_score}
- Günlük Seri: ${stats.current_streak}
- Başarı Oranı: %${Math.round((stats.total_score / (stats.total_scenarios_completed * 100)) * 100) || 0}
`;
        }
      } catch (error) {
        // Kullanıcı verileri alınamadı
      }

      const prompt = `Sen özel bireylere günlük yaşam becerileri öğreten yardımcı bir AI asistanısın. 

${userContext}

Kullanıcı: ${userMessage}

Senin görevin:
1. Nazik, sabırlı ve destekleyici ol
2. Basit, anlaşılır Türkçe kullan
3. Emoji kullan (günde 2-3 tane)
4. Kullanıcının seviyesine uygun yanıt ver
5. Motivasyon sağla
6. Günlük yaşam becerileri hakkında yardım et
7. Senaryo önerileri sun
8. İlerleme analizi yap

Yanıtını Türkçe olarak ver:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Gemini yanıtı alındı

      return {
        type: 'ai_response',
        content: text.trim()
      };

    } catch (error) {
      console.error('Gemini API hatası:', error);
      
      // Fallback: Basit kurallar
      const message = userMessage.toLowerCase();
      
      if (message.includes('ilerleme') || message.includes('analiz') || message.includes('durum')) {
        const analysis = await this.analyzeUserProgress(userId);
        return {
          type: 'analysis',
          content: analysis.analysis,
          data: analysis
        };
      }

      if (message.includes('motivasyon') || message.includes('cesaret') || message.includes('yorgun')) {
        return {
          type: 'motivation',
          content: '💪 Her gün küçük adımlar atarak büyük değişiklikler yaratabilirsin! Sen güçlüsün ve her zorluğun üstesinden gelebilirsin.'
        };
      }

      return {
        type: 'chat',
        content: 'Merhaba! 👋 Size nasıl yardımcı olabilirim? Senaryolarınız hakkında soru sorabilir, ilerleme analizi isteyebilir veya motivasyon desteği alabilirsiniz.'
      };
    }
  }
};