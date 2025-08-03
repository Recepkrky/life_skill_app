import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  TextInput 
} from 'react-native';
import { router } from 'expo-router';
import { 
  Search,
  Coffee,
  Car,
  Users,
  Filter,
  Trophy,
  Star,
  Zap,
  Phone,
  BookOpen,
  Heart,
  Gamepad2
} from 'lucide-react-native';
import { scenarios, getScenariosByCategory } from '../../data/scenarios';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { progressService } from '../../utils/supabase';
import { useFocusEffect } from 'expo-router';

const categories = [
  { id: 'all', name: 'Tümü', icon: Filter, color: '#4A90E2' },
  { id: 'Günlük', name: 'Günlük', icon: Coffee, color: '#FF6B35' },
  { id: 'Ulaşım', name: 'Ulaşım', icon: Car, color: '#4ECDC4' },
  { id: 'Sağlık', name: 'Sağlık', icon: Users, color: '#FFD93D' },
  { id: 'Teknoloji', name: 'Teknoloji', icon: Phone, color: '#9B59B6' },
  { id: 'Eğitim', name: 'Eğitim', icon: BookOpen, color: '#3498DB' },
];

export default function ScenariosPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserProgress = async () => {
    try {
      if (user?.id) {
        const progress = await progressService.getUserProgress(user.id);
        setUserProgress(progress);
      }
    } catch (error) {
      console.error('İlerleme yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const [scenarioProgress, setScenarioProgress] = useState<{[key: string]: number}>({});
  const [scenarioStatuses, setScenarioStatuses] = useState<{[key: string]: string}>({});

  // Senaryo ilerlemelerini ve durumlarını yükle
  const loadScenarioData = async () => {
    if (!user?.id) return;
    
    const progressData: {[key: string]: number} = {};
    const statusData: {[key: string]: string} = {};
    
    for (const scenario of scenarios) {
      try {
        const percentage = await progressService.getScenarioProgressPercentage(user.id, scenario.id);
        const status = await progressService.getScenarioStatus(user.id, scenario.id);
        progressData[scenario.id] = percentage;
        statusData[scenario.id] = status;
      } catch (error) {
        console.error(`Senaryo ${scenario.id} veri yükleme hatası:`, error);
        progressData[scenario.id] = 0;
        statusData[scenario.id] = 'not-started';
      }
    }
    setScenarioProgress(progressData);
    setScenarioStatuses(statusData);
  };

  useEffect(() => {
    loadScenarioData();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadScenarioData();
      }
    }, [user])
  );

  const getScenarioProgress = (scenarioId: string) => {
    return scenarioProgress[scenarioId] || 0;
  };

  const getScenarioStatus = (scenarioId: string) => {
    return scenarioStatuses[scenarioId] || 'not-started';
  };

  // Senaryoları zorluk seviyesine göre gruplandır ve sırala
  const getGroupedAndSortedScenarios = () => {
    // Önce filtrele
    const filtered = scenarios.filter(scenario => {
      const matchesCategory = selectedCategory === 'all' || scenario.category === selectedCategory;
      const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Zorluk seviyelerine göre gruplandır
    const grouped: { [key: string]: any[] } = {
      'Kolay': filtered.filter(s => s.difficulty === 'Kolay'),
      'Orta': filtered.filter(s => s.difficulty === 'Orta'),
      'Zor': filtered.filter(s => s.difficulty === 'Zor'),
    };

    // Her grup içinde adım sayısına göre sırala
    Object.keys(grouped).forEach(difficulty => {
      grouped[difficulty].sort((a: any, b: any) => a.steps.length - b.steps.length);
    });

    return grouped;
  };

  const groupedScenarios = getGroupedAndSortedScenarios();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return '#4A90E2';
      case 'Orta': return '#FFD93D';
      case 'Zor': return '#E74C3C';
      default: return '#6C757D';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Trophy size={24} color="#FFD93D" strokeWidth={2} fill="#FFD93D" />
            <Text style={styles.headerTitle}>Senaryolar</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Günlük yaşam becerilerini pratik yaparak öğren 🎯
          </Text>
        </View>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchGradient}>
          <Search size={20} color="#6C757D" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Senaryo ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#ADB5BD"
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryButton}
            onPress={() => setSelectedCategory(category.id)}
          >
            <LinearGradient
              colors={
                selectedCategory === category.id 
                  ? [category.color, `${category.color}80`]
                  : ['#FFFFFF', '#F8F9FA']
              }
              style={styles.categoryGradient}
            >
              <category.icon 
                size={20} 
                color={selectedCategory === category.id ? '#FFFFFF' : '#6C757D'} 
                strokeWidth={2} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Scenarios List */}
      <ScrollView 
        style={styles.scenariosList} 
        contentContainerStyle={styles.scenariosContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedScenarios).map(([difficulty, scenarios]) => (
          scenarios.length > 0 && (
            <View key={difficulty} style={styles.difficultySection}>
              <View style={styles.difficultyHeader}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) }]}>
                  <Text style={styles.difficultyBadgeText}>{difficulty}</Text>
                </View>
                <Text style={styles.difficultyCount}>{scenarios.length} senaryo</Text>
              </View>
              
              {scenarios.map((scenario) => (
                <TouchableOpacity
                  key={scenario.id}
                  style={styles.scenarioCard}
                  onPress={() => router.push(`/scenarios/${scenario.id}`)}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F8F9FA']}
                    style={styles.scenarioGradient}
                  >
                    <View style={[styles.scenarioIconContainer, { backgroundColor: scenario.color }]}>
                      <scenario.icon size={28} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    
                    <View style={styles.scenarioContent}>
                      <View style={styles.scenarioHeader}>
                        <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                        {getScenarioProgress(scenario.id) === 100 && (
                          <View style={styles.completedBadge}>
                            <Trophy size={12} color="#FFFFFF" strokeWidth={2} fill="#FFFFFF" />
                          </View>
                        )}
                      </View>
                      
                      <Text style={styles.scenarioDescription}>
                        {scenario.description}
                      </Text>
                      
                      <View style={styles.scenarioMeta}>
                        <View style={styles.metaItem}>
                          <Text style={[
                            styles.difficultyText,
                            { color: getDifficultyColor(scenario.difficulty) }
                          ]}>
                            {scenario.difficulty}
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Text style={styles.durationText}>{scenario.steps.length} adım</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Text style={styles.categoryText}>{scenario.category}</Text>
                        </View>
                      </View>
                      
                      {/* Progress Bar */}
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <LinearGradient
                            colors={
                              getScenarioProgress(scenario.id) === 100 ? ['#58CC02', '#4CAF50'] : 
                              getScenarioProgress(scenario.id) > 0 ? ['#FFB800', '#FF9800'] : 
                              ['#E9ECEF', '#E9ECEF']
                            }
                            style={[
                              styles.progressFill,
                              { width: `${getScenarioProgress(scenario.id)}%` }
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {getScenarioProgress(scenario.id) === 100 ? 'Tamamlandı' : 
                           getScenarioProgress(scenario.id) > 0 ? `${getScenarioProgress(scenario.id)}% tamamlandı` : 
                           'Henüz başlanmadı'}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          )
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  categoriesContainer: {
    maxHeight: 60,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  scenariosList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scenariosContent: {
    flexGrow: 1,
    paddingBottom: 110,
  },
  scenarioCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
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
  scenarioIconContainer: {
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
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  completedBadge: {
            backgroundColor: '#4A90E2',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
    marginBottom: 12,
  },
  scenarioMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  durationText: {
    fontSize: 14,
    color: '#6C757D',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  difficultySection: {
    marginBottom: 24,
  },
  difficultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  difficultyCount: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
});