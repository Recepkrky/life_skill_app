-- Supabase veritabanı şeması
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- Kullanıcı ilerleme tablosu
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- saniye cinsinden
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı istatistikleri tablosu
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_scenarios_completed INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0, -- saniye cinsinden
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Senaryo kategorileri tablosu
CREATE TABLE IF NOT EXISTS scenario_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#58CC02',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Senaryolar tablosu
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES scenario_categories(id),
  difficulty TEXT CHECK (difficulty IN ('Kolay', 'Orta', 'Zor')),
  max_score INTEGER DEFAULT 100,
  steps JSONB, -- Senaryo adımları JSON formatında
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı rozetleri tablosu
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) politikaları
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Senaryolar herkes tarafından görülebilir
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Scenarios are viewable by everyone" ON scenarios
  FOR SELECT USING (true);

-- Kategoriler herkes tarafından görülebilir
ALTER TABLE scenario_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON scenario_categories
  FOR SELECT USING (true);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_scenario_id ON user_progress(scenario_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at ON user_progress(completed_at);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- Otomatik updated_at güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'lar
CREATE TRIGGER update_user_progress_updated_at 
  BEFORE UPDATE ON user_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at 
  BEFORE UPDATE ON user_stats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenarios_updated_at 
  BEFORE UPDATE ON scenarios 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Örnek kategori verileri
INSERT INTO scenario_categories (name, description, color, icon) VALUES
  ('Günlük Yaşam', 'Günlük hayatta karşılaşılan durumlar', '#58CC02', 'Home'),
  ('İletişim', 'İnsanlarla etkili iletişim kurma', '#4ECDC4', 'MessageCircle'),
  ('Teknoloji', 'Teknoloji kullanımı ve dijital beceriler', '#FF6B35', 'Smartphone'),
  ('Eğitim', 'Öğrenme ve gelişim senaryoları', '#9B59B6', 'BookOpen'),
  ('İş Hayatı', 'İş ortamında karşılaşılan durumlar', '#3498DB', 'Briefcase'),
  ('Sosyal Medya', 'Sosyal medya kullanımı ve güvenlik', '#E74C3C', 'Share2'),
  ('Bankacılık', 'Banka işlemleri ve finansal beceriler', '#27AE60', 'CreditCard'),
  ('Spor', 'Spor ve sağlık ile ilgili senaryolar', '#F39C12', 'Activity'),
  ('Sanat', 'Sanat ve kültür ile ilgili senaryolar', '#E91E63', 'Palette'),
  ('Eğlence', 'Eğlence ve sosyal aktiviteler', '#FF9800', 'PartyPopper')
ON CONFLICT (name) DO NOTHING;

-- Örnek rozet verileri
CREATE TABLE IF NOT EXISTS badge_definitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  requirement_type TEXT CHECK (requirement_type IN ('scenarios_completed', 'streak_days', 'total_score', 'category_mastery')),
  requirement_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO badge_definitions (name, description, icon, color, requirement_type, requirement_value) VALUES
  ('İlk Adım', 'İlk senaryonu tamamladın!', 'Target', '#4A90E2', 'scenarios_completed', 1),
  ('Konuşkan', '10 diyalog tamamladın', 'MessageCircle', '#7ED321', 'scenarios_completed', 10),
  ('Sebatlı', '7 gün üst üste pratik yaptın', 'Calendar', '#F5A623', 'streak_days', 7),
  ('Uzman', 'Tüm zorluk seviyelerini denedin', 'Award', '#9013FE', 'scenarios_completed', 50),
  ('Hızlı Öğrenen', '1000 puan topladın', 'Zap', '#FFD93D', 'total_score', 1000),
  ('Teknoloji Ustası', 'Teknoloji kategorisinde 5 senaryo tamamladın', 'Smartphone', '#FF6B35', 'category_mastery', 5),
  ('Sosyal Kelebek', 'İletişim kategorisinde 10 senaryo tamamladın', 'Users', '#4ECDC4', 'category_mastery', 10),
  ('Finans Uzmanı', 'Bankacılık kategorisinde 3 senaryo tamamladın', 'CreditCard', '#27AE60', 'category_mastery', 3)
ON CONFLICT (name) DO NOTHING; 