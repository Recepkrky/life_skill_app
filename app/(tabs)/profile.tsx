import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  Alert 
} from 'react-native';
import { 
  User,
  Target,
  Award,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  BookOpen,
  LogOut,
  Settings
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { progressService, analyticsService } from '@/utils/supabase';
import { LinearGradient } from 'expo-linear-gradient';

const getAchievements = (userStats: any) => {
  if (!userStats) {
    return [
      {
        id: 1,
        title: 'İlk Adım',
        description: 'İlk senaryonu tamamladın!',
        icon: Target,
        color: '#4A90E2',
        earned: false,
      },
      {
        id: 2,
        title: 'Konuşkan',
        description: '10 diyalog tamamladın',
        icon: BookOpen,
        color: '#4A90E2',
        earned: false,
      },
      {
        id: 3,
        title: 'Sebatlı',
        description: '7 gün üst üste pratik yaptın',
        icon: Calendar,
        color: '#F5A623',
        earned: false,
      },
      {
        id: 4,
        title: 'Uzman',
        description: 'Tüm zorluk seviyelerini denedin',
        icon: Award,
        color: '#9013FE',
        earned: false,
      },
    ];
  }

  return [
    {
      id: 1,
      title: 'İlk Adım',
      description: 'İlk senaryonu tamamladın!',
      icon: Target,
      color: '#4A90E2',
      earned: userStats.total_scenarios_completed >= 1,
    },
    {
      id: 2,
      title: 'Konuşkan',
      description: '10 diyalog tamamladın',
      icon: BookOpen,
              color: '#4A90E2',
      earned: userStats.total_scenarios_completed >= 10,
    },
    {
      id: 3,
      title: 'Sebatlı',
      description: '7 gün üst üste pratik yaptın',
      icon: Calendar,
      color: '#F5A623',
      earned: userStats.current_streak >= 7,
    },
    {
      id: 4,
      title: 'Uzman',
      description: 'Tüm zorluk seviyelerini denedin',
      icon: Award,
      color: '#9013FE',
      earned: userStats.total_scenarios_completed >= 50,
    },
  ];
};

const weeklyProgress = [
  { day: 'Pzt', completed: 3, target: 3 },
  { day: 'Sal', completed: 2, target: 3 },
  { day: 'Çar', completed: 4, target: 3 },
  { day: 'Per', completed: 1, target: 3 },
  { day: 'Cum', completed: 3, target: 3 },
  { day: 'Cmt', completed: 0, target: 3 },
  { day: 'Paz', completed: 2, target: 3 },
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const stats = await progressService.getUserStats(user?.id || '');
      setUserStats(stats);
      
      // Haftalık verileri yükle
      if (user?.id) {
        const dailyActivity = await analyticsService.getDailyActivity(user.id, 7);
        const weeklyProgress = generateWeeklyProgress(dailyActivity);
        setWeeklyData(weeklyProgress);
      }
    } catch (error) {
      console.error('Stats yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyProgress = (dailyActivity: any[]) => {
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      
      // O günün aktivitesini bul
      const dayActivity = dailyActivity.filter(activity => {
        const activityDate = new Date(activity.completed_at);
        return activityDate.toDateString() === date.toDateString();
      });

      weekData.push({
        day: dayName,
        completed: dayActivity.length,
        target: 3, // Günlük hedef
      });
    }

    return weekData;
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}s ${minutes}dk`;
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.email || 'Misafir Kullanıcı'}
            </Text>
            <Text style={styles.userLevel}>
              {user ? 'Giriş Yapıldı' : 'Misafir Modu'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
            <LogOut size={24} color="#FFFFFF" />
            <Text style={styles.logoutText}>Çıkış</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Genel Durum</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#4A90E2' }]}>
              <Target size={24} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>
              {userStats ? userStats.total_scenarios_completed : '0'}
            </Text>
            <Text style={styles.statLabel}>Tamamlanan</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#4A90E2' }]}>
              <TrendingUp size={24} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>
              {userStats && userStats.total_scenarios_completed > 0 
                ? `${Math.round((userStats.total_score / (userStats.total_scenarios_completed * 100)) * 100)}%`
                : '0%'
              }
            </Text>
            <Text style={styles.statLabel}>Başarı Oranı</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F5A623' }]}>
              <Clock size={24} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>
              {userStats ? formatTime(userStats.total_time_spent) : '0s 0dk'}
            </Text>
            <Text style={styles.statLabel}>Toplam Süre</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#9013FE' }]}>
              <Star size={24} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>
              {userStats ? userStats.total_score.toLocaleString() : '0'}
            </Text>
            <Text style={styles.statLabel}>Toplam Puan</Text>
          </View>
        </View>
      </View>

      {/* Weekly Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bu Hafta</Text>
        <View style={styles.weeklyChart}>
          {(weeklyData.length > 0 ? weeklyData : weeklyProgress).map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <Text style={styles.dayLabel}>{day.day}</Text>
              <View style={styles.progressColumn}>
                <View style={styles.progressTrack}>
                  <View 
                    style={[
                      styles.progressBar,
                      { 
                        height: `${Math.min((day.completed / day.target) * 100, 100)}%`,
                        backgroundColor: day.completed >= day.target ? '#4A90E2' : '#357ABD'
                      }
                    ]} 
                  />
                </View>
              </View>
              <Text style={styles.progressText}>{day.completed}/{day.target}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Başarılar</Text>
        <View style={styles.achievementsList}>
          {getAchievements(userStats).map((achievement: any) => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementCard,
                !achievement.earned && styles.achievementCardLocked
              ]}
            >
              <View style={[
                styles.achievementIcon,
                { backgroundColor: achievement.earned ? achievement.color : '#E9ECEF' }
              ]}>
                <achievement.icon 
                  size={24} 
                  color={achievement.earned ? '#FFFFFF' : '#ADB5BD'} 
                  strokeWidth={2} 
                />
              </View>
              <View style={styles.achievementContent}>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.earned && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.earned && styles.achievementDescriptionLocked
                ]}>
                  {achievement.description}
                </Text>
              </View>
              {achievement.earned && (
                <View style={styles.earnedBadge}>
                  <Text style={styles.earnedText}>✓</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
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
    paddingBottom: 120,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  statsSection: {
    padding: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  weeklyChart: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
    fontWeight: '600',
  },
  progressColumn: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  progressTrack: {
    width: 8,
    height: 60,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
  },
  progressText: {
    fontSize: 10,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#ADB5BD',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  achievementDescriptionLocked: {
    color: '#CED4DA',
  },
  earnedBadge: {
            backgroundColor: '#4A90E2',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});