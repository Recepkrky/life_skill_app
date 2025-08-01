import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  ImageBackground 
} from 'react-native';
import { router } from 'expo-router';
import { 
  Trophy, 
  Target, 
  Award, 
  Clock,
  ShoppingCart,
  Bus,
  CreditCard,
  Phone,
  Star,
  Zap,
  Flame
} from 'lucide-react-native';
import { scenarios } from '../../data/scenarios';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { progressService } from '../../utils/supabase';
import { useFocusEffect } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scenarioStatuses, setScenarioStatuses] = useState<{[key: string]: string}>({});
  const [scenarioProgress, setScenarioProgress] = useState<{[key: string]: number}>({});

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadUserData();
        loadScenarioStatuses();
        loadScenarioProgress();
      }
    }, [user])
  );

  const loadUserData = async () => {
    try {
      setLoading(true);
      const stats = await progressService.getUserStats(user?.id || '');
      setUserStats(stats);
      
      // Kullanıcının senaryo ilerlemesini al
      if (user?.id) {
        const progress = await progressService.getUserProgress(user.id);
        setUserProgress(progress);
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadScenarioStatuses = async () => {
    if (!user?.id) return;
    
    const statusData: {[key: string]: string} = {};
    for (const scenario of scenarios) {
      try {
        const status = await progressService.getScenarioStatus(user.id, scenario.id);
        statusData[scenario.id] = status;
      } catch (error) {
        console.error(`Senaryo ${scenario.id} durum hatası:`, error);
        statusData[scenario.id] = 'not-started';
      }
    }
    setScenarioStatuses(statusData);
  };

  const loadScenarioProgress = async () => {
    if (!user?.id) return;
    
    console.log('loadScenarioProgress başladı');
    
    const progressData: {[key: string]: number} = {};
    for (const scenario of scenarios) {
      try {
        console.log(`${scenario.id} için ilerleme hesaplanıyor...`);
        const percentage = await progressService.getScenarioProgressPercentage(user.id, scenario.id);
        console.log(`${scenario.id} ilerleme: ${percentage}%`);
        progressData[scenario.id] = percentage;
      } catch (error) {
        console.error(`Senaryo ${scenario.id} ilerleme hatası:`, error);
        progressData[scenario.id] = 0;
      }
    }
    console.log('Tüm ilerleme verileri:', progressData);
    setScenarioProgress(progressData);
  };

  const getScenarioProgress = async (scenarioId: string) => {
    if (!user?.id) return 0;
    
    try {
      const percentage = await progressService.getScenarioProgressPercentage(user.id, scenarioId);
      return percentage;
    } catch (error) {
      console.error('İlerleme hesaplama hatası:', error);
      return 0;
    }
  };

  const getScenarioStatus = (scenarioId: string) => {
    return scenarioStatuses[scenarioId] || 'not-started';
  };

  // Tarihi "2 saat önce" formatına çeviren fonksiyon
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Az önce';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInDays === 1) return 'Dün';
    if (diffInDays < 7) return `${diffInDays} gün önce`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} hafta önce`;
    return `${Math.floor(diffInDays / 30)} ay önce`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}s ${minutes}dk`;
  };



  // Senaryoları durumlarına göre sırala
  const sortedScenarios = scenarios.map(scenario => ({
    id: scenario.id,
    title: scenario.title,
    icon: scenario.icon,
    color: scenario.color,
    progress: scenarioProgress[scenario.id] || 0,
    status: getScenarioStatus(scenario.id),
  })).sort((a, b) => {
    // Önce yarıda bırakılanlar (in-progress)
    if (a.status === 'in-progress' && b.status !== 'in-progress') return -1;
    if (b.status === 'in-progress' && a.status !== 'in-progress') return 1;
    
    // Sonra hiç başlanmayanlar (not-started) - tamamlananlar hariç
    if (a.status === 'not-started' && b.status === 'completed') return -1;
    if (b.status === 'not-started' && a.status === 'completed') return 1;
    
    return 0;
  });

  // Hızlı erişim için senaryoları filtrele (tamamlananları hariç tut)
  const quickScenarios = sortedScenarios
    .filter(scenario => scenario.status !== 'completed')
    .slice(0, 4);

  const stats = [
    { 
      label: 'XP', 
      value: userStats ? userStats.total_score.toString() : '0', 
      icon: Zap, 
      color: '#FFD93D' 
    },
    { 
      label: 'Günlük Seri', 
      value: userStats ? userStats.current_streak.toString() : '0', 
      icon: Flame, 
      color: '#FF6B35' 
    },
    { 
      label: 'Toplam Süre', 
      value: userStats ? formatTime(userStats.total_time_spent) : '0s 0dk', 
      icon: Clock, 
      color: '#4ECDC4' 
    },
    { 
      label: 'Tamamlanan', 
      value: userStats ? userStats.total_scenarios_completed.toString() : '0', 
      icon: Award, 
      color: '#FFD93D' 
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.greetingContainer}>
            <Star size={24} color="#FFD93D" strokeWidth={2} fill="#FFD93D" />
            <Text style={styles.greeting}>Merhaba! 🎉</Text>
          </View>
          <Text style={styles.welcomeText}>
            Bugün hangi becerini geliştirmek istiyorsun? Hadi başlayalım! 💪
          </Text>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <TouchableOpacity key={index} style={styles.statCard}>
            <LinearGradient
              colors={['#FFFFFF', '#F8F9FA']}
              style={styles.statGradient}
            >
              <stat.icon size={28} color={stat.color} strokeWidth={2} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today's Challenge */}
      <View style={styles.challengeCard}>
        <ImageBackground
          source={{ uri: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.challengeBackground}
          imageStyle={styles.challengeImage}
        >
          <LinearGradient
            colors={['rgba(74, 144, 226, 0.9)', 'rgba(53, 122, 189, 0.8)']}
            style={styles.challengeOverlay}
          >
            <View style={styles.challengeContent}>
              <View style={styles.challengeBadge}>
                <Text style={styles.challengeBadgeText}>GÜNLÜK GÖREV</Text>
              </View>
              <Text style={styles.challengeTitle}>Market Kasiyeri ile Konuşma</Text>
              <Text style={styles.challengeDescription}>
                Nazik ifadeler kullanarak kasiyerle güzel bir konuşma yap
              </Text>
              <TouchableOpacity 
                style={styles.challengeButton}
                onPress={() => router.push('/scenarios/market-simple')}
              >
                <LinearGradient
                  colors={['#FFD93D', '#FFB800']}
                  style={styles.challengeButtonGradient}
                >
                  <Text style={styles.challengeButtonText}>Başla</Text>
                  <Trophy size={16} color="#FFFFFF" strokeWidth={2} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Quick Access Scenarios */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
          <Text style={styles.sectionSubtitle}>Önce yarıda bıraktıkların, sonra yeni senaryolar</Text>
        </View>
        {loading ? (
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4].map((_, index) => (
              <View key={index} style={styles.skeletonCard}>
                <View style={styles.skeletonIcon} />
                <View style={styles.skeletonContent}>
                  <View style={styles.skeletonTitle} />
                  <View style={styles.skeletonProgress} />
                  <View style={styles.skeletonBadge} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.scenarioGrid}>
            {quickScenarios.map((scenario) => (
              <TouchableOpacity
                key={scenario.id}
                style={styles.scenarioCard}
                onPress={() => router.push(`/scenarios/${scenario.id}`)}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  style={styles.scenarioGradient}
                >
                  <View style={[styles.scenarioIcon, { backgroundColor: scenario.color }]}>
                    <scenario.icon size={32} color="#FFFFFF" strokeWidth={2} />
                  </View>
                  <View style={styles.scenarioContent}>
                    <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <LinearGradient
                          colors={scenario.status === 'completed' ? ['#58CC02', '#4CAF50'] : 
                                 scenario.status === 'in-progress' ? ['#FFB800', '#FF9800'] : 
                                 ['#E9ECEF', '#DEE2E6']}
                          style={[
                            styles.progressFill, 
                            { width: `${scenario.progress}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {scenario.progress === 100 ? 'Tamamlandı' : 
                         scenario.progress > 0 ? `${scenario.progress}%` : 
                         'Henüz başlanmadı'}
                      </Text>
                    </View>
                    {scenario.status === 'in-progress' && (
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>Devam Et</Text>
                      </View>
                    )}
                    {scenario.status === 'not-started' && (
                      <View style={[styles.statusBadge, { backgroundColor: '#E3F2FD' }]}>
                        <Text style={[styles.statusBadgeText, { color: '#1976D2' }]}>Yeni</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Son Tamamlanan Senaryolar */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Tamamlanan Senaryolar</Text>
          <Text style={styles.sectionSubtitle}>Başarılarını kutluyoruz</Text>
        </View>
        <View style={styles.completedScenariosList}>
          {userProgress
            .filter(progress => progress.completed)
            .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
            .slice(0, 2)
            .map((progress) => {
              const scenario = scenarios.find(s => s.id === progress.scenario_id);
              if (!scenario) return null;
              
              const completedDate = new Date(progress.completed_at);
              const timeAgo = getTimeAgo(completedDate);
              
              return (
                <TouchableOpacity
                  key={progress.id}
                  style={styles.completedScenarioCard}
                  onPress={() => router.push(`/scenarios/${scenario.id}`)}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F8F9FA']}
                    style={styles.completedScenarioGradient}
                  >
                    <View style={[styles.completedScenarioIcon, { backgroundColor: scenario.color }]}>
                      <scenario.icon size={24} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    <View style={styles.completedScenarioContent}>
                      <Text style={styles.completedScenarioTitle}>{scenario.title}</Text>
                      <Text style={styles.completedScenarioScore}>Puan: {progress.score}/{scenario.maxScore}</Text>
                      <Text style={styles.completedScenarioTime}>{timeAgo}</Text>
                    </View>
                    <View style={styles.completedScenarioBadge}>
                      <Trophy size={16} color="#FFD93D" strokeWidth={2} fill="#FFD93D" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          {userProgress.filter(progress => progress.completed).length === 0 && (
            <View style={styles.emptyCompletedScenarios}>
              <Text style={styles.emptyCompletedScenariosText}>Henüz senaryo tamamlamadın</Text>
              <Text style={styles.emptyCompletedScenariosSubtext}>İlk senaryonu tamamla ve başarılarını kutlayalım!</Text>
            </View>
          )}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
          <Text style={styles.sectionSubtitle}>Başarılarını kutluyoruz</Text>
        </View>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#58CC02' }]}>
              <ShoppingCart size={20} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Market Alışverişi Tamamlandı</Text>
              <Text style={styles.activityTime}>2 saat önce</Text>
            </View>
            <View style={styles.activityBadge}>
              <Trophy size={16} color="#FFD93D" strokeWidth={2} fill="#FFD93D" />
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: '#4ECDC4' }]}>
              <Bus size={20} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Otobüs Yolculuğu Pratik</Text>
              <Text style={styles.activityTime}>Dün</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 110,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6C757D',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 20,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  challengeCard: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    height: 170,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  challengeBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  challengeImage: {
    borderRadius: 25,
  },
  challengeOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  challengeContent: {
    alignItems: 'center',
  },
  challengeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  challengeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  challengeButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  challengeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
  },
  challengeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  scenarioGrid: {
    gap: 16,
  },
  scenarioCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  scenarioGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  scenarioIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scenarioContent: {
    flex: 1,
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '600',
    minWidth: 35,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#6C757D',
  },
  activityBadge: {
    marginLeft: 8,
  },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  completedScenariosList: {
    gap: 12,
  },
  completedScenarioCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  completedScenarioGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  completedScenarioIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  completedScenarioContent: {
    flex: 1,
  },
  completedScenarioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  completedScenarioScore: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
  },
  completedScenarioTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  completedScenarioBadge: {
    marginLeft: 8,
  },
  emptyCompletedScenarios: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyCompletedScenariosText: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 8,
  },
  emptyCompletedScenariosSubtext: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
  },
  skeletonGrid: {
    gap: 16,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  skeletonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#B0BEC5',
    marginRight: 16,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonTitle: {
    width: '80%',
    height: 20,
    backgroundColor: '#B0BEC5',
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonProgress: {
    width: '60%',
    height: 6,
    backgroundColor: '#B0BEC5',
    borderRadius: 3,
    marginBottom: 8,
  },
  skeletonBadge: {
    width: 80,
    height: 20,
    backgroundColor: '#B0BEC5',
    borderRadius: 10,
  },
});