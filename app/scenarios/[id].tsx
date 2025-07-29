import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  XCircle,
  MessageCircle,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon,
  Trophy,
  Star,
  Clock
} from 'lucide-react-native';
import { getScenarioById, calculateScore } from '@/data/scenarios';
import { SimpleScenario, ScenarioStep } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { progressService } from '@/utils/supabase';

export default function ScenarioPage() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [scenarioCompleted, setScenarioCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [startTime, setStartTime] = useState<number>(Date.now());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const scenario = getScenarioById(id as string) as SimpleScenario;
  const currentStep = scenario?.steps[currentStepIndex];

  useEffect(() => {
    if (scenario) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [scenario]);

  const handleOptionSelect = (optionId: string) => {
    if (!currentStep) return;

    setSelectedOption(optionId);
    const option = currentStep.options.find(opt => opt.id === optionId);
    
    if (option) {
      setIsCorrect(option.isCorrect);
      
      if (option.isCorrect) {
        setFeedbackMessage('Harika! Doğru cevap! 🎉');
      } else {
        setFeedbackMessage(option.feedback || 'Tekrar dene! 💪');
      }
      
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (!currentStep) return;

    if (isCorrect) {
      // Doğru cevabı kaydet
      setUserAnswers(prev => ({ ...prev, [currentStep.id]: selectedOption! }));
      
      // Doğru cevap - bir sonraki adıma geç
      if (currentStep.nextStepId) {
        const nextIndex = scenario.steps.findIndex(step => step.id === currentStep.nextStepId);
        if (nextIndex !== -1) {
          setCurrentStepIndex(nextIndex);
          setSelectedOption(null);
          setShowFeedback(false);
          setIsCorrect(false);
        }
      } else {
        // Senaryo tamamlandı
        setScenarioCompleted(true);
      }
    } else {
      // Yanlış cevap - aynı adımda kal
      setSelectedOption(null);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep?.previousStepId) {
      const previousIndex = scenario.steps.findIndex(step => step.id === currentStep.previousStepId);
      if (previousIndex !== -1) {
        setCurrentStepIndex(previousIndex);
        setSelectedOption(null);
        setShowFeedback(false);
        setIsCorrect(false);
      }
    }
  };

  const resetScenario = () => {
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setScenarioCompleted(false);
    setCorrectAnswers(0);
    setUserAnswers({});
  };

  // Doğru cevap sayısını hesapla
  const calculateCorrectAnswers = () => {
    let correct = 0;
    scenario.steps.forEach(step => {
      if (userAnswers[step.id] === step.correctOptionId) {
        correct++;
      }
    });
    return correct;
  };

  // Senaryo tamamlandığında puan hesapla
  const finalScore = scenarioCompleted ? calculateScore(scenario, calculateCorrectAnswers()) : 0;
  const totalCorrect = scenarioCompleted ? calculateCorrectAnswers() : 0;

  // Senaryo tamamlandığında ilerlemeyi kaydet
  useEffect(() => {
    if (scenarioCompleted && user) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // saniye cinsinden
      
      progressService.saveScenarioProgress(
        user.id,
        id as string,
        finalScore,
        totalCorrect,
        scenario.steps.length,
        timeSpent
      ).then(() => {
        // Kullanıcı istatistiklerini güncelle
        progressService.updateUserStats(user.id);
      }).catch((error) => {
        console.error('İlerleme kaydetme hatası:', error);
      });
    }
  }, [scenarioCompleted, user, id, finalScore, totalCorrect, startTime]);

  if (!scenario) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Senaryo bulunamadı</Text>
      </View>
    );
  }

  if (scenarioCompleted) {
    return (
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{scenario.title}</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.completionContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={styles.completionCard}
          >
            <Trophy size={80} color="#FFD93D" strokeWidth={2} fill="#FFD93D" />
            <Text style={styles.completionTitle}>Tebrikler! 🎉</Text>
            <Text style={styles.completionText}>
              {scenario.title} senaryosunu başarıyla tamamladın!
            </Text>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreTitle}>Senaryo Sonucu</Text>
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreText}>Doğru Cevap: {totalCorrect}/{scenario.steps.length}</Text>
                <Text style={styles.scoreText}>Puan: {finalScore}/{scenario.maxScore}</Text>
                <Text style={styles.difficultyText}>Zorluk: {scenario.difficulty}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.resetButton} onPress={resetScenario}>
              <LinearGradient
                colors={['#FFD93D', '#FFB800']}
                style={styles.resetButtonGradient}
              >
                <RotateCcw size={20} color="#FFFFFF" />
                <Text style={styles.resetButtonText}>Tekrar Oyna</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{scenario.title}</Text>
        <TouchableOpacity onPress={resetScenario} style={styles.resetButton}>
          <RotateCcw size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Info */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Soru {currentStepIndex + 1}/{scenario.steps.length}
          </Text>
        </View>

        {/* Question Card */}
        <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
          {currentStep?.imageUrl && (
            <Image 
              source={{ uri: currentStep.imageUrl }} 
              style={styles.scenarioImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.questionText}>{currentStep?.question}</Text>
        </Animated.View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentStep?.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOption === option.id && styles.selectedOption,
                selectedOption === option.id && option.isCorrect && styles.correctOption,
                selectedOption === option.id && !option.isCorrect && styles.wrongOption,
              ]}
              onPress={() => handleOptionSelect(option.id)}
              disabled={selectedOption !== null}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionLetter}>{option.id.toUpperCase()}</Text>
                <Text style={[
                  styles.optionText,
                  selectedOption === option.id && styles.selectedOptionText,
                ]}>
                  {option.text}
                </Text>
              </View>
              {selectedOption === option.id && (
                option.isCorrect ? (
                  <CheckCircle size={24} color="#4CAF50" />
                ) : (
                  <XCircle size={24} color="#E74C3C" />
                )
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback */}
        {showFeedback && (
          <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
            <MessageCircle size={20} color={isCorrect ? "#4CAF50" : "#E74C3C"} />
            <Text style={[
              styles.feedbackText,
              { color: isCorrect ? "#4CAF50" : "#E74C3C" }
            ]}>
              {feedbackMessage}
            </Text>
          </Animated.View>
        )}

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          {currentStep?.previousStepId && (
            <TouchableOpacity 
              style={styles.previousButton} 
              onPress={handlePrevious}
            >
              <ArrowLeftIcon size={20} color="#FFFFFF" />
              <Text style={styles.previousButtonText}>Önceki</Text>
            </TouchableOpacity>
          )}
          
          {showFeedback && (
            <TouchableOpacity 
              style={[
                styles.nextButton,
                { 
                  backgroundColor: isCorrect ? '#4CAF50' : '#E74C3C',
                }
              ]} 
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {isCorrect ? 'Devam Et' : 'Tekrar Dene'}
              </Text>
              {isCorrect && <ArrowRight size={20} color="#FFFFFF" />}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B', // Koyu arka plan
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1E293B',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  progressContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: '#334155',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  scenarioImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLetter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0F9FF',
  },
  wrongOption: {
    borderColor: '#E74C3C',
    backgroundColor: '#FEF2F2',
  },
  optionText: {
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#64748B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  previousButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  completionCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 12,
  },
  completionText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  scoreContainer: {
    backgroundColor: '#F8F9FA',
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    width: '100%',
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreDetails: {
    gap: 8,
  },
  scoreText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  difficultyText: {
    fontSize: 16,
    color: '#4A90E2',
    textAlign: 'center',
    fontWeight: '600',
  },
  resetButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  resetButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 100,
  },
});