import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase konfigürasyonu - Bu değerleri kendi Supabase projenizden alacaksınız
const supabaseUrl = 'https://mjniworjzhhvxaccxjps.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbml3b3JqemhodnhhY2N4anBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzY2OTUsImV4cCI6MjA2OTIxMjY5NX0.dqhbKvjQPsAhJcYtGdvQ9C1-pv_H2dE_hvo3eeJ4NgU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Kullanıcı tipleri
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  scenario_id: string;
  completed: boolean;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_spent: number; // saniye cinsinden
  completed_at: string;
  created_at: string;
}

export interface ScenarioStepProgress {
  id: string;
  user_id: string;
  scenario_id: string;
  current_step_index: number;
  user_answers: {[key: string]: string};
  start_time: string;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_scenarios_completed: number;
  total_score: number;
  total_time_spent: number;
  current_streak: number;
  longest_streak: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

// Auth fonksiyonları
export const authService = {
  // Kayıt olma
  async signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    
    if (error) throw error;
    return data;
  },

  // Giriş yapma
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Çıkış yapma
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Mevcut kullanıcıyı alma
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Kullanıcı durumu değişikliklerini dinleme
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  },
};

// Kullanıcı ilerleme fonksiyonları
export const progressService = {
  // Senaryo adım ilerlemesini kaydetme
  async saveStepProgress(
    userId: string,
    scenarioId: string,
    currentStepIndex: number,
    userAnswers: {[key: string]: string}
  ) {
    const { data, error } = await supabase
      .from('scenario_step_progress')
      .upsert({
        user_id: userId,
        scenario_id: scenarioId,
        current_step_index: currentStepIndex,
        user_answers: userAnswers,
        last_activity: new Date().toISOString(),
      }, {
        onConflict: 'user_id,scenario_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Senaryo adım ilerlemesini alma
  async getStepProgress(userId: string, scenarioId: string) {
    const { data, error } = await supabase
      .from('scenario_step_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('scenario_id', scenarioId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  // Senaryo adım ilerlemesini silme (senaryo tamamlandığında)
  async deleteStepProgress(userId: string, scenarioId: string) {
    const { error } = await supabase
      .from('scenario_step_progress')
      .delete()
      .eq('user_id', userId)
      .eq('scenario_id', scenarioId);

    if (error) throw error;
  },

  // Senaryo tamamlama kaydetme
  async saveScenarioProgress(
    userId: string,
    scenarioId: string,
    score: number,
    correctAnswers: number,
    totalQuestions: number,
    timeSpent: number
  ) {
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        scenario_id: scenarioId,
        completed: true,
        score,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        time_spent: timeSpent,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Kullanıcının senaryo ilerlemesini alma
  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Belirli bir senaryonun tamamlanma durumunu kontrol etme
  async getScenarioProgress(userId: string, scenarioId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('scenario_id', scenarioId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  // Kullanıcı istatistiklerini güncelleme
  async updateUserStats(userId: string) {
    // Önce mevcut istatistikleri al
    const { data: existingStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Toplam istatistikleri hesapla
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    if (!progress) return;

    const totalScenariosCompleted = progress.length;
    const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.time_spent, 0);

    // Streak hesaplama (son 7 gün)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentProgress = progress.filter(p => 
      new Date(p.completed_at) >= last7Days
    );
    
    const currentStreak = recentProgress.length;

    const statsData = {
      user_id: userId,
      total_scenarios_completed: totalScenariosCompleted,
      total_score: totalScore,
      total_time_spent: totalTimeSpent,
      current_streak: currentStreak,
      longest_streak: Math.max(currentStreak, existingStats?.longest_streak || 0),
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingStats) {
      // Mevcut istatistikleri güncelle
      const { data, error } = await supabase
        .from('user_stats')
        .update(statsData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Yeni istatistik kaydı oluştur
      const { data, error } = await supabase
        .from('user_stats')
        .insert({
          ...statsData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Kullanıcı istatistiklerini alma
  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
};

// Analitik fonksiyonları
export const analyticsService = {
  // Kullanıcının en çok zorlandığı senaryoları alma
  async getUserWeaknesses(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .lt('score', 70) // %70'in altındaki skorlar
      .order('score', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Kullanıcının en iyi performans gösterdiği kategorileri alma
  async getUserStrengths(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        scenarios:scenario_id (
          category
        )
      `)
      .eq('user_id', userId)
      .gte('score', 80) // %80'in üstündeki skorlar
      .order('score', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Günlük aktivite raporu
  async getDailyActivity(userId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', startDate.toISOString())
      .order('completed_at', { ascending: true });

    if (error) throw error;
    return data;
  },
}; 