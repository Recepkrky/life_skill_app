import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Scenario } from '@/types';

interface ScenarioCardProps {
  scenario: Scenario;
  onPress: () => void;
}

export default function ScenarioCard({ scenario, onPress }: ScenarioCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return '#4A90E2';
      case 'Orta': return '#F5A623';
      case 'Zor': return '#E74C3C';
      default: return '#7F8C8D';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: scenario.color }]}>
        <scenario.icon size={28} color="#FFFFFF" strokeWidth={2} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{scenario.title}</Text>
          {scenario.completed && (
            <CheckCircle size={20} color="#4A90E2" strokeWidth={2} />
          )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {scenario.description}
        </Text>
        
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={[
              styles.difficulty,
              { color: getDifficultyColor(scenario.difficulty) }
            ]}>
              {scenario.difficulty}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.stepCount}>
              {scenario.steps?.length || 0} adım
            </Text>
          </View>
        </View>
      </View>
      
      <ChevronRight size={20} color="#ADB5BD" strokeWidth={2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepCount: {
    fontSize: 12,
    color: '#ADB5BD',
  },
});