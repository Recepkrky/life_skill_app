import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bot, 
  MessageCircle, 
  Brain, 
  TrendingUp, 
  Target,
  Award,
  Star,
  Sparkles,
  ChevronRight,
  Play
} from 'lucide-react-native';
import AIAssistant from '../../components/AIAssistant';
import { useAuth } from '../../contexts/AuthContext';
import { progressService } from '../../utils/supabase';

const { width } = Dimensions.get('window');

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    loadUserStats();
    startAnimations();
  }, []);

  const loadUserStats = async () => {
    if (user) {
      try {
        const stats = await progressService.getUserStats(user.id);
        setUserStats(stats);
      } catch (error) {
        console.error('Kullanıcı istatistikleri yüklenemedi:', error);
      }
    }
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getMotivationalMessage = () => {
    if (!userStats) return 'Senaryoları tamamlayarak becerilerini geliştir! 💪';
    
    const completed = userStats.total_scenarios_completed;
    if (completed === 0) return 'İlk senaryonu tamamlamaya hazır mısın? 🚀';
    if (completed < 5) return 'Harika başlangıç! Devam et! 🌟';
    if (completed < 10) return 'Çok iyi gidiyorsun! Sen güçlüsün! 💪';
    return 'Muhteşem ilerleme! Sen bir kahramansın! 🏆';
  };

  const getSuccessRate = () => {
    if (!userStats || userStats.total_scenarios_completed === 0) return 0;
    return Math.round((userStats.total_score / (userStats.total_scenarios_completed * 100)) * 100);
  };

  const getProgressAnalysis = async () => {
    try {
      const analysis = { analysis: 'Analiz şu anda kullanılamıyor.' };
      alert(analysis.analysis);
    } catch (error) {
      console.error('İlerleme analizi hatası:', error);
      alert('Analiz sırasında bir hata oluştu.');
    }
  };

  const getPersonalRecommendations = async () => {
    try {
      const analysis = { 
        recommendations: ['Uygulamayı yeniden başlatın'],
        nextSteps: ['Daha fazla senaryo tamamlayın']
      };
      
      let recommendationsText = '💡 **Kişisel Önerileriniz:**\n\n';
      
      if (analysis.recommendations && analysis.recommendations.length > 0) {
        analysis.recommendations.forEach((rec: string, index: number) => {
          recommendationsText += `${index + 1}. ${rec}\n`;
        });
      }
      
      if (analysis.nextSteps && analysis.nextSteps.length > 0) {
        recommendationsText += '\n🎯 **Sonraki Adımlar:**\n';
        analysis.nextSteps.forEach((step: string, index: number) => {
          recommendationsText += `${index + 1}. ${step}\n`;
        });
      }
      
      alert(recommendationsText);
    } catch (error) {
      console.error('Öneriler hatası:', error);
      alert('Öneriler alınırken bir hata oluştu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E293B', '#334155', '#475569']}
        style={styles.container}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.headerContent}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.headerIcon}
              >
                <Bot size={32} color="#FFFFFF" />
                <Sparkles size={16} color="#FFFFFF" style={styles.sparkle} />
              </LinearGradient>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>AI Asistan</Text>
                <Text style={styles.headerSubtitle}>
                  Kişisel gelişim koçunuz
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* User Stats Overview */}
          {userStats && (
            <Animated.View 
              style={[
                styles.statsSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Text style={styles.sectionTitle}>Senin İlerlemen</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.statGradient}
                  >
                    <Target size={24} color="#FFFFFF" />
                    <Text style={styles.statNumber}>{userStats.total_scenarios_completed}</Text>
                    <Text style={styles.statLabel}>Tamamlanan</Text>
                  </LinearGradient>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.statGradient}
                  >
                    <TrendingUp size={24} color="#FFFFFF" />
                    <Text style={styles.statNumber}>%{getSuccessRate()}</Text>
                    <Text style={styles.statLabel}>Başarı</Text>
                  </LinearGradient>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.statGradient}
                  >
                    <Award size={24} color="#FFFFFF" />
                    <Text style={styles.statNumber}>{userStats.total_score}</Text>
                    <Text style={styles.statLabel}>Puan</Text>
                  </LinearGradient>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    style={styles.statGradient}
                  >
                    <Star size={24} color="#FFFFFF" />
                    <Text style={styles.statNumber}>{userStats.current_streak}</Text>
                    <Text style={styles.statLabel}>Seri</Text>
                  </LinearGradient>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Main Content */}
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Welcome Card */}
            <View style={styles.introSection}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.introCard}
              >
                <View style={styles.introHeader}>
                  <Bot size={48} color="#FFFFFF" />
                  <Sparkles size={20} color="#FFFFFF" style={styles.introSparkle} />
                </View>
                <Text style={styles.introTitle}>
                  Merhaba! Ben senin AI asistanınım 🤖
                </Text>
                <Text style={styles.introText}>
                  {getMotivationalMessage()}
                </Text>
                <Text style={styles.introSubtext}>
                  Senaryolarındaki ilerlemeni analiz edebilir, öneriler sunabilir ve sorularını yanıtlayabilirim.
                </Text>
              </LinearGradient>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Size Nasıl Yardımcı Olabilirim?</Text>
              
              <View style={styles.featuresGrid}>
                <TouchableOpacity 
                  style={styles.featureCard}
                  onPress={getProgressAnalysis}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.featureGradient}
                  >
                    <TrendingUp size={32} color="#FFFFFF" />
                    <Text style={styles.featureTitle}>İlerleme Analizi</Text>
                    <Text style={styles.featureText}>
                      Senaryolarındaki performansını detaylı olarak analiz ederim
                    </Text>
                    <View style={styles.featureAction}>
                      <Text style={styles.featureActionText}>Analiz Et</Text>
                      <ChevronRight size={16} color="#FFFFFF" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.featureCard}
                  onPress={getPersonalRecommendations}
                >
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.featureGradient}
                  >
                    <Brain size={32} color="#FFFFFF" />
                    <Text style={styles.featureTitle}>Kişisel Öneriler</Text>
                    <Text style={styles.featureText}>
                      Senin seviyene uygun senaryolar ve stratejiler öneririm
                    </Text>
                    <View style={styles.featureAction}>
                      <Text style={styles.featureActionText}>Öneri Al</Text>
                      <ChevronRight size={16} color="#FFFFFF" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.featureCard}
                  onPress={() => setShowAIAssistant(true)}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.featureGradient}
                  >
                    <MessageCircle size={32} color="#FFFFFF" />
                    <Text style={styles.featureTitle}>Sohbet Desteği</Text>
                    <Text style={styles.featureText}>
                      Sorularını yanıtlar ve motivasyon desteği sağlarım
                    </Text>
                    <View style={styles.featureAction}>
                      <Text style={styles.featureActionText}>Sohbet Et</Text>
                      <ChevronRight size={16} color="#FFFFFF" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
              
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={getProgressAnalysis}
                >
                  <LinearGradient
                    colors={['#06B6D4', '#0891B2']}
                    style={styles.quickActionGradient}
                  >
                    <Play size={24} color="#FFFFFF" />
                    <Text style={styles.quickActionText}>Hemen Başla</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.quickActionCard}
                  onPress={getPersonalRecommendations}
                >
                  <LinearGradient
                    colors={['#EC4899', '#DB2777']}
                    style={styles.quickActionGradient}
                  >
                    <MessageCircle size={24} color="#FFFFFF" />
                    <Text style={styles.quickActionText}>Soru Sor</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Start Chat Button */}
            <View style={styles.buttonSection}>
              <TouchableOpacity
                onPress={() => {
                  console.log('Ana AI asistan butonu tıklandı');
                  setShowAIAssistant(true);
                }}
                style={styles.chatButton}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.chatButtonGradient}
                >
                  <Bot size={24} color="#FFFFFF" />
                  <Text style={styles.chatButtonText}>Asistanla Konuş</Text>
                  <Sparkles size={16} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

        {/* AI Assistant */}
        <AIAssistant 
          isVisible={showAIAssistant}
          onClose={() => {
            console.log('AI asistan kapatılıyor');
            setShowAIAssistant(false);
          }}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 64) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  introSection: {
    marginBottom: 30,
  },
  introCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  introSparkle: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    marginBottom: 8,
  },
  introSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  featuresSection: {
    marginBottom: 30,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  featureGradient: {
    padding: 20,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
    marginBottom: 16,
  },
  featureAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  quickActionGradient: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonSection: {
    marginTop: 20,
  },
  chatButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  chatButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
  },
  chatButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 