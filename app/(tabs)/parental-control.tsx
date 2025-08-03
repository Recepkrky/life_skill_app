import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Shield } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { progressService } from '@/utils/supabase';

export default function ParentalControlPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (user?.id) {
        try {
          const result = await progressService.getUserStats(user.id);
          setStats(result);
        } catch (e) {
          setStats(null);
        }
      }
      setLoading(false);
    };
    loadStats();
  }, [user]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Shield size={36} color="#4A90E2" />
        <Text style={styles.title}>Ebeveyn Kontrolü</Text>
        <Text style={styles.subtitle}>Çocuğunuzun uygulamadaki ilerleme analizini görüntüleyin.</Text>
      </View>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : stats ? (
          <>
            <Text style={styles.analysisTitle}>İlerleme Analizi</Text>
            <Text style={styles.analysisText}>Tamamlanan Senaryo: {stats.total_scenarios_completed}</Text>
            <Text style={styles.analysisText}>Toplam Puan: {stats.total_score}</Text>
            <Text style={styles.analysisText}>Toplam Süre: {Math.floor((stats.total_time_spent || 0) / 60)} dk</Text>
            <Text style={styles.analysisText}>Mevcut Seri: {stats.current_streak} gün</Text>
            <Text style={styles.analysisText}>En Uzun Seri: {stats.longest_streak} gün</Text>
          </>
        ) : (
          <Text style={styles.analysisText}>İlerleme verisi bulunamadı.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 16,
    color: '#4A90E2',
    marginBottom: 8,
  }
});
