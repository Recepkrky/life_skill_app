import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Switch,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Volume2, VolumeX, Moon, Sun, Globe, Users, CircleHelp as HelpCircle, Shield, Bell, Smartphone, ChevronRight, LogOut, X } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { progressService } from '@/utils/supabase';

export default function SettingsPage() {
  const { signOut, user } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showParentalControl, setShowParentalControl] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
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

  const handleParentalControl = async () => {
    setShowParentalControl(true);
    setLoading(true);
    
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

  const settingSections = [
    {
      title: 'Genel',
      items: [
        {
          icon: Users,
          title: 'Ebeveyn Kontrolü',
          description: 'İlerleme raporları ve ayarlar',
          type: 'navigation',
          onPress: handleParentalControl,
        },
        {
          icon: Globe,
          title: 'Dil',
          description: 'Türkçe',
          type: 'navigation',
          onPress: () => {},
        },
        {
          icon: Shield,
          title: 'Gizlilik',
          description: 'Veri güvenliği ve gizlilik ayarları',
          type: 'navigation',
          onPress: () => {},
        },
        {
          icon: HelpCircle,
          title: 'Yardım ve Destek',
          description: 'SSS ve iletişim',
          type: 'navigation',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Erişilebilirlik',
      items: [
        {
          icon: soundEnabled ? Volume2 : VolumeX,
          title: 'Ses Efektleri',
          description: 'Buton sesleri ve geri bildirimler',
          type: 'switch',
          value: soundEnabled,
          onToggle: setSoundEnabled,
        },
      ],
    },
    {
      title: 'Bildirimler',
      items: [
        {
          icon: Bell,
          title: 'Hatırlatmalar',
          description: 'Günlük pratik hatırlatmaları',
          type: 'switch',
          value: notifications,
          onToggle: setNotifications,
        },
      ],
    },
    {
      title: 'Hesap',
      items: [
        {
          icon: LogOut,
          title: 'Çıkış Yap',
          description: 'Hesabınızdan güvenli çıkış',
          type: 'navigation',
          onPress: handleSignOut,
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    if (item.type === 'switch') {
      return (
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <item.icon size={24} color="#4A90E2" strokeWidth={2} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingDescription}>{item.description}</Text>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#E9ECEF', true: '#4A90E2' }}
            thumbColor={item.value ? '#FFFFFF' : '#ADB5BD'}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.settingItem} onPress={item.onPress}>
        <View style={styles.settingIcon}>
          <item.icon size={24} color="#4A90E2" strokeWidth={2} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
        </View>
        <ChevronRight size={20} color="#ADB5BD" strokeWidth={2} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <Text style={styles.headerSubtitle}>
          Uygulamayı ihtiyaçlarına göre özelleştir
        </Text>
      </View>

      {/* Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.settingsCard}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex}>
                {renderSettingItem(item)}
                {itemIndex < section.items.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* App Info */}
      <View style={styles.section}>
        <View style={styles.appInfoCard}>
          <Text style={styles.appTitle}>Günlük Yaşam Senaryoları</Text>
          <Text style={styles.appVersion}>Sürüm 1.0.0</Text>
          <Text style={styles.appDescription}>
            Özel bireyler için güvenli ve etkili yaşam becerileri eğitimi
          </Text>
        </View>
      </View>

      {/* Parental Control Modal */}
      <Modal
        visible={showParentalControl}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowParentalControl(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Shield size={36} color="#4A90E2" />
              <Text style={styles.modalTitle}>Ebeveyn Kontrolü</Text>
              <Text style={styles.modalSubtitle}>Çocuğunuzun uygulamadaki ilerleme analizini görüntüleyin.</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowParentalControl(false)}
            >
              <X size={24} color="#7F8C8D" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalCard}>
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
        </View>
      </Modal>
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
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    lineHeight: 24,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginLeft: 56,
  },
  appInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeaderContent: {
    flex: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    marginTop: 4,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalCard: {
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
  },
});